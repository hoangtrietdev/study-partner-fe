# Study Partner - Frontend-Only Setup

This application now runs entirely from the Next.js frontend with direct MongoDB connection and built-in API routes.

## Architecture

- **Frontend**: Next.js 14 with App Router
- **Database**: MongoDB (direct connection from Next.js API routes)
- **Authentication**: Google OAuth + JWT (handled in API routes)
- **AI Matching**: Groq LLM API for compatibility scoring
- **State Management**: React Context + TanStack Query

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

**Required Environment Variables:**

```env
# Public (exposed to browser)
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_APP_NAME=Study Partner

# Private (server-side only)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-long-random-jwt-secret
REFRESH_TOKEN_SECRET=your-long-random-refresh-secret
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GROQ_API_KEY=your-groq-api-key
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins:
   - `http://localhost:3000` (development)
   - Your production domain
6. Copy Client ID and Client Secret to `.env.local`

### 4. MongoDB Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist your IP (or use 0.0.0.0/0 for development)
4. Get connection string and add to `.env.local`

### 5. Groq API Key (Optional)

1. Sign up at [Groq](https://console.groq.com/)
2. Generate API key
3. Add to `.env.local`

*If not provided, the app will use fallback random scoring*

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Routes

All API endpoints are now Next.js API routes under `/api`:

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update current user
- `GET /api/users/[id]` - Get user by ID

### Matches
- `GET /api/matches/suggestions` - Get match suggestions
  - Query params: `?mode=random|strict&limit=100`
- `POST /api/matches` - Create new match
- `GET /api/matches` - Get user's matches
  - Query params: `?status=pending|matched|unmatched`
- `PATCH /api/matches/[id]/accept` - Accept a match
- `DELETE /api/matches/[id]/unmatch` - Unmatch

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages` - Get messages
  - Query params: `?matchId=<matchId>`

## Database Models

### User
- UUID-based _id
- Google OAuth integration
- Profile info (school, major, faculty, interests, bio)
- Settings and preferences

### Match
- Links two users (userAId, userBId)
- Status: pending, matched, unmatched
- AI compatibility score and explanation

### Message
- Belongs to a match
- Sender and recipient tracking
- Soft delete support

## Features

- ✅ Google OAuth login
- ✅ Direct MongoDB connection
- ✅ JWT authentication with refresh tokens
- ✅ AI-powered match suggestions
- ✅ Tinder-style swipe interface
- ✅ Real-time messaging
- ✅ Profile management
- ✅ Match mode toggle (random/strict)
- ✅ PWA support

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

## Notes

- All API routes run server-side in Next.js
- MongoDB connection is pooled and reused
- JWT tokens stored in localStorage
- Auto-refresh token mechanism
- Guest mode available (no database needed)
