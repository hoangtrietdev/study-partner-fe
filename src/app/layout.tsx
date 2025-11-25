import { Providers } from '@/components/Providers';
import { ColorModeScript } from '@chakra-ui/react';
import './globals.css';

export const metadata = {
  title: 'Study Partner - Study Partner Discovery',
  description: 'Find your perfect study partner',
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#805AD5',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body suppressHydrationWarning>
        <ColorModeScript initialColorMode="light" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
