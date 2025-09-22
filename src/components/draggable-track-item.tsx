// 支持拖拽的歌曲项组件
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileEdit, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTagColor, getHighContrastTextColor } from '@/lib/utils';
import type { TrackMetadata } from '@/lib/db';

interface DraggableTrackItemProps {
  track: TrackMetadata;
  isCurrentTrack: boolean;
  isInVirtualPlaylist?: boolean; // 是否在虚拟歌单中
  onPlay: () => void;
  onEdit: () => void;
  onDelete?: () => void;
  onRemoveFromPlaylist?: () => void; // 从虚拟歌单中移除
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
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
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
  
  // 拖拽开始
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/track-id', track.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // 设置拖拽时的视觉效果
    const dragImage = document.createElement('div');
    dragImage.className = 'bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium shadow-lg';
    dragImage.textContent = track.title;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // 清理临时元素
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };
  
  // 移除来源标识，因为播放列表中的歌曲都已经是导入的
  
  return (
    <TooltipProvider>
      <div
        className={cn(
          "group flex items-center p-3 rounded-md cursor-pointer transition-colors select-none",
          isCurrentTrack ? "bg-primary/20" : "hover:bg-accent/50"
        )}
        onClick={onPlay}
        draggable={true} // 所有歌曲都可以拖拽到虚拟歌单
        onDragStart={handleDragStart}
      >
      {/* 拖拽手柄 */}
      <div className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      
      {/* 歌曲信息 */}
      <div className="flex-1 min-w-0">
        <SmartTooltip content={track.title}>
          <p className="font-medium text-sm truncate">
            {track.title}
          </p>
        </SmartTooltip>
        <SmartTooltip content={track.artist || '未知艺术家'}>
          <p className="text-xs text-muted-foreground truncate">
            {track.artist || '未知艺术家'}
          </p>
        </SmartTooltip>
        
        {/* 标签和信息 */}
        <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-y-1">
          <p className="text-xs text-muted-foreground">
            {formatDuration(track.duration)}
          </p>
          
          {/* 来源标识已移除 - 播放列表中的歌曲都已经是导入的 */}
          
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
      
      {/* 操作按钮 */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <FileEdit className="h-4 w-4" />
        </Button>
        
        {/* 虚拟歌单中显示移除按钮，否则显示删除按钮 */}
        {isInVirtualPlaylist && onRemoveFromPlaylist ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-orange-500"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFromPlaylist();
            }}
            title="从歌单中移除"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="删除歌曲"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
};