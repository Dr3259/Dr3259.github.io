
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
import { Lightbulb } from 'lucide-react';

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
  onSave: (dateKey: string, hourSlot: string, reflection: ReflectionItem) => void; // Changed dayName to dateKey
  onDelete?: (reflectionId: string) => void;
  dateKey: string; // YYYY-MM-DD
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
  dateKey, // Changed from dayName
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
        onClose(); 
        return;
    }

    const reflectionData: ReflectionItem = {
      id: initialData?.id || Date.now().toString(),
      text: text.trim(),
    };
    onSave(dateKey, hourSlot, reflectionData); // Pass dateKey
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
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border border-green-200/20 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-t-lg"></div>
        
        <DialogHeader className="space-y-3 mb-6">
          <DialogTitle className="text-xl font-medium text-foreground flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-200/30 flex items-center justify-center backdrop-blur-sm">
              <Lightbulb className="w-6 h-6 text-green-600" />
            </div>
            {initialData ? translations.modalTitleEdit : translations.modalTitleNew}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 leading-relaxed">
            {translations.modalDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="reflection-text" className="text-xs font-medium text-muted-foreground/80 mb-2 block">
              {translations.textLabel}
            </Label>
            <Textarea
              id="reflection-text"
              value={text}
              onChange={(e) => setText(e.target.value.substring(0, MAX_REFLECTION_TEXT_LENGTH))}
              placeholder={translations.textPlaceholder}
              className="min-h-[200px] text-base leading-relaxed resize-none border-2 border-border/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:outline-none focus:shadow-lg focus:shadow-green-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-500/15 focus-visible:ring-offset-0 transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md hover:border-green-400/60 hover:bg-background/70"
              maxLength={MAX_REFLECTION_TEXT_LENGTH}
              autoComplete="off"
              style={{ 
                boxShadow: 'none',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
            />
            <div className="flex justify-end mt-2">
              <span className="text-xs text-muted-foreground/60">
                {text.length} / {MAX_REFLECTION_TEXT_LENGTH}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center pt-6">
          <div>
            {initialData && onDelete && (
              <Button
                variant="ghost"
                onClick={handleDeleteClick}
                className="py-3 text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-200"
              >
                {translations.deleteButton}
              </Button>
            )}
          </div>
          <div className="flex space-x-3">
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose} className="py-3 border-green-200/30 hover:bg-green-50/50 hover:border-green-300/50 transition-all duration-200">
                {translations.cancelButton}
              </Button>
            </DialogClose>
            <Button onClick={handleSaveOrUpdate} className="py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              {initialData ? translations.updateButton : translations.saveButton}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
