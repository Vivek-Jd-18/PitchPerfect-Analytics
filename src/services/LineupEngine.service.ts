import { prisma } from '../config/prisma';
import { HistoricalStats } from '../models/mongodb/HistoricalStats';
import { MatchLog } from '../models/mongodb/MatchLog';

export interface ScoredPlayer {
  id: string;
  name: string;
  role: string;
  score: number;
}

export class LineupEngineService {
  /**
   * Calculates the optimal playing 11 from a given squad based on pitch conditions,
   * combining historical base stats and recent match form.
   *
   * @param pitchCondition Contextual string evaluating pitch conditions (e.g., 'DUSTY_SPIN', 'GREEN_SEAM', 'FLAT_TRACK')
   * @param availableSquadIds Array of Prisma Player IDs
   * @returns Array of the top 11 ScoredPlayer objects
   */
  static async calculateOptimal11(pitchCondition: string, availableSquadIds: string[]): Promise<ScoredPlayer[]> {
    // 1. Fetch base player data from PostgreSQL
    const players = await prisma.player.findMany({
      where: {
        id: { in: availableSquadIds },
      },
    });

    // 2. Fetch recent MatchLogs and HistoricalStats from MongoDB in parallel
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentLogs, historicalStats] = await Promise.all([
      MatchLog.find({
        $or: [
          { batsmanId: { $in: availableSquadIds } },
          { bowlerId: { $in: availableSquadIds } }
        ],
        createdAt: { $gte: thirtyDaysAgo }
      }).lean(),
      HistoricalStats.find({
        playerId: { $in: availableSquadIds }
      }).lean()
    ]);

    // Pre-compute fast lookups for unstructured data
    const logsByPlayer = recentLogs.reduce((acc: Record<string, any[]>, log: any) => {
      if (log.batsmanId) {
        acc[log.batsmanId] = acc[log.batsmanId] || [];
        acc[log.batsmanId].push(log);
      }
      if (log.bowlerId) {
        acc[log.bowlerId] = acc[log.bowlerId] || [];
        acc[log.bowlerId].push(log);
      }
      return acc;
    }, {});

    const statsByPlayer = historicalStats.reduce((acc: Record<string, any>, stat: any) => {
      acc[stat.playerId] = stat;
      return acc;
    }, {});

    // 3. Scoring Engine
    const scoredPlayers: ScoredPlayer[] = players.map(player => {
      let baseScore = 50; // default starting score

      const stats = statsByPlayer[player.id];
      const recentForm = logsByPlayer[player.id] || [];

      // Adjust based on historical performance (Postgres -> Mongoose linking)
      if (stats) {
        if (player.role.toLowerCase().includes('batsman') && stats.battingAverage > 40) baseScore += 15;
        if (player.role.toLowerCase().includes('bowler') && stats.bowlingAverage < 25 && stats.bowlingAverage > 0) baseScore += 15;
      }

      // Adjust based on recent form (last 30 days)
      if (recentForm.length > 0) {
        // Simple form metric: add points for high involvement/runs/wickets recently
        const recentRuns = recentForm.filter((log: any) => log.batsmanId === player.id).reduce((sum: number, log: any) => sum + log.runs, 0);
        const recentWickets = recentForm.filter((log: any) => log.bowlerId === player.id && log.isWicket).length;
        
        baseScore += (recentRuns / 10); // 1 point per 10 recent runs
        baseScore += (recentWickets * 3); // 3 points per recent wicket
      }

      // 4. Pitch Condition Weighting System
      const roleStr = player.role.toUpperCase();
      
      switch (pitchCondition) {
        case 'DUSTY_SPIN':
          if (roleStr.includes('SPIN')) {
            baseScore *= 1.3; // 30% boost for spinners on dusty pitches
          } else if (roleStr.includes('PACE')) {
            baseScore *= 0.8; // 20% penalty for pace bowlers
          }
          break;
          
        case 'GREEN_SEAM':
          if (roleStr.includes('PACE') || roleStr.includes('SEAM')) {
            baseScore *= 1.35; // 35% boost for seamers on green tracks
          } else if (roleStr.includes('SPIN')) {
            baseScore *= 0.7; // 30% penalty for spinners
          }
          break;
          
        case 'FLAT_TRACK':
          if (roleStr.includes('BATSMAN')) {
            baseScore *= 1.25; // 25% boost for pure batsmen
          }
          break;
          
        default:
          break; // Neutral condition
      }

      return {
        id: player.id,
        name: player.name,
        role: player.role,
        score: parseFloat(baseScore.toFixed(2))
      };
    });

    // Sort descending by score and return the top 11
    scoredPlayers.sort((a, b) => b.score - a.score);
    return scoredPlayers.slice(0, 11);
  }
}
