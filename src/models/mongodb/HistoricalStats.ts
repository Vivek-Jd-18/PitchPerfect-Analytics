import mongoose, { Document, Schema } from 'mongoose';

export interface IHistoricalStats extends Document {
  playerId: string;
  matchesPlayed: number;
  totalRuns: number;
  battingAverage: number;
  strikeRate: number;
  wicketsTaken: number;
  bowlingAverage: number;
  bestBowlingFigures: string;
  dynamicMetrics: Map<string, any>; // Highly fluid metric tracking
  updatedAt: Date;
}

const HistoricalStatsSchema: Schema = new Schema(
  {
    playerId: { type: String, required: true, unique: true, index: true },
    matchesPlayed: { type: Number, required: true, default: 0 },
    totalRuns: { type: Number, required: true, default: 0 },
    battingAverage: { type: Number, required: true, default: 0 },
    strikeRate: { type: Number, required: true, default: 0 },
    wicketsTaken: { type: Number, required: true, default: 0 },
    bowlingAverage: { type: Number, required: true, default: 0 },
    bestBowlingFigures: { type: String, default: '0/0' },
    dynamicMetrics: { type: Map, of: Schema.Types.Mixed, default: new Map() },
  },
  {
    timestamps: true,
  }
);

export const HistoricalStats = mongoose.model<IHistoricalStats>(
  'HistoricalStats',
  HistoricalStatsSchema
);
