
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClipboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { category: string }) => void;
  content: string;
  translations: {
    modalTitle: string;
    modalDescription: string;
    saveButton: string;
    cancelButton: string;
    categoryLabel: string;
    categoryPlaceholder: string;
  };
}

export const ClipboardModal: React.FC<ClipboardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  content,
  translations,
}) => {
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCategory('');
    }
  }, [isOpen]);

  const handleSaveClick = () => {
    onSave({ category: category.trim() });
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader>
          <DialogTitle>{translations.modalTitle}</DialogTitle>
          <DialogDescription>
            {translations.modalDescription}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-40 w-full rounded-md border bg-muted/50 p-3 my-2">
          <pre className="text-sm text-foreground whitespace-pre-wrap break-words">
            {content}
          </pre>
        </ScrollArea>

        <div className="space-y-1.5">
          <Label htmlFor="clipboard-category">{translations.categoryLabel}</Label>
          <Input
            id="clipboard-category"
            placeholder={translations.categoryPlaceholder}
            value={category}
            onChange={(e) => setCategory(e.target.value.substring(0, 15))}
            maxLength={15}
            autoComplete="off"
          />
        </div>

        <DialogFooter className="mt-4">
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
