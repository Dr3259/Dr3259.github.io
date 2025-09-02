import type {Metadata, Viewport} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { MusicProvider } from '@/context/MusicContext';
import { MiniMusicPlayer } from '@/components/MiniMusicPlayer';
import type { Metric } from 'next/dist/compiled/next-server/server.edge';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});


export const metadata: Metadata = {
  title: '周览 (Week Glance)',
  description: '一款集周计划、日视图、自动记录和休闲功能于一体的生产力工具。',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  shrinkToFit: false,
  userScalable: false,
  viewportFit: 'cover'
};

export function reportWebVitals(metric: Metric) {
  console.log(metric);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="light">
      <head>
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <MusicProvider>
          {children}
          <MiniMusicPlayer />
        </MusicProvider>
        <Toaster />
      </body>
    </html>
  );
}
