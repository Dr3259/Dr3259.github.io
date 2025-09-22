// 歌单侧边栏组件
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  FolderPlus, 
  Plus, 
  Music, 
  Folder, 
  RefreshCw, 
  MoreHorizontal,
  Play,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import type { Playlist, VirtualPlaylist, FolderPlaylist } from './playlist-types';

interface PlaylistSidebarProps {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  isLoadingPlaylists: boolean;
  onCreateVirtualPlaylist: () => void;
  onImportFolderPlaylist: () => void;
  onPlayPlaylist: (playlistId: string) => void;
  onRefreshFolderPlaylist: (playlistId: string) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onTrackDrop: (trackId: string, playlistId: string) => void;
}

export const PlaylistSidebar: React.FC<PlaylistSidebarProps> = ({
  playlists,
  currentPlaylist,
  isLoadingPlaylists,
  onCreateVirtualPlaylist,
  onImportFolderPlaylist,
  onPlayPlaylist,
  onRefreshFolderPlaylist,
  onDeletePlaylist,
  onSelectPlaylist,
  onTrackDrop,
}) => {
  const [dragOverPlaylistId, setDragOverPlaylistId] = useState<string | null>(null);
  
  const virtualPlaylists = playlists.filter(p => p.type === 'virtual') as VirtualPlaylist[];
  const folderPlaylists = playlists.filter(p => p.type === 'folder') as FolderPlaylist[];
  
  // 拖拽处理
  const handleDragOver = (e: React.DragEvent, playlistId: string) => {
    e.preventDefault();
    setDragOverPlaylistId(playlistId);
  };
  
  const handleDragLeave = () => {
    setDragOverPlaylistId(null);
  };
  
  const handleDrop = (e: React.DragEvent, playlistId: string) => {
    e.preventDefault();
    setDragOverPlaylistId(null);
    
    const trackId = e.dataTransfer.getData('text/track-id');
    if (trackId) {
      onTrackDrop(trackId, playlistId);
    }
  };
  
  const PlaylistItem: React.FC<{ 
    playlist: Playlist; 
    icon: React.ReactNode;
    canRefresh?: boolean;
  }> = ({ playlist, icon, canRefresh = false }) => {
    const isActive = currentPlaylist?.id === playlist.id;
    const isDragOver = dragOverPlaylistId === playlist.id;
    
    return (
      <div
        className={cn(
          "group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors",
          isActive && "bg-primary/20",
          isDragOver && "bg-accent border-2 border-dashed border-primary",
          !isActive && !isDragOver && "hover:bg-accent/50"
        )}
        onClick={() => onSelectPlaylist(playlist)}
        onDragOver={(e) => handleDragOver(e, playlist.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, playlist.id)}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {icon}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" title={playlist.name}>
              {playlist.name}
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {playlist.trackCount}
              </Badge>
              {playlist.type === 'folder' && (
                <span className="text-xs text-muted-foreground">
                  {new Date((playlist as FolderPlaylist).lastScanTime).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onPlayPlaylist(playlist.id);
            }}
          >
            <Play className="h-3 w-3" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canRefresh && (
                <>
                  <DropdownMenuItem onClick={() => onRefreshFolderPlaylist(playlist.id)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    刷新歌单
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem 
                onClick={() => onDeletePlaylist(playlist.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                删除歌单
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-80 border-r bg-background/50 flex flex-col">
      {/* 头部操作区 */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">歌单</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateVirtualPlaylist}
              disabled={isLoadingPlaylists}
            >
              <Plus className="mr-1 h-4 w-4" />
              新建
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onImportFolderPlaylist}
              disabled={isLoadingPlaylists}
            >
              <FolderPlus className="mr-1 h-4 w-4" />
              导入文件夹
            </Button>
          </div>
        </div>
      </div>
      
      {/* 歌单列表 */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* 虚拟歌单 */}
          {virtualPlaylists.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <Music className="mr-2 h-4 w-4" />
                我的歌单
              </h3>
              <div className="space-y-1">
                {virtualPlaylists.map(playlist => (
                  <PlaylistItem
                    key={playlist.id}
                    playlist={playlist}
                    icon={<Music className="h-4 w-4 text-primary" />}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* 文件夹歌单 */}
          {folderPlaylists.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <Folder className="mr-2 h-4 w-4" />
                文件夹歌单
              </h3>
              <div className="space-y-1">
                {folderPlaylists.map(playlist => (
                  <PlaylistItem
                    key={playlist.id}
                    playlist={playlist}
                    icon={<Folder className="h-4 w-4 text-orange-500" />}
                    canRefresh={true}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* 空状态 */}
          {playlists.length === 0 && !isLoadingPlaylists && (
            <div className="text-center text-muted-foreground py-8">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">还没有歌单</p>
              <p className="text-xs mt-1">创建歌单或导入文件夹开始使用</p>
            </div>
          )}
          
          {/* 加载状态 */}
          {isLoadingPlaylists && (
            <div className="text-center text-muted-foreground py-4">
              <RefreshCw className="h-6 w-6 mx-auto mb-2 animate-spin" />
              <p className="text-sm">加载中...</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};