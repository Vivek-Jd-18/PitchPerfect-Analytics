import mongoose, { Document, Schema } from 'mongoose';

export interface IMatchLog extends Document {
  matchId: string;
  ballNumber: number;
  overNumber: number;
  batsmanId: string;
  bowlerId: string;
  runs: number;
  isWicket: boolean;
  extras: number;
  metadata: Record<string, any>; // Flexible payload for unstructured data
  createdAt: Date;
}

const MatchLogSchema: Schema = new Schema(
  {
    matchId: { type: String, required: true, index: true },
    ballNumber: { type: Number, required: true },
    overNumber: { type: Number, required: true },
    batsmanId: { type: String, required: true, index: true },
    bowlerId: { type: String, required: true, index: true },
    runs: { type: Number, required: true, default: 0 },
    isWicket: { type: Boolean, required: true, default: false },
    extras: { type: Number, required: true, default: 0 },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient ball-by-ball querying
MatchLogSchema.index({ matchId: 1, overNumber: 1, ballNumber: 1 });

export const MatchLog = mongoose.model<IMatchLog>('MatchLog', MatchLogSchema);
