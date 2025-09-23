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
  ListMusic,
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
import type { Playlist, VirtualPlaylist, FolderPlaylist } from '@/lib/playlist-types';
import Image from 'next/image';
import placeholderImageData from '@/lib/placeholder-images.json';


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
  onTrackDrop?: (trackId: string) => void;
}

// Simple hash function to generate a number from a string
const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};


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
  onTrackDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  
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
    if (trackId && onTrackDrop) {
      onTrackDrop(trackId);
    }
  };

  if (isCreateCard) {
    return (
      <div 
        className="relative group cursor-pointer aspect-square overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg"
        onClick={onCreate}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/10 border border-dashed border-muted-foreground/30 flex flex-col items-center justify-center p-3 transition-all duration-300 group-hover:bg-muted/30 group-hover:border-primary/50">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center shadow-sm mb-2">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">
            创建歌单
          </p>
        </div>
      </div>
    );
  }

  if (!playlist) return null;

  const isVirtual = playlist.type === 'virtual';
  const isAllMusic = playlist.type === 'all';
  
  const getImageData = () => {
    if (isVirtual && playlist.id) {
        const hash = simpleHash(playlist.id);
        return { seed: hash % 1000, hint: 'abstract texture' }; // Use hash for seed
    }
    const imageDataKey = isAllMusic ? 'allMusicPlaylist' : 'folderPlaylist';
    return (placeholderImageData as any)[imageDataKey] || { seed: 100, hint: 'music abstract' };
  };

  const imageData = getImageData();
  
  const handleCardClick = () => {
      onPlay?.();
  };

  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden cursor-pointer group shadow-md",
        "transition-all duration-300 ease-in-out",
        isActive && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        isDragOver && "ring-4 ring-primary/70",
      )}
      onClick={handleCardClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={`https://picsum.photos/seed/${imageData.seed}/300/300`}
        alt={playlist.name}
        fill
        className={cn(
            "object-cover transition-all duration-500 ease-in-out",
            (isHovered || isDragOver || (isActive && isPlaying)) ? "scale-110 blur-sm brightness-50" : ""
        )}
        data-ai-hint={imageData.hint}
      />
      
      {/* 律动效果 */}
       {isActive && isPlaying && !isHovered && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-end justify-center h-8 w-8 gap-1">
            <div className="w-1 h-4 bg-primary/80 rounded-full animate-bar1"></div>
            <div className="w-1 h-8 bg-primary/80 rounded-full animate-bar2"></div>
            <div className="w-1 h-6 bg-primary/80 rounded-full animate-bar3"></div>
            <div className="w-1 h-5 bg-primary/80 rounded-full animate-bar2"></div>
          </div>
        </div>
      )}


      <div 
        className={cn(
            "absolute inset-0 flex flex-col justify-between p-3 bg-black/20 text-white",
            isHovered ? "opacity-100" : "opacity-0",
            "transition-opacity duration-300"
        )}
      >
        {/* Top section with title and menu */}
        <div>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
                    {isAllMusic ? <Music className="h-4 w-4" /> : isVirtual ? <ListMusic className="h-4 w-4" /> : <Folder className="h-4 w-4" />}
                </div>
                <h3 
                    className="font-semibold text-base leading-tight drop-shadow-md" 
                    title={playlist.name} 
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                    {playlist.name}
                </h3>
            </div>
            {!isAllMusic && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/20" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    {isVirtual && onEdit && <DropdownMenuItem onClick={onEdit}><FileEdit className="mr-2 h-4 w-4" />编辑信息</DropdownMenuItem>}
                    {onDownload && <DropdownMenuItem onClick={onDownload}><Download className="mr-2 h-4 w-4" />下载歌单信息</DropdownMenuItem>}
                    {playlist.type === 'folder' && onRefresh && <DropdownMenuItem onClick={onRefresh}><RefreshCw className="mr-2 h-4 w-4" />刷新歌单</DropdownMenuItem>}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />删除歌单</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Bottom section with track count */}
        <div className="flex items-end justify-between">
           <div className="flex items-center space-x-1">
              <Music className="h-3 w-3 opacity-80" />
              <span className="text-xs font-medium opacity-80">{playlist.trackCount}</span>
            </div>
        </div>
      </div>
      
       {isDragOver && (
        <div className="absolute inset-0 bg-primary/30 border-2 border-primary border-dashed flex items-center justify-center backdrop-blur-sm pointer-events-none">
          <div className="text-white font-medium text-sm flex flex-col items-center space-y-1 text-center">
            <Plus className="h-5 w-5" />
            <span className="px-2">添加到: <br/><strong>{playlist.name}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
