
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
  onSave: (dateKey: string, hourSlot: string, note: MeetingNoteItem) => void; // Changed dayName to dateKey
  onDelete?: (noteId: string) => void;
  dateKey: string; // YYYY-MM-DD
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
  dateKey, // Changed from dayName
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
    onSave(dateKey, hourSlot, noteData); // Pass dateKey
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
      <DialogContent className="sm:max-w-3xl border-none shadow-2xl bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl overflow-hidden">
        {/* 顶部装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-t-lg" />
        
        <DialogHeader className="relative pt-8 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
                {initialData ? translations.modalTitleEdit(initialData.title || 'Note') : translations.modalTitleNew}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground/80 text-base leading-relaxed">
                {translations.modalDescription}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="grid gap-6">
            {/* 会议标题 */}
            <div className="group">
              <Label htmlFor="meeting-title" className="text-sm font-semibold text-foreground/90 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                {translations.titleLabel}
              </Label>
              <div className="relative">
                <Input
                  id="meeting-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.substring(0, MAX_TITLE_LENGTH))}
                  placeholder={translations.titlePlaceholder}
                  className="h-12 text-base border-2 border-border/50 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 focus:outline-none focus:shadow-lg focus:shadow-amber-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/15 focus-visible:ring-offset-0 transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl px-4 shadow-sm hover:shadow-md hover:border-amber-400/60 hover:bg-background/70"
                  maxLength={MAX_TITLE_LENGTH}
                  autoComplete="off"
                  style={{ 
                    boxShadow: 'none',
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                />
                <div className="absolute -bottom-6 right-0 text-xs text-muted-foreground/60">
                  {title.length}/{MAX_TITLE_LENGTH}
                </div>
              </div>
            </div>

            {/* 会议记录 */}
            <div className="group">
              <Label htmlFor="meeting-notes" className="text-sm font-semibold text-foreground/90 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                {translations.notesLabel}
              </Label>
              <div className="relative">
                <Textarea
                  id="meeting-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.substring(0, MAX_NOTES_LENGTH))}
                  placeholder={translations.notesPlaceholder}
                  className="min-h-[140px] text-base border-2 border-border/50 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 focus:outline-none focus:shadow-lg focus:shadow-amber-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/15 focus-visible:ring-offset-0 transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl p-4 shadow-sm resize-none hover:shadow-md hover:border-amber-400/60 hover:bg-background/70"
                  maxLength={MAX_NOTES_LENGTH}
                  autoComplete="off"
                  style={{ 
                    boxShadow: 'none',
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                />
                <div className="absolute -bottom-6 right-0 text-xs text-muted-foreground/60">
                  {notes.length}/{MAX_NOTES_LENGTH}
                </div>
              </div>
            </div>

            {/* 双列布局：参会人员 & 行动项 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 参会人员 */}
              <div className="group">
                <Label htmlFor="meeting-attendees" className="text-sm font-semibold text-foreground/90 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  {translations.attendeesLabel}
                </Label>
                <div className="relative">
                  <Input
                    id="meeting-attendees"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value.substring(0, MAX_ATTENDEES_LENGTH))}
                    placeholder={translations.attendeesPlaceholder}
                    className="h-12 text-base border-2 border-border/50 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 focus:outline-none focus:shadow-lg focus:shadow-amber-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/15 focus-visible:ring-offset-0 transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl px-4 shadow-sm hover:shadow-md hover:border-amber-400/60 hover:bg-background/70"
                    maxLength={MAX_ATTENDEES_LENGTH}
                    autoComplete="off"
                    style={{ 
                      boxShadow: 'none',
                      outline: 'none',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  />
                  <div className="absolute -bottom-6 right-0 text-xs text-muted-foreground/60">
                    {attendees.length}/{MAX_ATTENDEES_LENGTH}
                  </div>
                </div>
              </div>

              {/* 行动项 */}
              <div className="group">
                <Label htmlFor="meeting-action-items" className="text-sm font-semibold text-foreground/90 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  {translations.actionItemsLabel}
                </Label>
                <div className="relative">
                  <Textarea
                    id="meeting-action-items"
                    value={actionItems}
                    onChange={(e) => setActionItems(e.target.value.substring(0, MAX_ACTION_ITEMS_LENGTH))}
                    placeholder={translations.actionItemsPlaceholder}
                    className="min-h-[100px] text-base border-2 border-border/50 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 focus:outline-none focus:shadow-lg focus:shadow-amber-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/15 focus-visible:ring-offset-0 transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl p-4 shadow-sm resize-none hover:shadow-md hover:border-amber-400/60 hover:bg-background/70"
                    maxLength={MAX_ACTION_ITEMS_LENGTH}
                    autoComplete="off"
                    style={{ 
                      boxShadow: 'none',
                      outline: 'none',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  />
                  <div className="absolute -bottom-6 right-0 text-xs text-muted-foreground/60">
                    {actionItems.length}/{MAX_ACTION_ITEMS_LENGTH}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮区域 */}
        <div className="relative">
          {/* 分隔线 */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <DialogFooter className="px-6 py-6 bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm">
            <div className="flex items-center justify-between w-full">
              {/* 删除按钮 */}
              {initialData && onDelete && (
                <Button
                  variant="ghost"
                  onClick={handleDeleteClick}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300 px-6 py-2.5 rounded-xl"
                >
                  {translations.deleteButton}
                </Button>
              )}
              
              {/* 右侧按钮组 */}
              <div className="flex items-center gap-3 ml-auto">
                <Button 
                  variant="outline" 
                  onClick={onClose} 
                  className="px-6 py-2.5 rounded-xl border-2 hover:bg-background/80 transition-all duration-300"
                >
                  {translations.cancelButton}
                </Button>
                <Button 
                  onClick={handleSaveOrUpdate} 
                  className="px-8 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {initialData ? translations.updateButton : translations.saveButton}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
