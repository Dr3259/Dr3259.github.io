
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

interface EditTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trackId: string, category: string | null) => void;
  track: TrackMetadata | null;
  translations: {
    title: string;
    description: string;
    categoryLabel: string;
    categoryPlaceholder: string;
    saveButton: string;
    cancelButton: string;
  };
}

export const EditTrackModal: React.FC<EditTrackModalProps> = ({
  isOpen,
  onClose,
  onSave,
  track,
  translations,
}) => {
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (isOpen && track) {
      setCategory(track.category || '');
    }
  }, [isOpen, track]);

  const handleSaveClick = () => {
    if (track) {
      onSave(track.id, category.trim() || null);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  
  if (!track) return null;

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
                <p className="text-sm font-medium text-muted-foreground">Track Title</p>
                <p className="text-base font-semibold truncate" title={track.title}>{track.title}</p>
            </div>
            <div>
                <Label htmlFor="track-category">{translations.categoryLabel}</Label>
                <Input
                    id="track-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value.substring(0, 20))}
                    placeholder={translations.categoryPlaceholder}
                    autoComplete="off"
                    maxLength={20}
                />
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
