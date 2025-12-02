import mongoose, { Schema, Model } from 'mongoose';

export enum MatchStatus {
  PENDING = 'pending',
  MATCHED = 'matched',
  UNMATCHED = 'unmatched',
}

export interface IMatch {
  _id: string;
  userAId: string;
  userBId: string;
  status: MatchStatus;
  score?: number;
  explanation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    _id: { type: String, required: true },
    userAId: { type: String, ref: 'User', required: true },
    userBId: { type: String, ref: 'User', required: true },
    status: {
      type: String,
      enum: Object.values(MatchStatus),
      default: MatchStatus.PENDING,
    },
    score: { type: Number, min: 0, max: 100 },
    explanation: String,
  },
  {
    timestamps: true,
    _id: false,
  }
);

// Compound index to prevent duplicate matches
MatchSchema.index({ userAId: 1, userBId: 1 }, { unique: true });

export const Match: Model<IMatch> =
  mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
