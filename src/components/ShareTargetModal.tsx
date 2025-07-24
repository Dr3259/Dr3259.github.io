
"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from './ui/scroll-area';
import { type Locale } from 'date-fns';

interface ReceivedShareData {
  title: string;
  text: string;
  url: string;
}

interface ShareTargetModalTranslations {
  modalTitle: string;
  modalDescription: string;
  saveButton: string;
  cancelButton: string;
}

interface ShareTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (targetDate: Date) => void;
  shareData: ReceivedShareData;
  translations: ShareTargetModalTranslations;
  dateLocale: Locale;
}

export const ShareTargetModal: React.FC<ShareTargetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  shareData,
  translations,
  dateLocale,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleSaveClick = () => {
    if (selectedDate) {
      onSave(selectedDate);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-card p-6">
        <DialogHeader>
          <DialogTitle>{translations.modalTitle}</DialogTitle>
          <DialogDescription>{translations.modalDescription}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
            <div className="mb-4 p-3 border rounded-lg bg-muted/50 max-h-40">
                <ScrollArea className="h-full">
                    <p className="text-sm font-semibold text-foreground truncate" title={shareData.title}>{shareData.title || 'No Title'}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate" title={shareData.url}>{shareData.url || shareData.text}</p>
                </ScrollArea>
            </div>
            <div className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 30)) } // Example: disable dates more than 30 days ago
                    initialFocus
                    locale={dateLocale}
                    weekStartsOn={1}
                />
            </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {translations.cancelButton}
          </Button>
          <Button onClick={handleSaveClick} disabled={!selectedDate}>
            {translations.saveButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
