
"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
    Trash2, Hourglass, Sunrise, CalendarRange, ArrowRightToLine, CalendarPlus, Star as StarIcon, FileEdit,
    Briefcase, BookOpen, ShoppingCart, Archive, Coffee, ChefHat, Baby, CalendarClock, CalendarCheck
} from 'lucide-react';

export type CategoryType = 'work' | 'study' | 'shopping' | 'organizing' | 'relaxing' | 'cooking' | 'childcare' | 'dating';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: CategoryType | null;
  deadline: 'hour' | 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'nextMonth' | null;
  importance: 'important' | 'notImportant' | null;
}

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTodos: (dateKey: string, hourSlot: string, todos: TodoItem[]) => void; // Changed from dayName to dateKey
  dateKey: string; // YYYY-MM-DD
  hourSlot: string;
  initialTodos?: TodoItem[];
  translations: {
    modalTitle: (hourSlot: string) => string;
    modalDescription: string;
    addItemPlaceholder: string;
    categoryInputPlaceholder: string;
    addButton: string;
    updateButton: string;
    saveButton: string;
    noTodos: string;
    markComplete: string;
    markIncomplete: string;
    editTodo: string;
    deleteTodo: string;
    categoryLabel: string;
    deadlineLabel: string;
    importanceLabel: string;
    selectPlaceholder: string;
    categories: Record<CategoryType, string>;
    deadlines: {
        hour: string;
        today: string;
        tomorrow: string;
        thisWeek: string;
        nextWeek: string;
        nextMonth: string;
    };
    importances: {
        important: string;
        notImportant: string;
    };
  };
  defaultEditingTodoId?: string;
}

const CategoryIcons: Record<CategoryType, React.ElementType> = {
  work: Briefcase,
  study: BookOpen,
  shopping: ShoppingCart,
  organizing: Archive,
  relaxing: Coffee,
  cooking: ChefHat,
  childcare: Baby,
  dating: CalendarClock,
};

const DeadlineIcons: Record<NonNullable<TodoItem['deadline']>, React.ElementType> = {
  hour: Hourglass,
  today: CalendarCheck,
  tomorrow: Sunrise,
  thisWeek: CalendarRange,
  nextWeek: ArrowRightToLine,
  nextMonth: CalendarPlus,
};


export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSaveTodos,
  dateKey, // Changed from dayName
  hourSlot,
  initialTodos = [],
  translations,
  defaultEditingTodoId
}) => {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [newItemText, setNewItemText] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType | null>(null);
  const [newDeadline, setNewDeadline] = useState<TodoItem['deadline']>(null);
  const [newImportance, setNewImportance] = useState<TodoItem['importance']>(null);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setNewItemText('');
    setNewCategory(null);
    setNewDeadline(null);
    setNewImportance(null);
    setEditingTodoId(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
        setTodos(initialTodos); 
        const itemToEdit = defaultEditingTodoId ? initialTodos.find(t => t.id === defaultEditingTodoId) : null;
        if (itemToEdit) {
            handleStartEdit(itemToEdit);
        } else {
            resetForm(); 
        }
    }
  }, [isOpen, initialTodos, defaultEditingTodoId, resetForm]);


  const handleAddOrUpdateItem = () => {
    if (newItemText.trim() === '') return;

    if (editingTodoId) {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === editingTodoId
            ? {
                ...todo,
                text: newItemText.trim(),
                category: newCategory,
                deadline: newDeadline,
                importance: newImportance,
              }
            : todo
        )
      );
    } else {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        completed: false,
        category: newCategory,
        deadline: newDeadline,
        importance: newImportance,
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
    }
    resetForm();
  };

  const handleStartEdit = (todoToEdit: TodoItem) => {
    setEditingTodoId(todoToEdit.id);
    setNewItemText(todoToEdit.text);
    setNewCategory(todoToEdit.category);
    setNewDeadline(todoToEdit.deadline);
    setNewImportance(todoToEdit.importance);
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
    if (editingTodoId === id) {
        resetForm();
    }
  };

  const handleSave = () => {
    onSaveTodos(dateKey, hourSlot, todos); // Pass dateKey
    onClose(); 
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const getCategoryTooltip = (category: CategoryType | null) => {
    if (!category || !translations.categories[category]) return '';
    return `${translations.categoryLabel} ${translations.categories[category]}`;
  };

  const getDeadlineTooltip = (deadline: TodoItem['deadline']) => {
    if (!deadline || !translations.deadlines[deadline as keyof typeof translations.deadlines]) return '';
    return `${translations.deadlineLabel} ${translations.deadlines[deadline as keyof typeof translations.deadlines]}`;
  }

  const getImportanceTooltip = (importance: TodoItem['importance']) => {
    if (importance === 'important') return `${translations.importanceLabel} ${translations.importances.important}`;
    return '';
  }


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">{translations.modalTitle(hourSlot)}</DialogTitle>
          <DialogDescription>
            {translations.modalDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Input
                id="todo-item-text"
                value={newItemText}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewItemText(value.substring(0, 50));
                }}
                placeholder={translations.addItemPlaceholder}
                className="bg-background pr-14 py-2.5 text-base"
                maxLength={50}
              />
              <div className="absolute bottom-1/2 right-3 translate-y-1/2 text-xs text-muted-foreground">
                {newItemText.length} / 50
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="todo-category" className="text-xs font-medium text-muted-foreground mb-1 block">{translations.categoryLabel}</Label>
                 <Select
                    value={newCategory || undefined}
                    onValueChange={(value) => setNewCategory(value as CategoryType)}
                 >
                  <SelectTrigger id="todo-category" className="w-full bg-background">
                    <SelectValue placeholder={translations.selectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(translations.categories).map(([key, label]) => (
                         <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="todo-deadline" className="text-xs font-medium text-muted-foreground mb-1 block">{translations.deadlineLabel}</Label>
                <Select
                  value={newDeadline || undefined}
                  onValueChange={(value) => setNewDeadline(value as TodoItem['deadline'])}
                >
                  <SelectTrigger id="todo-deadline" className="w-full bg-background">
                    <SelectValue placeholder={translations.selectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hour">{translations.deadlines.hour}</SelectItem>
                    <SelectItem value="today">{translations.deadlines.today}</SelectItem>
                    <SelectItem value="tomorrow">{translations.deadlines.tomorrow}</SelectItem>
                    <SelectItem value="thisWeek">{translations.deadlines.thisWeek}</SelectItem>
                    <SelectItem value="nextWeek">{translations.deadlines.nextWeek}</SelectItem>
                    <SelectItem value="nextMonth">{translations.deadlines.nextMonth}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="todo-importance" className="text-xs font-medium text-muted-foreground mb-1 block">{translations.importanceLabel}</Label>
                <Select
                  value={newImportance || undefined}
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
            <Button onClick={handleAddOrUpdateItem} className="w-full py-2.5 text-base">
              {editingTodoId ? translations.updateButton : translations.addButton}
            </Button>
          </div>

          <ScrollArea className="h-[220px] w-full rounded-lg border p-3 bg-background/30 shadow-inner">
           <TooltipProvider>
            {todos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{translations.noTodos}</p>
            ) : (
              <ul className="space-y-2.5 p-px">
                {todos.map(todo => {
                  const CategoryIcon = todo.category ? CategoryIcons[todo.category] : null;
                  const DeadlineIcon = todo.deadline ? DeadlineIcons[todo.deadline] : null;

                  return (
                    <li key={todo.id} className="flex items-center justify-between p-2.5 rounded-md bg-background hover:bg-muted/60 group shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex items-center space-x-2.5 flex-grow min-w-0">
                         <Checkbox
                          id={`modal-todo-${todo.id}`}
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodoCompletion(todo.id)}
                          aria-label={todo.completed ? translations.markIncomplete : translations.markComplete}
                          className="border-primary/50 shrink-0"
                        />
                        <div className="flex items-center space-x-1.5 shrink-0">
                          {CategoryIcon && todo.category && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CategoryIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground/80 transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{getCategoryTooltip(todo.category)}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {DeadlineIcon && todo.deadline && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DeadlineIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground/80 transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{getDeadlineTooltip(todo.deadline)}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {todo.importance === 'important' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <StarIcon className="h-4 w-4 text-amber-400 fill-amber-400 group-hover:text-amber-500 group-hover:fill-amber-500 transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{getImportanceTooltip(todo.importance)}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <label
                          htmlFor={`modal-todo-${todo.id}`}
                          className={`text-sm cursor-pointer flex-1 min-w-0 ${todo.completed ? 'line-through text-muted-foreground/80' : 'text-foreground/90'}`}
                          title={todo.text}
                        >
                          {todo.text.length > 20 ? todo.text.substring(0, 20) + '...' : todo.text}
                        </label>
                      </div>
                      <div className="flex items-center space-x-1 ml-2 shrink-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-primary opacity-30 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleStartEdit(todo)}
                              aria-label={translations.editTodo}
                            >
                              <FileEdit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{translations.editTodo}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-30 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteTodo(todo.id)}
                              aria-label={translations.deleteTodo}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{translations.deleteTodo}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            </TooltipProvider>
          </ScrollArea>
        </div>
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} className="py-2.5">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} className="py-2.5">{translations.saveButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

