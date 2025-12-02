export interface User {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  _id: string;
  userAId: string | User;
  userBId: string | User;
  status: 'pending' | 'matched' | 'unmatched';
  score?: number;
  explanation?: string;
  otherUser?: User; // Populated by API
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  matchId: string;
  senderId: string;
  recipientId: string;
  content: string;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchSuggestion {
  candidateId: string;
  score: number;
  explanation: string;
  candidate: User;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    imageUrl?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
