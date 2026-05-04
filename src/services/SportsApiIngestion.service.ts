import cron from 'node-cron';
import { MatchLog } from '../models/mongodb/MatchLog';
import { broadcastLiveScore } from '../config/socket';

export class SportsApiIngestionService {
  /**
   * Initializes scheduled tasks for polling external APIs.
   * Runs every minute.
   */
  static init() {
    console.log('⏱️ Initializing Sports API Ingestion Scheduler...');
    
    // Poll every minute
    cron.schedule('* * * * *', async () => {
      try {
        await this.fetchAndIngestLiveMatchData();
      } catch (error) {
        console.error('Error during scheduled API ingestion:', error);
      }
    });
  }

  private static async fetchAndIngestLiveMatchData() {
    // Simulated fetch from a third-party API (e.g., CricAPI)
    // const response = await fetch('https://api.external-sports-data.com/v1/live');
    // const data = await response.json();
    
    // Mock Payload
    const mockExternalPayload = {
      matchId: 'live_match_xyz123',
      ballNumber: Math.floor(Math.random() * 6) + 1,
      overNumber: Math.floor(Math.random() * 50),
      batsmanId: 'player_a_uuid',
      bowlerId: 'player_b_uuid',
      runs: Math.floor(Math.random() * 7),
      isWicket: Math.random() > 0.95,
      extras: 0,
      metadata: { pitchSpeed: '142km/h', shotType: 'Cover Drive' }
    };

    // Write unstructured high-velocity data to MongoDB
    const newLog = await MatchLog.create(mockExternalPayload);
    
    // Emit the update via WebSockets to connected Next.js clients
    broadcastLiveScore(mockExternalPayload.matchId, newLog);
  }
}
