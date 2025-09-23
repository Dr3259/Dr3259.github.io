// 增强版音乐播放器的路由页面
import { MusicProvider } from '@/context/MusicContext';
import { PlaylistProvider } from '@/lib/enhanced-music-context';
import IntegratedMusicPlayerPage from '@/components/integrated-music-player';

export default function EnhancedMusicPlayerRoute() {
  return (
    <MusicProvider>
      <PlaylistProvider>
        <IntegratedMusicPlayerPage />
      </PlaylistProvider>
    </MusicProvider>
  );
}
