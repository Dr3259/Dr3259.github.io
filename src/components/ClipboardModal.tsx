
"use client";

import React from 'react';
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

interface ClipboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  content: string;
  translations: {
    modalTitle: string;
    modalDescription: string;
    saveButton: string;
    cancelButton: string;
  };
}

export const ClipboardModal: React.FC<ClipboardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  content,
  translations,
}) => {
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
        <ScrollArea className="max-h-60 w-full rounded-md border bg-muted/50 p-3 my-4">
          <pre className="text-sm text-foreground whitespace-pre-wrap break-words">
            {content}
          </pre>
        </ScrollArea>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {translations.cancelButton}
          </Button>
          <Button type="button" onClick={onSave}>
            {translations.saveButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
