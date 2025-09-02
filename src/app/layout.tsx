import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { MusicProvider } from '@/context/MusicContext';
import { MiniMusicPlayer } from '@/components/MiniMusicPlayer';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
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
