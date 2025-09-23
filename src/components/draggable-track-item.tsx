// 支持拖拽的歌曲项组件
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileEdit, Trash2, GripVertical, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { getTagColor, getHighContrastTextColor } from '@/lib/utils';
import type { TrackMetadata } from '@/lib/db';

interface DraggableTrackItemProps {
  track: TrackMetadata;
  index: number;
  isCurrentTrack: boolean;
  isInVirtualPlaylist?: boolean;
  onPlay: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  onRemoveFromPlaylist?: () => void;
}

// 智能Tooltip组件 - 只在文本被截断时显示
const SmartTooltip: React.FC<{
  children: React.ReactElement;
  content: string;
  className?: string;
}> = ({ children, content, className }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const isOverflow = textRef.current.scrollWidth > textRef.current.clientWidth;
        setIsOverflowing(isOverflow);
      }
    };

    checkOverflow();
    const currentRef = textRef.current;
    if (currentRef) {
        const resizeObserver = new ResizeObserver(checkOverflow);
        resizeObserver.observe(currentRef);
        return () => resizeObserver.unobserve(currentRef);
    }
  }, [content]);

  if (!isOverflowing) {
    return React.cloneElement(children, { ref: textRef });
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {React.cloneElement(children, { ref: textRef })}
      </TooltipTrigger>
      <TooltipContent side="top" className={cn("max-w-xs", className)}>
        <p className="text-sm">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export const DraggableTrackItem: React.FC<DraggableTrackItemProps> = ({
  track,
  index,
  isCurrentTrack,
  isInVirtualPlaylist = false,
  onPlay,
  onEdit,
  onDelete,
  onRemoveFromPlaylist,
}) => {
  const formatDuration = (seconds: number | undefined) => {
    if (seconds === undefined || isNaN(seconds)) return '0:00';
    const floorSeconds = Math.floor(seconds);
    const min = Math.floor(floorSeconds / 60);
    const sec = floorSeconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/track-id', track.id);
    e.dataTransfer.effectAllowed = 'move';
    
    const dragImage = document.createElement('div');
    dragImage.className = 'bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium shadow-lg';
    dragImage.textContent = track.title;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };
  
  return (
    <TooltipProvider>
      <div
        className={cn(
          "group flex items-center p-3 rounded-md cursor-pointer transition-colors select-none",
          isCurrentTrack ? "bg-primary/20" : "hover:bg-accent/50"
        )}
        onClick={onPlay}
        draggable={true}
        onDragStart={handleDragStart}
      >
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex items-center self-stretch mr-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
            </TooltipTrigger>
            <TooltipContent><p>拖动排序</p></TooltipContent>
        </Tooltip>

        <div className="flex items-start flex-1 min-w-0">
          {/* 歌曲序号 */}
          <div className="text-sm font-medium text-muted-foreground/80 w-8 text-left shrink-0 pt-px">
              {index + 1}.
          </div>

          {/* 歌曲信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 flex items-center gap-1.5">
                <SmartTooltip content={track.title}>
                  <p className="font-medium text-sm truncate">
                    {track.title}
                  </p>
                </SmartTooltip>
                 {/* 操作按钮 - 移动到这里 */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 shrink-0 text-muted-foreground hover:text-primary"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={onEdit}>
                                <FileEdit className="mr-2 h-4 w-4" />
                                <span>编辑信息</span>
                            </DropdownMenuItem>
                            {isInVirtualPlaylist && onRemoveFromPlaylist ? (
                                <DropdownMenuItem onClick={onRemoveFromPlaylist} className="text-orange-600 focus:text-orange-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>从歌单中移除</span>
                                </DropdownMenuItem>
                            ) : onDelete && (
                                <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>删除歌曲</span>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>
            </div>
            <SmartTooltip content={track.artist || '未知艺术家'}>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {track.artist || '未知艺术家'}
              </p>
            </SmartTooltip>
            
            {/* 标签和信息 */}
            <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-y-1">
              <p className="text-xs text-muted-foreground">
                {formatDuration(track.duration)}
              </p>
              
              {/* 分类标签 */}
              {track.category?.split(',').map(cat => cat.trim()).filter(Boolean).map(cat => {
                const bgColor = getTagColor(cat);
                const textColor = getHighContrastTextColor(bgColor);
                return (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="border-transparent text-xs"
                    style={{ backgroundColor: bgColor, color: textColor }}
                  >
                    {cat}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
