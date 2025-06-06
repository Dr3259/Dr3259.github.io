
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface MeetingNoteItem {
  id: string;
  title: string;
  notes: string;
  attendees: string;
  actionItems: string;
}

export interface MeetingNoteModalTranslations {
  modalTitleNew: string;
  modalTitleEdit: (title: string) => string;
  modalDescription: string;
  titleLabel: string;
  titlePlaceholder: string;
  notesLabel: string;
  notesPlaceholder: string;
  attendeesLabel: string;
  attendeesPlaceholder: string;
  actionItemsLabel: string;
  actionItemsPlaceholder: string;
  saveButton: string;
  updateButton: string;
  cancelButton: string;
}

interface MeetingNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (day: string, hourSlot: string, note: MeetingNoteItem) => void;
  dayName: string;
  hourSlot: string;
  initialData?: MeetingNoteItem | null;
  translations: MeetingNoteModalTranslations;
}

export const MeetingNoteModal: React.FC<MeetingNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  dayName,
  hourSlot,
  initialData,
  translations,
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [attendees, setAttendees] = useState('');
  const [actionItems, setActionItems] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setNotes(initialData.notes);
        setAttendees(initialData.attendees);
        setActionItems(initialData.actionItems);
      } else {
        setTitle('');
        setNotes('');
        setAttendees('');
        setActionItems('');
      }
    }
  }, [isOpen, initialData]);

  const handleSaveOrUpdate = () => {
    if (title.trim() === '' && notes.trim() === '') { // Require at least title or notes
        onClose(); // Or show an error
        return;
    }

    const noteData: MeetingNoteItem = {
      id: initialData?.id || Date.now().toString(),
      title: title.trim(),
      notes: notes.trim(),
      attendees: attendees.trim(),
      actionItems: actionItems.trim(),
    };
    onSave(dayName, hourSlot, noteData);
    onClose();
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            {initialData ? translations.modalTitleEdit(initialData.title || 'Note') : translations.modalTitleNew}
          </DialogTitle>
          <DialogDescription>
            {translations.modalDescription}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="meeting-title" className="text-xs font-medium text-muted-foreground mb-1 block">
                {translations.titleLabel}
              </Label>
              <Input
                id="meeting-title"
                value={title}
                onChange={(e) => setTitle(e.target.value.substring(0,100))}
                placeholder={translations.titlePlaceholder}
                className="bg-background text-base py-2.5"
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="meeting-notes" className="text-xs font-medium text-muted-foreground mb-1 block">
                {translations.notesLabel}
              </Label>
              <Textarea
                id="meeting-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={translations.notesPlaceholder}
                className="bg-background min-h-[120px] text-base"
              />
            </div>

            <div>
              <Label htmlFor="meeting-attendees" className="text-xs font-medium text-muted-foreground mb-1 block">
                {translations.attendeesLabel}
              </Label>
              <Input
                id="meeting-attendees"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder={translations.attendeesPlaceholder}
                className="bg-background text-base py-2.5"
              />
            </div>

            <div>
              <Label htmlFor="meeting-action-items" className="text-xs font-medium text-muted-foreground mb-1 block">
                {translations.actionItemsLabel}
              </Label>
              <Textarea
                id="meeting-action-items"
                value={actionItems}
                onChange={(e) => setActionItems(e.target.value)}
                placeholder={translations.actionItemsPlaceholder}
                className="bg-background min-h-[80px] text-base"
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} className="py-2.5">{translations.cancelButton}</Button>
          </DialogClose>
          <Button onClick={handleSaveOrUpdate} className="py-2.5">
            {initialData ? translations.updateButton : translations.saveButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
