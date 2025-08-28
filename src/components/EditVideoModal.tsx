
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
import type { VideoFile } from '@/lib/db';

interface EditVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (video: VideoFile, newName: string) => void;
  video: VideoFile | null;
  translations: {
    title: string;
    description: string;
    nameLabel: string;
    originalFilenameLabel: string;
    saveButton: string;
    cancelButton: string;
  };
}

export const EditVideoModal: React.FC<EditVideoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  video,
  translations,
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen && video) {
      setName(video.name);
    }
  }, [isOpen, video]);

  const handleSaveClick = () => {
    if (video && name.trim()) {
      onSave(video, name.trim());
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>{translations.title}</DialogTitle>
          <DialogDescription>{translations.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="video-name">{translations.nameLabel}</Label>
            <Input
              id="video-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
             <p className="text-sm text-muted-foreground">
                <span className="font-semibold">{translations.originalFilenameLabel}</span> {video.content.name}
             </p>
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
