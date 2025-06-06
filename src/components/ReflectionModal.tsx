
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ReflectionItem {
  id: string;
  text: string;
}

export interface ReflectionModalTranslations {
  modalTitleNew: string;
  modalTitleEdit: string;
  modalDescription: string;
  textLabel: string;
  textPlaceholder: string;
  saveButton: string;
  updateButton: string;
  cancelButton: string;
  deleteButton: string;
}

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (day: string, hourSlot: string, reflection: ReflectionItem) => void;
  onDelete?: (reflectionId: string) => void;
  dayName: string;
  hourSlot: string;
  initialData?: ReflectionItem | null;
  translations: ReflectionModalTranslations;
}

const MAX_REFLECTION_TEXT_LENGTH = 500;

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  dayName,
  hourSlot,
  initialData,
  translations,
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setText(initialData.text);
      } else {
        setText('');
      }
    }
  }, [isOpen, initialData]);

  const handleSaveOrUpdate = () => {
    if (text.trim() === '') {
        onClose(); // Don't save if empty, just close
        return;
    }

    const reflectionData: ReflectionItem = {
      id: initialData?.id || Date.now().toString(),
      text: text.trim(),
    };
    onSave(dayName, hourSlot, reflectionData);
    onClose();
  };

  const handleDeleteClick = () => {
    if (initialData?.id && onDelete) {
        onDelete(initialData.id);
    }
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            {initialData ? translations.modalTitleEdit : translations.modalTitleNew}
          </DialogTitle>
          <DialogDescription>
            {translations.modalDescription}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 p-2">
            <div>
              <Label htmlFor="reflection-text" className="text-xs font-medium text-muted-foreground mb-1 block">
                {translations.textLabel}
              </Label>
              <Textarea
                id="reflection-text"
                value={text}
                onChange={(e) => setText(e.target.value.substring(0, MAX_REFLECTION_TEXT_LENGTH))}
                placeholder={translations.textPlaceholder}
                className="bg-background min-h-[150px] text-base"
                maxLength={MAX_REFLECTION_TEXT_LENGTH}
              />
              <div className="text-xs text-muted-foreground text-right mt-1 pr-1">
                {text.length}/{MAX_REFLECTION_TEXT_LENGTH}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          {initialData && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              className="py-2.5 mt-2 sm:mt-0 sm:mr-auto"
            >
              {translations.deleteButton}
            </Button>
          )}
           <Button onClick={handleSaveOrUpdate} className="py-2.5">
            {initialData ? translations.updateButton : translations.saveButton}
          </Button>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} className="py-2.5 mt-2 sm:mt-0">
                {translations.cancelButton}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

