
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

interface AddBookmarkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  suggestedTitle: string;
  translations: {
    title: string;
    description: string;
    label: string;
    placeholder: string;
    save: string;
    cancel: string;
  };
}

export const AddBookmarkDialog: React.FC<AddBookmarkDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  suggestedTitle,
  translations,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(suggestedTitle);
    }
  }, [isOpen, suggestedTitle]);

  const handleSaveClick = () => {
    if (title.trim()) {
      onSave(title.trim());
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>{translations.title}</DialogTitle>
          <DialogDescription>
            {translations.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="bookmark-title">{translations.label}</Label>
          <Input
            id="bookmark-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={translations.placeholder}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {translations.cancel}
          </Button>
          <Button type="button" onClick={handleSaveClick}>
            {translations.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
