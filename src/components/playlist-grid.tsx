// 歌单网格布局组件
"use client";

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListMusic } from 'lucide-react';
import { PlaylistCard } from './playlist-card';
import type { Playlist } from '@/lib/playlist-types';

interface PlaylistGridProps {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  isLoadingPlaylists: boolean;
  isPlaying: boolean; // 当前是否正在播放音乐
  onPlayPlaylist: (playlistId: string) => void;
  onSelectPlaylist: (playlistId: string) => void;
  onEditPlaylist: (playlistId: string) => void;
  onDownloadPlaylist: (playlistId: string) => void;
  onRefreshFolderPlaylist: (playlistId: string) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onTrackDrop: (trackId: string, playlistId: string) => void;
}

export const PlaylistGrid: React.FC<PlaylistGridProps> = ({
  playlists,
  currentPlaylist,
  isLoadingPlaylists,
  isPlaying,
  onPlayPlaylist,
  onSelectPlaylist,
  onEditPlaylist,
  onDownloadPlaylist,
  onRefreshFolderPlaylist,
  onDeletePlaylist,
  onTrackDrop,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <h2 className="flex items-center text-lg font-semibold leading-none">
          <ListMusic className="h-5 w-5 mr-2 shrink-0" />
          <span>
            我的歌单
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({playlists.length} 个)
            </span>
          </span>
        </h2>
      </div>
      
      <ScrollArea className="w-full">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 p-1 pb-4">
          {/* 现有歌单卡片 */}
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              isActive={currentPlaylist?.id === playlist.id}
              isPlaying={currentPlaylist?.id === playlist.id && isPlaying}
              onPlay={() => onPlayPlaylist(playlist.id)}
              onSelect={() => onSelectPlaylist(playlist.id)}
              onEdit={
                playlist.type === 'virtual' && playlist.id !== 'all-music'
                  ? () => onEditPlaylist(playlist.id)
                  : undefined
              }
              onDownload={
                playlist.type === 'virtual'
                  ? () => onDownloadPlaylist(playlist.id)
                  : undefined
              }
              onRefresh={
                playlist.type === 'folder' 
                  ? () => onRefreshFolderPlaylist(playlist.id)
                  : undefined
              }
              onDelete={() => onDeletePlaylist(playlist.id)}
              onDrop={(trackId) => onTrackDrop(trackId, playlist.id)}
            />
          ))}
          
          {/* 加载状态 */}
          {isLoadingPlaylists && (
            <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/10 border border-dashed border-muted-foreground/30 rounded-2xl flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <div className="text-sm text-muted-foreground">加载中...</div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
