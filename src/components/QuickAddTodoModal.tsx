
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none p-0">
         <motion.div
            initial={{ opacity: 0.8, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="rounded-xl border border-white/10 bg-black/30 backdrop-blur-xl shadow-2xl"
         >
            <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-white">{translations.modalTitle}</DialogTitle>
            </DialogHeader>
            <div className="px-6 py-4 space-y-4">
                <div className="relative">
                    <Input
                        id="todo-text"
                        placeholder={translations.todoPlaceholder}
                        value={todoText}
                        onChange={(e) => setTodoText(e.target.value)}
                        className="h-12 pl-3 pr-12 text-base bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-offset-0 focus-visible:ring-primary/50"
                        autoFocus
                        autoComplete="off"
                    />
                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white" onClick={handlePaste} title={translations.pasteFromClipboard}>
                        <ClipboardPaste className="h-4 w-4"/>
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="todo-date" className="text-gray-300">{translations.dateLabel}</Label>
                        <Select value={selectedDate} onValueChange={setSelectedDate}>
                            <SelectTrigger id="todo-date" className="bg-white/5 border-white/20 text-white data-[placeholder]:text-gray-400">
                                <SelectValue placeholder="Select a date" />
                            </SelectTrigger>
                            <SelectContent className="bg-background/80 backdrop-blur-lg border-white/20 text-white">
                                {weekDays.map(day => (
                                    <SelectItem key={format(day, 'yyyy-MM-dd')} value={format(day, 'yyyy-MM-dd')} className="focus:bg-white/10 focus:text-white">
                                        {format(day, 'EEEE, MMM d', { locale: dateLocale })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="flex flex-col justify-end items-start space-y-2 pb-1">
                        <div className="flex items-center space-x-2">
                           <Checkbox 
                                id="completed-checkbox" 
                                checked={isCompleted}
                                onCheckedChange={(checked) => setIsCompleted(checked === true)}
                                className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                           <Label
                                htmlFor="completed-checkbox"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-200"
                            >
                                {translations.completedLabel}
                           </Label>
                        </div>
                    </div>
                </div>
            </div>
            <DialogFooter className="p-6 bg-black/20 rounded-b-lg">
                <Button type="button" variant="outline" onClick={onClose} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    {translations.cancelButton}
                </Button>
                <Button type="submit" onClick={handleSave}>
                    {translations.saveButton}
                </Button>
            </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
