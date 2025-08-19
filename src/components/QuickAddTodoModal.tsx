
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import type { Locale } from 'date-fns';

interface QuickAddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { text: string; date: Date }) => void;
  weekDays: Date[];
  translations: {
    modalTitle: string;
    modalDescription: string;
    todoPlaceholder: string;
    dateLabel: string;
    saveButton: string;
    cancelButton: string;
  };
  dateLocale: Locale;
}

export const QuickAddTodoModal: React.FC<QuickAddTodoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  weekDays,
  translations,
  dateLocale
}) => {
  const [todoText, setTodoText] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setTodoText('');
      // Set default date to today or the first day of the week
      const today = new Date();
      const todayString = format(today, 'yyyy-MM-dd');
      const weekDayStrings = weekDays.map(d => format(d, 'yyyy-MM-dd'));
      if (weekDayStrings.includes(todayString)) {
        setSelectedDate(todayString);
      } else if (weekDays.length > 0) {
        setSelectedDate(format(weekDays[0], 'yyyy-MM-dd'));
      }
    }
  }, [isOpen, weekDays]);

  const handleSave = () => {
    if (!todoText.trim() || !selectedDate) return;
    onSave({ text: todoText, date: new Date(selectedDate) });
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
          <DialogTitle>{translations.modalTitle}</DialogTitle>
          <DialogDescription>{translations.modalDescription}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="todo-text"
              placeholder={translations.todoPlaceholder}
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
              className="col-span-4"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="todo-date" className="text-right">
              {translations.dateLabel}
            </Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                    {weekDays.map(day => (
                        <SelectItem key={format(day, 'yyyy-MM-dd')} value={format(day, 'yyyy-MM-dd')}>
                            {format(day, 'EEEE, MMM d', { locale: dateLocale })}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {translations.cancelButton}
          </Button>
          <Button type="submit" onClick={handleSave}>
            {translations.saveButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
