// 歌单导出功能
import type { VirtualPlaylist, AllMusicPlaylist } from './playlist-types';
import type { TrackMetadata } from './db';

export interface PlaylistExportData {
  playlistName: string;
  playlistDescription?: string;
  trackCount: number;
  createdAt: string;
  tracks: {
    index: number;
    title: string;
    artist?: string;
    category?: string;
  }[];
}

/**
 * 将歌单信息导出为文本格式
 */
export function exportPlaylistToText(
  playlist: VirtualPlaylist | AllMusicPlaylist,
  tracks: TrackMetadata[]
): string {
  const lines: string[] = [];
  
  // 歌单标题
  lines.push(`歌单名称: ${playlist.name}`);
  lines.push('='.repeat(50));
  
  // 歌单信息
  if (playlist.type === 'virtual' && (playlist as VirtualPlaylist).description) {
    lines.push(`描述: ${(playlist as VirtualPlaylist).description}`);
  }
  
  lines.push(`歌曲数量: ${playlist.trackCount} 首`);
  lines.push(`创建时间: ${new Date(playlist.createdAt).toLocaleString('zh-CN')}`);
  
  if (playlist.updatedAt) {
    lines.push(`更新时间: ${new Date(playlist.updatedAt).toLocaleString('zh-CN')}`);
  }
  
  lines.push('');
  lines.push('歌曲列表:');
  lines.push('-'.repeat(50));
  
  // 获取歌单中的歌曲
  let playlistTracks: TrackMetadata[] = [];
  
  if (playlist.type === 'all') {
    // "所有音乐"歌单包含所有歌曲
    playlistTracks = tracks;
  } else if (playlist.type === 'virtual') {
    // 虚拟歌单按照歌单中的顺序
    const virtualPlaylist = playlist as VirtualPlaylist;
    playlistTracks = virtualPlaylist.tracks
      .map(ref => tracks.find(t => t.id === ref.trackId))
      .filter((track): track is TrackMetadata => track !== undefined);
  }
  
  // 导出歌曲信息
  if (playlistTracks.length === 0) {
    lines.push('(空歌单)');
  } else {
    playlistTracks.forEach((track, index) => {
      const trackNumber = (index + 1).toString().padStart(3, ' ');
      const artist = track.artist ? ` - ${track.artist}` : '';
      const category = track.category ? ` [${track.category}]` : '';
      
      lines.push(`${trackNumber}. ${track.title}${artist}${category}`);
    });
  }
  
  lines.push('');
  lines.push('-'.repeat(50));
  lines.push(`导出时间: ${new Date().toLocaleString('zh-CN')}`);
  lines.push('由私人音乐播放器导出');
  
  return lines.join('\n');
}

/**
 * 下载文本文件
 */
export function downloadTextFile(content: string, filename: string): void {
  // 创建Blob对象
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  
  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // 触发下载
  document.body.appendChild(link);
  link.click();
  
  // 清理
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 生成安全的文件名
 */
export function generateSafeFilename(playlistName: string): string {
  // 移除或替换不安全的字符
  const safeName = playlistName
    .replace(/[<>:"/\\|?*]/g, '_') // 替换Windows不允许的字符
    .replace(/\s+/g, '_') // 替换空格
    .substring(0, 50); // 限制长度
  
  const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `歌单_${safeName}_${timestamp}.txt`;
}