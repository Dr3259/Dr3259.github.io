
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
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        if(todoText.trim() === '') {
            event.preventDefault();
            onClose();
        } else {
            handleSave();
        }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none p-0">
         <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="rounded-xl border border-border/30 bg-background/90 backdrop-blur-xl shadow-2xl text-foreground"
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
                        onKeyDown={handleKeyDown}
                        className="h-11 pl-4 pr-10 text-sm bg-muted/50 border-border/50 focus:bg-muted"
                        autoFocus
                        autoComplete="off"
                    />
                    <Button variant="ghost" size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground" onClick={handlePaste} title={translations.pasteFromClipboard}>
                        <ClipboardPaste className="h-4 w-4"/>
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 items-end">
                    <div className="space-y-1.5">
                        <Label htmlFor="todo-date" className="text-xs">{translations.dateLabel}</Label>
                        <Select value={selectedDate} onValueChange={setSelectedDate}>
                            <SelectTrigger id="todo-date" className="h-10 bg-muted/50 border-border/50">
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
                        />
                       <Label
                            htmlFor="completed-checkbox"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {translations.completedLabel}
                       </Label>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-muted/30 rounded-b-lg border-t flex justify-end items-center space-x-2">
                <Button type="button" variant="ghost" onClick={onClose}>
                    {translations.cancelButton}
                </Button>
                <Button type="submit" onClick={handleSave}>
                    {translations.saveButton}
                </Button>
            </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
