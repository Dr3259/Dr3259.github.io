
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
  isPlaying: boolean; // 全局播放状态
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
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center mb-4 shrink-0">
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
      
      <ScrollArea className="flex-1 w-full -mx-1">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 px-1 pt-1 pb-4">
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
                playlist.type === 'virtual' || playlist.type === 'all'
                  ? () => onDownloadPlaylist(playlist.id)
                  : undefined
              }
              onRefresh={
                playlist.type === 'folder' 
                  ? () => onRefreshFolderPlaylist(playlist.id)
                  : undefined
              }
              onDelete={playlist.id !== 'all-music' ? () => onDeletePlaylist(playlist.id) : undefined}
              onTrackDrop={(trackId) => onTrackDrop(trackId, playlist.id)}
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
