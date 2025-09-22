// 编辑歌单信息的模态框组件
"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PenSquare, Trash2, Music, Folder } from 'lucide-react';
import type { Playlist, VirtualPlaylist } from '@/lib/playlist-types';

interface EditPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, description?: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  playlist: Playlist | null;
}

export const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onDelete,
  playlist,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && playlist) {
      setName(playlist.name || '');
      setDescription(
        playlist.type === 'virtual' 
          ? (playlist as VirtualPlaylist).description || '' 
          : ''
      );

      // 聚焦到名称输入框
      setTimeout(() => {
        if (nameInputRef.current) {
          const end = nameInputRef.current.value.length;
          nameInputRef.current.setSelectionRange(end, end);
          nameInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, playlist]);

  const handleSave = async () => {
    if (!playlist || !name.trim()) return;

    setIsLoading(true);
    try {
      await onConfirm(name.trim(), description.trim() || undefined);
      onClose();
    } catch (error) {
      console.error('Failed to save playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!playlist || !onDelete) return;

    setIsLoading(true);
    try {
      await onDelete();
      onClose();
    } catch (error) {
      console.error('Failed to delete playlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  if (!playlist) return null;

  const isVirtual = playlist.type === 'virtual';
  const isAllMusic = playlist.type === 'all';
  const canEdit = isVirtual && !isAllMusic;
  const canDelete = canEdit && onDelete;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border border-purple-200/20 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-violet-600 rounded-t-lg"></div>
        
        <DialogHeader className="mb-6 space-y-3">
          <DialogTitle className="text-xl font-medium text-foreground flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-200/30 flex items-center justify-center backdrop-blur-sm">
              {isVirtual ? (
                <Music className="w-6 h-6 text-purple-600" />
              ) : (
                <Folder className="w-6 h-6 text-orange-600" />
              )}
            </div>
            编辑歌单信息
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 leading-relaxed">
            {canEdit ? '修改歌单的名称和描述信息。' : '查看歌单信息。'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground/80">
              <PenSquare className="h-4 w-4" />
              <span>歌单信息</span>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playlist-name" className="text-xs font-medium text-muted-foreground/80">
                  歌单名称
                </Label>
                <Input
                  ref={nameInputRef}
                  id="playlist-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入歌单名称"
                  disabled={!canEdit || isLoading}
                  className="h-11 text-base border-2 border-border/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 focus:outline-none focus:shadow-lg focus:shadow-purple-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/15 focus-visible:ring-offset-0 transition-all duration-300 bg-background/50 backdrop-blur-sm rounded-xl hover:shadow-md hover:border-purple-400/60 hover:bg-background/70"
                  autoComplete="off"
                />
              </div>
              
              {isVirtual && (
                <div className="space-y-2">
                  <Label htmlFor="playlist-description" className="text-xs font-medium text-muted-foreground/80">
                    描述 (可选)
                  </Label>
                  <Textarea
                    id="playlist-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="为这个歌单添加一些描述"
                    disabled={!canEdit || isLoading}
                    className="min-h-[80px] text-base border-2 border-border/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 focus:outline-none focus:shadow-lg focus:shadow-purple-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/15 focus-visible:ring-offset-0 transition-all duration-300 bg-background/50 backdrop-blur-sm rounded-xl hover:shadow-md hover:border-purple-400/60 hover:bg-background/70 resize-none"
                    rows={3}
                  />
                </div>
              )}
            </div>
            
            <div className="bg-muted/30 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">歌曲数量:</span>
                <span className="font-medium">{playlist.trackCount} 首</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">创建时间:</span>
                <span className="font-medium">
                  {new Date(playlist.createdAt).toLocaleDateString()}
                </span>
              </div>
              {playlist.updatedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">更新时间:</span>
                  <span className="font-medium">
                    {new Date(playlist.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gradient-to-r from-transparent via-border/50 to-transparent">
          {/* 左侧：删除按钮 */}
          <div className="flex-shrink-0">
            {canDelete ? (
              <Button 
                type="button" 
                variant="ghost"
                size="lg"
                onClick={handleDelete}
                disabled={isLoading}
                className="h-11 px-6 text-red-600 hover:text-red-700 hover:bg-red-50/80 dark:hover:bg-red-900/20 border border-red-200/50 hover:border-red-300/70 transition-all duration-300 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除歌单
              </Button>
            ) : (
              <div></div>
            )}
          </div>
          
          {/* 右侧：取消和保存按钮 */}
          <div className="flex items-center space-x-3">
            <Button 
              type="button" 
              variant="ghost"
              size="lg"
              onClick={onClose}
              disabled={isLoading}
              className="h-11 px-6 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50 hover:border-border/70 transition-all duration-300 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md"
            >
              {canEdit ? '取消' : '关闭'}
            </Button>
            {canEdit && (
              <Button 
                type="button" 
                size="lg"
                onClick={handleSave}
                disabled={!name.trim() || isLoading}
                className="h-11 px-8 bg-gradient-to-r from-purple-500 via-purple-600 to-violet-500 hover:from-purple-600 hover:via-purple-700 hover:to-violet-600 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 rounded-xl border-0 focus:ring-4 focus:ring-purple-500/20"
              >
                {isLoading ? '保存中...' : '保存'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};