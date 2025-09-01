"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import type { Locale } from 'date-fns';
import { motion } from 'framer-motion';
import { ClipboardPaste } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface QuickAddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { text: string; date: Date; completed: boolean; }) => void;
  weekDays: Date[];
  translations: {
    modalTitle: string;
    modalDescription: string;
    todoPlaceholder: string;
    dateLabel: string;
    completedLabel: string;
    saveButton: string;
    cancelButton: string;
    pasteFromClipboard: string;
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
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setTodoText('');
      setIsCompleted(false);
      
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
    onSave({ text: todoText, date: new Date(selectedDate), completed: isCompleted });
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTodoText(text);
    } catch (err) {
      toast({ title: "Failed to paste", description: "Please check clipboard permissions.", variant: "destructive"});
      console.error('Failed to read clipboard contents: ', err);
    }
  };
  
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Enter') {
        const activeElement = document.activeElement;
        // Check if the active element is a button within the dialog to avoid double actions
        if (activeElement && activeElement.tagName === 'BUTTON' && activeElement.closest('[role="dialog"]')) {
           return;
        }

        if (todoText.trim() === '') {
            event.preventDefault();
            onClose();
        } else {
            handleSave();
        }
      }
    };
    
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isOpen, todoText, onClose, handleSave]);


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none p-0">
         <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="rounded-xl border bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl shadow-2xl text-neutral-800 dark:text-neutral-200 border-white/50 dark:border-neutral-800"
         >
            <DialogHeader className="p-6 pb-4">
                <DialogTitle className="text-base font-semibold">{translations.modalTitle}</DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-6 space-y-4">
                <div className="relative">
                    <Input
                        id="todo-text"
                        placeholder={translations.todoPlaceholder}
                        value={todoText}
                        onChange={(e) => setTodoText(e.target.value)}
                        className={cn(
                          "h-11 pl-4 pr-10 text-base bg-white/50 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-700/80 focus-visible:bg-white dark:focus-visible:bg-neutral-800",
                          "focus-visible:ring-offset-0 focus-visible:ring-primary/20"
                        )}
                        autoFocus
                        autoComplete="off"
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 text-neutral-500 hover:text-primary" onClick={handlePaste} title={translations.pasteFromClipboard}>
                        <ClipboardPaste className="h-4 w-4"/>
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 items-end">
                    <div className="space-y-1.5">
                        <Label htmlFor="todo-date" className="text-xs text-neutral-500">{translations.dateLabel}</Label>
                        <Select value={selectedDate} onValueChange={setSelectedDate}>
                            <SelectTrigger id="todo-date" className="h-10 bg-white/50 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-700/80 text-neutral-800 dark:text-neutral-200">
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
                     <div className="flex items-center space-x-2 pb-2 justify-end h-10">
                       <Checkbox 
                            id="completed-checkbox" 
                            checked={isCompleted}
                            onCheckedChange={(checked) => setIsCompleted(checked === true)}
                            className="border-primary/50"
                        />
                       <Label
                            htmlFor="completed-checkbox"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-700 dark:text-neutral-300"
                        >
                            {translations.completedLabel}
                       </Label>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-neutral-100/50 dark:bg-neutral-800/20 rounded-b-lg border-t border-white/50 dark:border-neutral-800 flex justify-end items-center space-x-2">
                <Button type="button" variant="ghost" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100" onClick={onClose}>
                    {translations.cancelButton}
                </Button>
                <Button type="submit" onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
                    {translations.saveButton}
                </Button>
            </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
