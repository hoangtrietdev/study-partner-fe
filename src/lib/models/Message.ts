import mongoose, { Schema, Model } from 'mongoose';

export interface IMessage {
  _id: string;
  matchId: string;
  senderId: string;
  recipientId: string;
  content: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    _id: { type: String, required: true },
    matchId: { type: String, ref: 'Match', required: true },
    senderId: { type: String, ref: 'User', required: true },
    recipientId: { type: String, ref: 'User', required: true },
    content: { type: String, required: true },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    _id: false,
  },
);

// Index for efficient queries
MessageSchema.index({ matchId: 1, createdAt: -1 });

export const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
