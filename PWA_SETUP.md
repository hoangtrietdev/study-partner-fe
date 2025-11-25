# PWA Setup for Groq Study Partner

## Overview

This document explains how to enable Progressive Web App (PWA) features in the Groq study partner app.

## What's Included

1. **manifest.json** - App metadata, icons, theme colors
2. **sw.js** - Service Worker for offline caching
3. **Meta tags** - Added to layout.tsx

## Files

### /public/manifest.json
Defines app name, icons, colors, and display mode. Linked in `layout.tsx`.

### /public/sw.js
Simple service worker that caches key routes for offline access.

### /src/app/layout.tsx
Already includes:
```tsx
manifest: '/manifest.json',
themeColor: '#805AD5',
```

## Enable Service Worker

Add this to your root layout or a client component:

```typescript
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => console.log('SW registered:', reg))
      .catch((err) => console.error('SW registration failed:', err));
  }
}, []);
```

## Icons

Place these in `/public`:
- `icon-192x192.png` - 192x192 app icon
- `icon-512x512.png` - 512x512 app icon
- `favicon.ico` - Browser favicon

You can generate icons from a single source using tools like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/

## Testing PWA

### Development
1. Run `npm run dev`
2. Open Chrome DevTools
3. Go to Application > Manifest
4. Verify manifest loads correctly
5. Go to Application > Service Workers
6. Verify SW registers

### Production
1. Build: `npm run build && npm start`
2. Open Chrome DevTools
3. Go to Lighthouse
4. Run PWA audit
5. Check for installability

## Install Prompt

To show install prompt on mobile:

```typescript
const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

useEffect(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    setDeferredPrompt(e);
  });
}, []);

const handleInstall = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted install');
      }
      setDeferredPrompt(null);
    });
  }
};
```

## Next.js Configuration

Next.js 14+ supports PWA out of the box with the metadata API used in `layout.tsx`.

For advanced features, consider:
- `next-pwa` plugin for automatic SW generation
- Workbox for advanced caching strategies

## Vercel Deployment

PWA features work on Vercel without additional config. The manifest and service worker are served as static assets.

## Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Safari (iOS 11.3+, limited)
- ✅ Firefox (Android)
- ⚠️ Safari Desktop (no install prompt)

## Additional Features

Consider adding:
- Push notifications
- Background sync
- Offline form submission queue
- App shortcuts in manifest
- Share target API

## Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev PWA](https://web.dev/progressive-web-apps/)
- [Next.js PWA](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps)
