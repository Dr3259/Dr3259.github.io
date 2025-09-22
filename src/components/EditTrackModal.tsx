
"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TrackMetadata } from '@/lib/db';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { PenSquare, Tags, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTagColor, getHighContrastTextColor } from '@/lib/utils';


interface EditTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trackId: string, meta: { title: string, artist: string | undefined, category: string | null }) => void;
  onDelete?: (trackId: string, trackTitle: string) => void;
  track: TrackMetadata | null;
  translations: {
    title: string;
    description: string;
    titleLabel: string;
    titlePlaceholder: string;
    artistLabel: string;
    artistPlaceholder: string;
    categoryLabel: string;
    categoryPlaceholder: string;
    saveButton: string;
    cancelButton: string;
  };
}

const CATEGORY_TYPES_EN = {
    'Pop': '流行',
    'Rock': '摇滚',
    'Hip-Hop': '嘻哈',
    'Electronic': '电子',
    'Classical': '古典',
    'Niche': '小众',
    'Ancient': '古风',
};

const CATEGORY_PURPOSES_EN = {
    'Study': '学习',
    'Love': '恋爱',
    'Healing': '治愈',
    'Motivational': '励志',
    'emo': 'emo',
};

const CATEGORY_TYPES_ZH = Object.fromEntries(Object.entries(CATEGORY_TYPES_EN).map(([k, v]) => [v, k]));
const CATEGORY_PURPOSES_ZH = Object.fromEntries(Object.entries(CATEGORY_PURPOSES_EN).map(([k, v]) => [v, k]));


export const EditTrackModal: React.FC<EditTrackModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  track,
  translations,
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPurposes, setSelectedPurposes] = useState<Set<string>>(new Set());
  const titleInputRef = useRef<HTMLInputElement>(null);

  const isChinese = '流行' in CATEGORY_TYPES_ZH;

  useEffect(() => {
    if (isOpen && track) {
      setTitle(track.title || '');
      setArtist(track.artist || '');
      
      const currentCategories = track.category ? track.category.split(',').map(c => c.trim()) : [];
      
      const allTypes = isChinese ? Object.keys(CATEGORY_TYPES_ZH) : Object.keys(CATEGORY_TYPES_EN);
      const allPurposes = isChinese ? Object.keys(CATEGORY_PURPOSES_ZH) : Object.keys(CATEGORY_PURPOSES_EN);
      
      const foundType = currentCategories.find(c => allTypes.includes(c));
      const foundPurposes = currentCategories.filter(c => allPurposes.includes(c));

      setSelectedType(foundType || null);
      setSelectedPurposes(new Set(foundPurposes));

      // Move cursor to the end of the input text instead of selecting it all
      setTimeout(() => {
        if(titleInputRef.current) {
            const end = titleInputRef.current.value.length;
            titleInputRef.current.setSelectionRange(end, end);
            titleInputRef.current.focus();
        }
      }, 100);

    }
  }, [isOpen, track, isChinese]);

  const handleSaveClick = () => {
    if (track && title.trim()) {
        const finalCategories: string[] = [];
        if(selectedType) finalCategories.push(selectedType);
        finalCategories.push(...Array.from(selectedPurposes));

        onSave(track.id, {
            title: title.trim(),
            artist: artist.trim() || undefined,
            category: finalCategories.length > 0 ? finalCategories.join(', ') : null
        });
        onClose();
    }
  };

  const handleDeleteClick = () => {
    if (track && onDelete) {
        onDelete(track.id, track.title);
        onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleTypeClick = (type: string) => {
    setSelectedType(prev => prev === type ? null : type);
  }

  const handlePurposeClick = (purpose: string) => {
    setSelectedPurposes(prev => {
        const newSet = new Set(prev);
        if (newSet.has(purpose)) {
            newSet.delete(purpose);
        } else {
            newSet.add(purpose);
        }
        return newSet;
    });
  }
  
  if (!track) return null;
  
  const typesToRender = isChinese ? CATEGORY_TYPES_ZH : CATEGORY_TYPES_EN;
  const purposesToRender = isChinese ? CATEGORY_PURPOSES_ZH : CATEGORY_PURPOSES_EN;
  const typeLabel = isChinese ? '类型' : 'Type';
  const purposeLabel = isChinese ? '用途' : 'Purpose';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border border-blue-200/20 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-600 rounded-t-lg"></div>
        
        <DialogHeader className="mb-6 space-y-3">
          <DialogTitle className="text-xl font-medium text-foreground flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-200/30 flex items-center justify-center backdrop-blur-sm">
              <PenSquare className="w-6 h-6 text-blue-600" />
            </div>
            {translations.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 leading-relaxed">
            {translations.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
            {/* Metadata Section */}
            <div className='space-y-4'>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground/80">
                    <PenSquare className="h-4 w-4" />
                    <span>音乐信息</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="track-title" className="text-xs font-medium text-muted-foreground/80">{translations.titleLabel}</Label>
                        <Input
                            ref={titleInputRef}
                            id="track-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={translations.titlePlaceholder}
                            className="h-11 text-base border-2 border-border/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:outline-none focus:shadow-lg focus:shadow-blue-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/15 focus-visible:ring-offset-0 transition-all duration-300 bg-background/50 backdrop-blur-sm rounded-xl hover:shadow-md hover:border-blue-400/60 hover:bg-background/70"
                            autoComplete="off"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="track-artist" className="text-xs font-medium text-muted-foreground/80">{translations.artistLabel}</Label>
                        <Input
                            id="track-artist"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            placeholder={translations.artistPlaceholder}
                            className="h-11 text-base border-2 border-border/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:outline-none focus:shadow-lg focus:shadow-blue-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/15 focus-visible:ring-offset-0 transition-all duration-300 bg-background/50 backdrop-blur-sm rounded-xl hover:shadow-md hover:border-blue-400/60 hover:bg-background/70"
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent"></div>
            
            {/* Categories Section */}
            <div className="space-y-4">
                 <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground/80">
                    <Tags className="h-4 w-4" />
                    <span>音乐分类</span>
                </div>
                <div className="space-y-4">
                    <div>
                        <Label className="text-xs font-medium text-muted-foreground/80 mb-3 block">{typeLabel} (选择一个)</Label>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(typesToRender).map(key => {
                                const isSelected = selectedType === key;
                                const bgColor = isSelected ? getTagColor(key) : undefined;
                                const textColor = isSelected ? getHighContrastTextColor(bgColor!) : undefined;
                                return (
                                    <Badge
                                        key={key}
                                        variant={isSelected ? "default" : "secondary"}
                                        onClick={() => handleTypeClick(key)}
                                        className={cn(
                                            "cursor-pointer text-sm py-2 px-4 border-transparent transition-all duration-200 hover:scale-105",
                                            isSelected ? "shadow-lg" : "hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                                        )}
                                        style={isSelected ? { backgroundColor: bgColor, color: textColor } : {}}
                                    >
                                        {key}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs font-medium text-muted-foreground/80 mb-3 block">{purposeLabel} (可选择多个)</Label>
                        <div className="flex flex-wrap gap-2">
                            {Object.keys(purposesToRender).map(key => {
                                 const isSelected = selectedPurposes.has(key);
                                 const bgColor = isSelected ? getTagColor(key) : undefined;
                                 const textColor = isSelected ? getHighContrastTextColor(bgColor!) : undefined;
                                 return (
                                    <Badge
                                        key={key}
                                        variant={isSelected ? "default" : "secondary"}
                                        onClick={() => handlePurposeClick(key)}
                                        className={cn(
                                            "cursor-pointer text-sm py-2 px-4 border-transparent transition-all duration-200 hover:scale-105",
                                            isSelected ? "shadow-lg" : "hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                                        )}
                                        style={isSelected ? { backgroundColor: bgColor, color: textColor } : {}}
                                    >
                                        {key}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gradient-to-r from-transparent via-border/50 to-transparent">
            {/* 左侧：删除按钮 */}
            <div className="flex-shrink-0">
                {onDelete ? (
                    <Button 
                        type="button" 
                        variant="ghost"
                        size="lg"
                        onClick={handleDeleteClick} 
                        className="h-11 px-6 text-red-600 hover:text-red-700 hover:bg-red-50/80 dark:hover:bg-red-900/20 border border-red-200/50 hover:border-red-300/70 transition-all duration-300 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除歌曲
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
                    className="h-11 px-6 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50 hover:border-border/70 transition-all duration-300 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md"
                >
                    {translations.cancelButton}
                </Button>
                <Button 
                    type="button" 
                    size="lg"
                    onClick={handleSaveClick} 
                    className="h-11 px-8 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 hover:from-blue-600 hover:via-blue-700 hover:to-cyan-600 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 rounded-xl border-0 focus:ring-4 focus:ring-blue-500/20"
                >
                    {translations.saveButton}
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

    