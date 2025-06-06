
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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"; // Added TooltipContent
import { Trash2, Hourglass, Sunrise, CalendarRange, ArrowRightToLine, CalendarPlus, Star as StarIcon } from 'lucide-react';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: string | null; // Changed to string for custom input
  deadline: 'hour' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'nextMonth' | null;
  importance: 'important' | 'notImportant' | null;
}

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTodos: (day: string, hourSlot: string, todos: TodoItem[]) => void;
  dayName: string;
  hourSlot: string;
  initialTodos?: TodoItem[];
  translations: {
    modalTitle: (hourSlot: string) => string;
    modalDescription: string;
    addItemPlaceholder: string;
    categoryInputPlaceholder: string; // Added for custom category input
    addButton: string;
    saveButton: string;
    noTodos: string;
    markComplete: string;
    markIncomplete: string;
    deleteTodo: string;
    categoryLabel: string;
    deadlineLabel: string;
    importanceLabel: string;
    selectPlaceholder: string;
    // categories removed as it's now custom input
    deadlines: {
        hour: string;
        tomorrow: string;
        thisWeek: string;
        nextWeek: string;
        nextMonth: string;
    };
    importances: {
        important: string;
        notImportant: string;
    };
  }
}

// CategoryIcons removed as category is now custom text

const DeadlineIcons: Record<NonNullable<TodoItem['deadline']>, React.ElementType> = {
  hour: Hourglass,
  tomorrow: Sunrise,
  thisWeek: CalendarRange,
  nextWeek: ArrowRightToLine,
  nextMonth: CalendarPlus,
};


export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSaveTodos,
  dayName,
  hourSlot,
  initialTodos = [],
  translations
}) => {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [newItemText, setNewItemText] = useState('');
  const [newCategory, setNewCategory] = useState<string | null>(null); // Changed to string
  const [newDeadline, setNewDeadline] = useState<TodoItem['deadline']>(null);
  const [newImportance, setNewImportance] = useState<TodoItem['importance']>(null);

  useEffect(() => {
    if (isOpen) {
        setTodos(initialTodos);
        setNewItemText('');
        setNewCategory(null); // Reset as null or empty string
        setNewDeadline(null);
        setNewImportance(null);
    }
  }, [isOpen, initialTodos]);

  const handleAddItem = () => {
    if (newItemText.trim() === '') return;
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false,
      category: newCategory ? newCategory.trim() : null, // Save trimmed category or null
      deadline: newDeadline,
      importance: newImportance,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
    setNewItemText('');
    setNewCategory(null);
    setNewDeadline(null);
    setNewImportance(null);
  };

  const toggleTodoCompletion = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleSave = () => {
    onSaveTodos(dayName, hourSlot, todos);
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  // getCategoryTooltip removed as icons are removed
  const getDeadlineTooltip = (deadline: TodoItem['deadline']) => {
    if (!deadline) return '';
    return `${translations.deadlineLabel} ${translations.deadlines[deadline]}`;
  }

  const getImportanceTooltip = (importance: TodoItem['importance']) => {
    if (importance === 'important') return `${translations.importanceLabel} ${translations.importances.important}`;
    return '';
  }


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle>{translations.modalTitle(hourSlot)}</DialogTitle>
          <DialogDescription>
            {translations.modalDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              id="todo-item-text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={translations.addItemPlaceholder}
              className="bg-background"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <Label htmlFor="todo-category" className="text-xs">{translations.categoryLabel}</Label>
                <Input
                  id="todo-category"
                  value={newCategory || ''}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder={translations.categoryInputPlaceholder}
                  className="w-full bg-background"
                />
              </div>
              <div>
                <Label htmlFor="todo-deadline" className="text-xs">{translations.deadlineLabel}</Label>
                <Select
                  value={newDeadline === null ? undefined : newDeadline}
                  onValueChange={(value) => setNewDeadline(value as TodoItem['deadline'])}
                >
                  <SelectTrigger id="todo-deadline" className="w-full bg-background">
                    <SelectValue placeholder={translations.selectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hour">{translations.deadlines.hour}</SelectItem>
                    <SelectItem value="tomorrow">{translations.deadlines.tomorrow}</SelectItem>
                    <SelectItem value="thisWeek">{translations.deadlines.thisWeek}</SelectItem>
                    <SelectItem value="nextWeek">{translations.deadlines.nextWeek}</SelectItem>
                    <SelectItem value="nextMonth">{translations.deadlines.nextMonth}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="todo-importance" className="text-xs">{translations.importanceLabel}</Label>
                <Select
                  value={newImportance === null ? undefined : newImportance}
                  onValueChange={(value) => setNewImportance(value as TodoItem['importance'])}
                >
                  <SelectTrigger id="todo-importance" className="w-full bg-background">
                    <SelectValue placeholder={translations.selectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="important">{translations.importances.important}</SelectItem>
                    <SelectItem value="notImportant">{translations.importances.notImportant}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddItem} className="w-full mt-2">{translations.addButton}</Button>
          </div>

          <ScrollArea className="h-[200px] w-full rounded-md border p-2 bg-background/50">
           <TooltipProvider> {/* Added TooltipProvider here */}
            {todos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{translations.noTodos}</p>
            ) : (
              <ul className="space-y-2">
                {todos.map(todo => {
                  // CategoryIcon removed
                  const DeadlineIcon = todo.deadline ? DeadlineIcons[todo.deadline] : null;

                  return (
                    <li key={todo.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 group">
                      <div className="flex items-center space-x-3 flex-grow min-w-0">
                         <Checkbox
                          id={`todo-${todo.id}`}
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodoCompletion(todo.id)}
                          aria-label={todo.completed ? translations.markIncomplete : translations.markComplete}
                        />
                        <label
                          htmlFor={`todo-${todo.id}`}
                          className={`text-sm cursor-pointer truncate ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                          title={todo.text}
                        >
                          {todo.text}
                        </label>
                      </div>
                      <div className="flex items-center space-x-1.5 ml-2 shrink-0">
                        {/* CategoryIcon display removed */}
                        {/* Optionally, display todo.category text here if desired */}
                        {/* For example: {todo.category && <span className="text-xs text-muted-foreground mr-1">({todo.category})</span>} */}
                        {DeadlineIcon && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DeadlineIcon className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{getDeadlineTooltip(todo.deadline)}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {todo.importance === 'important' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <StarIcon className="h-4 w-4 text-amber-500 fill-amber-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{getImportanceTooltip(todo.importance)}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100"
                          onClick={() => handleDeleteTodo(todo.id)}
                          aria-label={translations.deleteTodo}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            </TooltipProvider>
          </ScrollArea>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>{translations.saveButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
