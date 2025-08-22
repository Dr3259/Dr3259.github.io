
"use client";

import React, { useState, useEffect } from 'react';
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
import { cn } from '@/lib/utils';

interface EditTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trackId: string, meta: { title: string, artist: string | undefined, category: string | null }) => void;
  track: TrackMetadata | null;
  translations: {
    title: string;
    description: string;
    titleLabel: string;
    titlePlaceholder: string;
    artistLabel: string;
    artistPlaceholder: string;
    categoryLabel: string;
    categoryPlaceholder: string; // This can be repurposed or removed
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
};

const CATEGORY_TYPES_ZH = Object.fromEntries(Object.entries(CATEGORY_TYPES_EN).map(([k, v]) => [v, k]));
const CATEGORY_PURPOSES_ZH = Object.fromEntries(Object.entries(CATEGORY_PURPOSES_EN).map(([k, v]) => [v, k]));


export const EditTrackModal: React.FC<EditTrackModalProps> = ({
  isOpen,
  onClose,
  onSave,
  track,
  translations,
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPurposes, setSelectedPurposes] = useState<Set<string>>(new Set());

  const isChinese = '流行' in CATEGORY_TYPES_ZH; // Simple check for language context

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
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>{translations.title}</DialogTitle>
          <DialogDescription>
            {translations.description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
             <div>
                <Label htmlFor="track-title">{translations.titleLabel}</Label>
                <Input
                    id="track-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={translations.titlePlaceholder}
                    autoComplete="off"
                />
            </div>
            <div>
                <Label htmlFor="track-artist">{translations.artistLabel}</Label>
                <Input
                    id="track-artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder={translations.artistPlaceholder}
                    autoComplete="off"
                />
            </div>
            <div className="space-y-2">
                <Label>{typeLabel}</Label>
                <div className="flex flex-wrap gap-2">
                    {Object.keys(typesToRender).map(key => (
                         <Badge
                            key={key}
                            variant={selectedType === key ? "default" : "secondary"}
                            onClick={() => handleTypeClick(key)}
                            className="cursor-pointer"
                        >
                            {key}
                        </Badge>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <Label>{purposeLabel}</Label>
                <div className="flex flex-wrap gap-2">
                    {Object.keys(purposesToRender).map(key => (
                         <Badge
                            key={key}
                            variant={selectedPurposes.has(key) ? "default" : "secondary"}
                            onClick={() => handlePurposeClick(key)}
                            className="cursor-pointer"
                        >
                            {key}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {translations.cancelButton}
          </Button>
          <Button type="button" onClick={handleSaveClick}>
            {translations.saveButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
