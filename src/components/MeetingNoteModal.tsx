
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
  deleteButton: string;
}

interface MeetingNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (day: string, hourSlot: string, note: MeetingNoteItem) => void;
  onDelete?: (noteId: string) => void;
  dayName: string;
  hourSlot: string;
  initialData?: MeetingNoteItem | null;
  translations: MeetingNoteModalTranslations;
}

const MAX_TITLE_LENGTH = 20;
const MAX_NOTES_LENGTH = 1000;
const MAX_ATTENDEES_LENGTH = 20;
const MAX_ACTION_ITEMS_LENGTH = 500;

export const MeetingNoteModal: React.FC<MeetingNoteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
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
    if (title.trim() === '' && notes.trim() === '') {
        onClose();
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

  const handleDeleteClick = () => {
    if (initialData?.id && onDelete) {
        onDelete(initialData.id);
    }
    onClose(); // Close the modal after invoking the delete callback
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            {initialData ? translations.modalTitleEdit(initialData.title || 'Note') : translations.modalTitleNew}
          </DialogTitle>
          <DialogDescription>
            {translations.modalDescription}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 p-2">
            <div>
              <Label htmlFor="meeting-title" className="text-xs font-medium text-muted-foreground mb-1 block">
                {translations.titleLabel}
              </Label>
              <Input
                id="meeting-title"
                value={title}
                onChange={(e) => setTitle(e.target.value.substring(0, MAX_TITLE_LENGTH))}
                placeholder={translations.titlePlaceholder}
                className="bg-background text-base py-2.5"
                maxLength={MAX_TITLE_LENGTH}
              />
              <div className="text-xs text-muted-foreground text-right mt-1 pr-1">
                {title.length}/{MAX_TITLE_LENGTH}
              </div>
            </div>

            <div>
              <Label htmlFor="meeting-notes" className="text-xs font-medium text-muted-foreground mb-1 block">
                {translations.notesLabel}
              </Label>
              <Textarea
                id="meeting-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value.substring(0, MAX_NOTES_LENGTH))}
                placeholder={translations.notesPlaceholder}
                className="bg-background min-h-[120px] text-base"
                maxLength={MAX_NOTES_LENGTH}
              />
              <div className="text-xs text-muted-foreground text-right mt-1 pr-1">
                {notes.length}/{MAX_NOTES_LENGTH}
              </div>
            </div>

            <div>
              <Label htmlFor="meeting-attendees" className="text-xs font-medium text-muted-foreground mb-1 block">
                {translations.attendeesLabel}
              </Label>
              <Input
                id="meeting-attendees"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value.substring(0, MAX_ATTENDEES_LENGTH))}
                placeholder={translations.attendeesPlaceholder}
                className="bg-background text-base py-2.5"
                maxLength={MAX_ATTENDEES_LENGTH}
              />
              <div className="text-xs text-muted-foreground text-right mt-1 pr-1">
                {attendees.length}/{MAX_ATTENDEES_LENGTH}
              </div>
            </div>

            <div>
              <Label htmlFor="meeting-action-items" className="text-xs font-medium text-muted-foreground mb-1 block">
                {translations.actionItemsLabel}
              </Label>
              <Textarea
                id="meeting-action-items"
                value={actionItems}
                onChange={(e) => setActionItems(e.target.value.substring(0, MAX_ACTION_ITEMS_LENGTH))}
                placeholder={translations.actionItemsPlaceholder}
                className="bg-background min-h-[80px] text-base"
                maxLength={MAX_ACTION_ITEMS_LENGTH}
              />
              <div className="text-xs text-muted-foreground text-right mt-1 pr-1">
                {actionItems.length}/{MAX_ACTION_ITEMS_LENGTH}
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
