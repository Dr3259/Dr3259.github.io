// 歌单卡片组件 - 现代化设计
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Music, 
  Folder, 
  MoreHorizontal,
  RefreshCw,
  Trash2,
  Heart,
  Headphones,
  FileEdit,
  Download
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

interface PlaylistCardProps {
  playlist?: Playlist;
  isCreateCard?: boolean;
  isActive?: boolean;
  isPlaying?: boolean;
  onPlay?: () => void;
  onSelect?: () => void;
  onEdit?: () => void;
  onDownload?: () => void;
  onRefresh?: () => void;
  onDelete?: () => void;
  onCreate?: () => void;
  onImportFolder?: () => void;
  onDrop?: (trackId: string) => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  isCreateCard = false,
  isActive = false,
  isPlaying = false,
  onPlay,
  onSelect,
  onEdit,
  onDownload,
  onRefresh,
  onDelete,
  onCreate,
  onImportFolder,
  onDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    if (!playlist || isCreateCard || playlist.type === 'all') return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!playlist || isCreateCard || playlist.type === 'all') return;
    
    const trackId = e.dataTransfer.getData('text/track-id');
    if (trackId && onDrop) {
      onDrop(trackId);
    }
  };

  // 创建歌单卡片
  if (isCreateCard) {
    return (
      <div 
        className="relative group cursor-pointer"
        onClick={onCreate}
      >
        <div className="aspect-square bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center p-3 transition-all duration-300 hover:bg-primary/10">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center shadow-sm">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-medium text-foreground">
              创建歌单
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) return null;

  const isVirtual = playlist.type === 'virtual';
  const isFolder = playlist.type === 'folder';
  const isAllMusic = playlist.type === 'all';

  const getGradientColors = () => {
    if (isActive) {
      if (isAllMusic) return "from-blue-500/20 via-cyan-500/20 to-teal-500/20";
      if (isVirtual) return "from-violet-500/20 via-purple-500/20 to-pink-500/20";
      return "from-orange-500/20 via-amber-500/20 to-yellow-500/20";
    }
    if (isAllMusic) return "from-blue-500/10 via-cyan-500/10 to-teal-500/10";
    if (isVirtual) return "from-violet-500/10 via-purple-500/10 to-pink-500/10";
    return "from-orange-500/10 via-amber-500/10 to-yellow-500/10";
  };

  const getIconBg = () => {
    if (isActive) {
      if (isAllMusic) return "bg-gradient-to-br from-blue-500/40 to-cyan-500/40 shadow-lg shadow-blue-500/20";
      if (isVirtual) return "bg-gradient-to-br from-violet-500/40 to-purple-500/40 shadow-lg shadow-violet-500/20";
      return "bg-gradient-to-br from-orange-500/40 to-amber-500/40 shadow-lg shadow-orange-500/20";
    }
    if (isAllMusic) return "bg-gradient-to-br from-blue-500/20 to-cyan-500/20";
    if (isVirtual) return "bg-gradient-to-br from-violet-500/20 to-purple-500/20";
    return "bg-gradient-to-br from-orange-500/20 to-amber-500/20";
  };

  const getIconColor = () => {
    if (isActive) {
      if (isAllMusic) return "text-blue-700 dark:text-blue-300";
      if (isVirtual) return "text-violet-700 dark:text-violet-300";
      return "text-orange-700 dark:text-orange-300";
    }
    if (isAllMusic) return "text-blue-600 dark:text-blue-400";
    if (isVirtual) return "text-violet-600 dark:text-violet-400";
    return "text-orange-600 dark:text-orange-400";
  };
  
  return (
    <div
      className={cn(
        "relative aspect-square bg-gradient-to-br rounded-xl p-3 flex flex-col cursor-pointer transition-all duration-300 group overflow-hidden",
        getGradientColors(),
        isActive && "shadow-xl shadow-primary/30 scale-[1.05] z-20 border-2 border-primary/30",
        isDragOver && "ring-2 ring-primary border-primary bg-primary/20 scale-[1.02] z-10",
        !isActive && !isDragOver && "hover:shadow-lg hover:shadow-black/10 hover:scale-[1.02] border border-border/50 hover:z-10"
      )}
      onClick={onSelect}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none transition-all duration-300", isActive && "from-white/10 to-white/5")} />
      <div className={cn("absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-6 translate-x-6 pointer-events-none transition-all duration-300", isActive && "from-white/20 to-white/5 w-16 h-16")} />
      
      {isActive && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none rounded-xl" />
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-xl blur-sm -z-10" />
        </>
      )}

      <div className="flex items-start justify-between mb-2">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shadow-sm", getIconBg())}>
          {isAllMusic ? <Music className={cn("h-4 w-4", getIconColor())} /> : isVirtual ? <Heart className={cn("h-4 w-4", getIconColor())} /> : <Folder className={cn("h-4 w-4", getIconColor())} />}
        </div>
        {!isAllMusic && (
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 bg-background/80 backdrop-blur-sm border-0 shadow-sm hover:bg-background/90" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isVirtual && onEdit && (<><DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}><FileEdit className="mr-2 h-4 w-4" />编辑信息</DropdownMenuItem></>)}
                {onDownload && (<><DropdownMenuSeparator /><DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDownload(); }}><Download className="mr-2 h-4 w-4" />下载歌单信息</DropdownMenuItem></>)}
                {isFolder && onRefresh && (<><DropdownMenuSeparator /><DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRefresh(); }}><RefreshCw className="mr-2 h-4 w-4" />刷新歌单</DropdownMenuItem></>)}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete?.(); }} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />删除歌单</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h3 className={cn("font-medium text-sm leading-tight mb-1 overflow-hidden transition-all duration-300", isActive && "text-primary font-semibold")} title={playlist.name} style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {playlist.name}
        </h3>
        {playlist.type === 'virtual' && (playlist as VirtualPlaylist).description && (
          <p className="text-xs text-muted-foreground overflow-hidden mb-1" title={(playlist as VirtualPlaylist).description} style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
            {(playlist as VirtualPlaylist).description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-1">
          <Headphones className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">{playlist.trackCount}</span>
        </div>
      </div>

      {isDragOver && (
        <div className="absolute inset-0 bg-primary/30 border-2 border-primary border-dashed rounded-xl flex items-center justify-center backdrop-blur-sm">
          <div className="text-primary font-medium text-sm flex items-center space-x-1">
            <Plus className="h-4 w-4" />
            <span>添加</span>
          </div>
        </div>
      )}
    </div>
  );
};
