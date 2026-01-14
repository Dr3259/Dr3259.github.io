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
import { FileText } from 'lucide-react';

interface QuickDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { content: string; date: Date }) => void;
  translations: {
    title: string;
    placeholder: string;
    saveButton: string;
    cancelButton: string;
  };
}

const MAX_DRAFT_LENGTH = 2000;

export const QuickDraftModal: React.FC<QuickDraftModalProps> = ({
  isOpen,
  onClose,
  onSave,
  translations,
}) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      setContent('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (content.trim() === '') {
      onClose();
      return;
    }

    onSave({
      content: content.trim(),
      date: new Date(),
    });
    
    setContent('');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border border-amber-800/20 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-t-lg"></div>
        
        <DialogHeader className="space-y-3 mb-6">
          <DialogTitle className="text-xl font-medium text-foreground flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-700/20 to-amber-800/20 border border-amber-700/30 flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-6 h-6 text-amber-800" />
            </div>
            {translations.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 leading-relaxed">
            快速记录你的草稿内容，将保存到当前时间段。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Textarea
              id="draft-content"
              value={content}
              onChange={(e) => setContent(e.target.value.substring(0, MAX_DRAFT_LENGTH))}
              placeholder={translations.placeholder}
              className="min-h-[300px] text-base leading-relaxed resize-none border-2 border-border/50 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/15 focus:outline-none focus:shadow-lg focus:shadow-amber-700/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-700/15 focus-visible:ring-offset-0 transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md hover:border-amber-700/60 hover:bg-background/70"
              maxLength={MAX_DRAFT_LENGTH}
              autoComplete="off"
              autoFocus
              style={{ 
                boxShadow: 'none',
                outline: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
            />
            <div className="flex justify-end mt-2">
              <span className="text-xs text-muted-foreground/60">
                {content.length} / {MAX_DRAFT_LENGTH}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end items-center pt-6">
          <div className="flex space-x-3">
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose} className="py-3 border-amber-700/30 hover:bg-amber-50/50 hover:border-amber-700/50 transition-all duration-200">
                {translations.cancelButton}
              </Button>
            </DialogClose>
            <Button onClick={handleSave} className="py-3 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              {translations.saveButton}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
