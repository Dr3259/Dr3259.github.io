
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
import { PenSquare, Tags } from 'lucide-react';
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
            titleInputRef.current.focus();
            titleInputRef.current.setSelectionRange(titleInputRef.current.value.length, titleInputRef.current.value.length);
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
      <DialogContent className="sm:max-w-xl bg-card">
        <DialogHeader>
          <DialogTitle>{translations.title}</DialogTitle>
          <DialogDescription>
            {translations.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2 space-y-6">
            {/* Metadata Section */}
            <div className='space-y-4'>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <PenSquare className="h-4 w-4" />
                    <span>Metadata</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="track-title">{translations.titleLabel}</Label>
                        <Input
                            ref={titleInputRef}
                            id="track-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={translations.titlePlaceholder}
                            autoComplete="off"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="track-artist">{translations.artistLabel}</Label>
                        <Input
                            id="track-artist"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            placeholder={translations.artistPlaceholder}
                            autoComplete="off"
                        />
                    </div>
                </div>
            </div>

            <Separator />
            
            {/* Categories Section */}
            <div className="space-y-4">
                 <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Tags className="h-4 w-4" />
                    <span>Categories</span>
                </div>
                <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">{typeLabel} (Select one)</Label>
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
                                    className="cursor-pointer text-sm py-1 px-3 border-transparent"
                                    style={isSelected ? { backgroundColor: bgColor, color: textColor } : {}}
                                >
                                    {key}
                                </Badge>
                            )
                        })}
                    </div>
                </div>
                <div className="space-y-3">
                    <Label className="text-xs text-muted-foreground">{purposeLabel} (Select multiple)</Label>
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
                                    className="cursor-pointer text-sm py-1 px-3 border-transparent"
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

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
            {onDelete && (
                <Button type="button" variant="destructive" onClick={handleDeleteClick} className="mt-2 sm:mt-0 sm:mr-auto">
                    Delete
                </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose} className="mt-2 sm:mt-0">
              {translations.cancelButton}
            </Button>
            <Button type="button" onClick={handleSaveClick} className="mt-2 sm:mt-0">
              {translations.saveButton}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
