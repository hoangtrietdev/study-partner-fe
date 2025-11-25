# Groq Study Partner - Frontend

Next.js frontend for the Groq study partner discovery app with Chakra UI, PWA support, and Google OAuth.

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **UI Library**: Chakra UI
- **State Management**: React Context + TanStack Query (React Query)
- **Authentication**: Google OAuth + JWT
- **HTTP Client**: Axios
- **PWA**: Service Worker + Manifest
- **Styling**: Chakra UI + Emotion

## Prerequisites

- Node.js >= 18
- npm or pnpm
- Backend API running (see backend README)

## Environment Variables

Create a `.env.local` file (see `.env.local.example`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_APP_NAME=Groq
```

## Installation

```bash
npm install
# or
pnpm install
```

## Running Locally

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The app will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── icon-192x192.png       # App icons
│   └── icon-512x512.png
├── src/
│   ├── app/                   # Next.js app router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home (swipe view)
│   │   ├── login/
│   │   ├── matches/
│   │   ├── messages/
│   │   └── profile/
│   ├── components/
│   │   ├── Layout.tsx         # Main layout with nav
│   │   ├── Providers.tsx      # App providers
│   │   └── shared/
│   │       ├── SwipeCard.tsx  # Swipeable card component
│   │       └── ProfileCard.tsx
│   ├── contexts/
│   │   └── SessionContext.tsx # Auth session context
│   ├── hooks/
│   │   ├── useUsers.ts
│   │   ├── useMatches.ts
│   │   └── useMessages.ts
│   ├── lib/
│   │   └── api.ts             # Axios instance with interceptors
│   └── types/
│       └── index.ts           # TypeScript types
├── package.json
├── tsconfig.json
├── next.config.js
└── PWA_SETUP.md               # PWA documentation
```

## Features

### Authentication
- Google Sign-In with OAuth 2.0
- JWT access tokens (15 min expiry)
- Refresh tokens in httpOnly cookies (7 day expiry)
- Automatic token refresh on 401
- Secure session management

### Swipe Interface
- Touch/mouse drag support
- Keyboard navigation (arrow keys)
- Smooth animations with Framer Motion
- Accessible controls
- Like/reject buttons

### Match System
- AI-powered suggestions from backend
- Real-time match notifications
- Match list with compatibility scores
- Chat interface per match

### Profile Management
- Edit personal info
- Manage interests
- Toggle AI suggestions
- Dark mode support

### PWA Support
- Installable on mobile/desktop
- Offline caching
- App manifest
- Service worker
- See `PWA_SETUP.md` for details

## API Integration

The frontend uses Axios with interceptors for:
- Automatic Bearer token injection
- Token refresh on 401
- Error handling
- CORS with credentials

All API calls use TanStack Query for:
- Caching
- Automatic refetching
- Optimistic updates
- Loading/error states

## Hooks

### useSession
Access authentication state:
```typescript
const { user, accessToken, login, logout, isAuthenticated } = useSession();
```

### useUsers
Fetch and update users:
```typescript
const { data: users } = useUsers({ schoolName: 'MIT' });
const updateUser = useUpdateUser();
```

### useMatches
Manage matches:
```typescript
const { data: matches } = useMatches();
const { data: suggestions } = useMatchSuggestions(10, true);
const createMatch = useCreateMatch();
```

### useMessages
Chat functionality:
```typescript
const { data: messages } = useMessages(matchId);
const sendMessage = useSendMessage();
```

## Accessibility

- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Color contrast compliance

## Dark Mode

Chakra UI's color mode is integrated. Toggle with the moon/sun icon in the nav bar.

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables on Vercel

Add these in Vercel dashboard (Settings > Environment Variables):

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend.vercel.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_APP_NAME=Groq
```

### Build Settings

- **Framework**: Next.js
- **Build Command**: `npm run build` (or `next build`)
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (dev)
   - `https://your-domain.vercel.app` (prod)
6. Add authorized redirect URIs:
   - `http://localhost:3000/login`
   - `https://your-domain.vercel.app/login`
7. Copy Client ID to `.env.local`

## Icons for PWA

Generate icons from a single source:
1. Create a 512x512 PNG
2. Use [RealFaviconGenerator](https://realfavicongenerator.net/)
3. Download and place in `/public`

Required files:
- `icon-192x192.png`
- `icon-512x512.png`
- `favicon.ico`

## Testing

### Manual Testing
1. Test swipe gestures on mobile
2. Test keyboard navigation
3. Verify offline mode (service worker)
4. Check PWA installability
5. Test token refresh flow

### Lighthouse Audit
```bash
npm run build
npm start
# Open Chrome DevTools > Lighthouse
# Run PWA audit
```

## Performance Optimizations

- Image optimization with Next.js Image
- Code splitting with dynamic imports
- React Query caching
- Service worker caching
- Lazy loading components

## Browser Support

- Chrome/Edge: Full support
- Safari: iOS 11.3+ (limited PWA)
- Firefox: Full support
- Mobile browsers: Optimized for touch

## Troubleshooting

### CORS Errors
Ensure backend `CORS_ORIGIN` matches frontend URL.

### Token Refresh Loop
Check that refresh token cookie is httpOnly and `withCredentials: true`.

### PWA Not Installing
- Verify manifest.json is accessible
- Check service worker registration
- Ensure HTTPS in production
- Run Lighthouse PWA audit

### Google Login Fails
- Verify Client ID is correct
- Check authorized origins in Google Console
- Ensure cookies are enabled

## Security Best Practices

1. **Tokens**: Access tokens in memory, refresh in httpOnly cookies
2. **HTTPS**: Always use HTTPS in production
3. **XSS**: Chakra UI escapes content by default
4. **CSRF**: Refresh endpoint uses SameSite cookies
5. **Content Security Policy**: Configure in `next.config.js`

## Additional Features to Implement

- [ ] Push notifications
- [ ] Real-time messaging (WebSocket)
- [ ] Image upload for profiles
- [ ] Advanced filters
- [ ] Undo swipe
- [ ] Block/report users

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Chakra UI](https://chakra-ui.com/)
- [TanStack Query](https://tanstack.com/query)
- [PWA Guide](https://web.dev/progressive-web-apps/)

## License

MIT
