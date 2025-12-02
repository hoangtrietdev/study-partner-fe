import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  imageUrl?: string;
  schoolName: string;
  age: number;
  major: string;
  faculty: string;
  interests: string[];
  bio: string;
  settings: {
    aiSuggestionsEnabled: boolean;
    notifications: boolean;
    darkMode: boolean;
  };
  lastSeenAt: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    _id: { type: String, required: true },
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imageUrl: String,
    schoolName: { type: String, required: true },
    age: { type: Number, required: true, min: 16, max: 100 },
    major: { type: String, required: true },
    faculty: { type: String, required: true },
    interests: { type: [String], default: [] },
    bio: { type: String, default: '' },
    settings: {
      type: {
        aiSuggestionsEnabled: { type: Boolean, default: true },
        notifications: { type: Boolean, default: true },
        darkMode: { type: Boolean, default: false },
      },
      default: {
        aiSuggestionsEnabled: true,
        notifications: true,
        darkMode: false,
      },
    },
    lastSeenAt: { type: Date, default: Date.now },
    refreshToken: String,
  },
  {
    timestamps: true,
    _id: false,
  },
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
