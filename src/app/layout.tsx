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
  title: 'ai 世界',
  description: '探索全球AI模型、产品与公司，抹平全球AI信息差。',
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
