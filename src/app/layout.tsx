import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { MusicProvider } from '@/context/MusicContext';
import { MiniMusicPlayer } from '@/components/MiniMusicPlayer';

export const metadata: Metadata = {
  title: '周览',
  description: '一目了然地规划你的一周。',
  manifest: '/manifest.json', // Link to the manifest file
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '周览',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <MusicProvider>
          {children}
          <MiniMusicPlayer />
          <Toaster />
        </MusicProvider>
      </body>
    </html>
  );
}
