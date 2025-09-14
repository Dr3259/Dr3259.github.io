
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  onSaveTodos: (dateKey: string, hourSlot: string, todos: TodoItem[]) => void;
  dateKey: string;
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

export const CategoryIcons: Record<CategoryType, React.ElementType> = {
  work: Briefcase,
  study: BookOpen,
  shopping: ShoppingCart,
  organizing: Archive,
  relaxing: Coffee,
  cooking: ChefHat,
  childcare: Baby,
  dating: CalendarClock,
};

export const DeadlineIcons: Record<NonNullable<TodoItem['deadline']>, React.ElementType> = {
  hour: Hourglass,
  today: CalendarCheck,
  tomorrow: Sunrise,
  thisWeek: CalendarRange,
  nextWeek: ArrowRightToLine,
  nextMonth: CalendarPlus,
};

// Helper function to compare two TodoItem objects
const compareTodoItems = (item1: TodoItem, item2: TodoItem): boolean => {
    return item1.id === item2.id &&
           item1.text === item2.text &&
           item1.completed === item2.completed &&
           item1.category === item2.category &&
           item1.deadline === item2.deadline &&
           item1.importance === item2.importance;
};

// Helper function to compare two arrays of TodoItem objects
const areTodosArraysEqual = (arr1: TodoItem[], arr2: TodoItem[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    if (arr1.length === 0 && arr2.length === 0) return true;

    // Sort by ID for consistent comparison if order might change
    const sortedArr1 = [...arr1].sort((a, b) => a.id.localeCompare(b.id));
    const sortedArr2 = [...arr2].sort((a, b) => a.id.localeCompare(b.id));

    for (let i = 0; i < sortedArr1.length; i++) {
        if (!compareTodoItems(sortedArr1[i], sortedArr2[i])) {
            return false;
        }
    }
    return true;
};


export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  onSaveTodos,
  dateKey,
  hourSlot,
  initialTodos = [],
  translations,
  defaultEditingTodoId
}) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [originalTodosOnOpen, setOriginalTodosOnOpen] = useState<TodoItem[]>([]);
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

  const handleStartEdit = useCallback((todoToEdit: TodoItem) => {
    setEditingTodoId(todoToEdit.id);
    setNewItemText(todoToEdit.text);
    setNewCategory(todoToEdit.category);
    setNewDeadline(todoToEdit.deadline);
    setNewImportance(todoToEdit.importance);
  }, []);


  useEffect(() => {
    if (isOpen) {
        // Deep copy of initialTodos to avoid reference issues and capture the state at modal open
        const deepCopiedInitialTodos = JSON.parse(JSON.stringify(initialTodos)) as TodoItem[];
        setTodos(deepCopiedInitialTodos); 
        setOriginalTodosOnOpen(deepCopiedInitialTodos);

        const itemToEdit = defaultEditingTodoId ? deepCopiedInitialTodos.find(t => t.id === defaultEditingTodoId) : null;
        if (itemToEdit) {
            handleStartEdit(itemToEdit);
        } else {
            resetForm(); 
        }
    }
  }, [isOpen, initialTodos, defaultEditingTodoId, resetForm, handleStartEdit]);


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
    onSaveTodos(dateKey, hourSlot, todos);
    onClose(); 
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const isSaveDisabled = useMemo(() => {
    return areTodosArraysEqual(todos, originalTodosOnOpen);
  }, [todos, originalTodosOnOpen]);

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
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border border-purple-200/20 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 rounded-t-lg"></div>
        
        <DialogHeader className="mb-6 space-y-3">
          <DialogTitle className="text-xl font-medium text-foreground flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-200/30 flex items-center justify-center backdrop-blur-sm">
              <CalendarClock className="w-6 h-6 text-purple-600" />
            </div>
            {translations.modalTitle(hourSlot)}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 leading-relaxed">
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
                className="h-12 text-base border-2 border-border/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 focus:outline-none focus:shadow-lg focus:shadow-purple-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/15 focus-visible:ring-offset-0 transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl pr-14 py-3 shadow-sm hover:shadow-md hover:border-purple-400/60 hover:bg-background/70"
                maxLength={50}
                autoComplete="off"
                style={{ 
                  boxShadow: 'none',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
              />
              <div className="absolute bottom-1/2 right-3 translate-y-1/2 text-xs text-muted-foreground/60">
                {newItemText.length} / 50
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="todo-category" className="text-xs font-medium text-muted-foreground/80 mb-2 block">{translations.categoryLabel}</Label>
                 <Select
                    value={newCategory || undefined}
                    onValueChange={(value) => setNewCategory(value as CategoryType)}
                 >
                  <SelectTrigger id="todo-category" className="w-full bg-background/80 backdrop-blur-sm border-purple-200/30 hover:border-purple-300/50 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/15 focus:outline-none transition-all duration-200">
                    <SelectValue placeholder={translations.selectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-200/30">
                    {Object.entries(translations.categories).map(([key, label]) => (
                         <SelectItem key={key} value={key} className="hover:bg-purple-50/50 focus:bg-purple-50/50">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="todo-deadline" className="text-xs font-medium text-muted-foreground/80 mb-2 block">{translations.deadlineLabel}</Label>
                <Select
                  value={newDeadline || undefined}
                  onValueChange={(value) => setNewDeadline(value as TodoItem['deadline'])}
                >
                  <SelectTrigger id="todo-deadline" className="w-full bg-background/80 backdrop-blur-sm border-purple-200/30 hover:border-purple-300/50 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/15 focus:outline-none transition-all duration-200">
                    <SelectValue placeholder={translations.selectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-200/30">
                    <SelectItem value="hour" className="hover:bg-purple-50/50 focus:bg-purple-50/50">{translations.deadlines.hour}</SelectItem>
                    <SelectItem value="today" className="hover:bg-purple-50/50 focus:bg-purple-50/50">{translations.deadlines.today}</SelectItem>
                    <SelectItem value="tomorrow" className="hover:bg-purple-50/50 focus:bg-purple-50/50">{translations.deadlines.tomorrow}</SelectItem>
                    <SelectItem value="thisWeek" className="hover:bg-purple-50/50 focus:bg-purple-50/50">{translations.deadlines.thisWeek}</SelectItem>
                    <SelectItem value="nextWeek" className="hover:bg-purple-50/50 focus:bg-purple-50/50">{translations.deadlines.nextWeek}</SelectItem>
                    <SelectItem value="nextMonth" className="hover:bg-purple-50/50 focus:bg-purple-50/50">{translations.deadlines.nextMonth}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="todo-importance" className="text-xs font-medium text-muted-foreground/80 mb-2 block">{translations.importanceLabel}</Label>
                <Select
                  value={newImportance || undefined}
                  onValueChange={(value) => setNewImportance(value as TodoItem['importance'])}
                >
                  <SelectTrigger id="todo-importance" className="w-full bg-background/80 backdrop-blur-sm border-purple-200/30 hover:border-purple-300/50 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/15 focus:outline-none transition-all duration-200">
                    <SelectValue placeholder={translations.selectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-xl border-purple-200/30">
                    <SelectItem value="important" className="hover:bg-purple-50/50 focus:bg-purple-50/50">{translations.importances.important}</SelectItem>
                    <SelectItem value="notImportant" className="hover:bg-purple-50/50 focus:bg-purple-50/50">{translations.importances.notImportant}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddOrUpdateItem} className="w-full py-3 text-base bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              {editingTodoId ? translations.updateButton : translations.addButton}
            </Button>
          </div>

          <ScrollArea className="h-[220px] w-full rounded-xl border border-purple-200/30 p-3 bg-gradient-to-br from-background/60 via-background/40 to-background/60 backdrop-blur-sm shadow-inner">
           <TooltipProvider>
            {todos.length === 0 ? (
              <p className="text-sm text-muted-foreground/60 text-center py-8">{translations.noTodos}</p>
            ) : (
              <ul className="space-y-2.5 p-px">
                {todos.map(todo => {
                  const CategoryIcon = todo.category ? CategoryIcons[todo.category] : null;
                  const DeadlineIcon = todo.deadline ? DeadlineIcons[todo.deadline] : null;

                  return (
                    <li key={todo.id} className="flex items-center justify-between p-3 rounded-lg bg-background/60 backdrop-blur-sm border border-purple-100/20 hover:bg-background/80 hover:border-purple-200/40 group shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex items-center space-x-3 flex-grow min-w-0">
                         <Checkbox
                          id={`modal-todo-${todo.id}`}
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodoCompletion(todo.id)}
                          aria-label={todo.completed ? translations.markIncomplete : translations.markComplete}
                          className="border-purple-300/50 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 shrink-0"
                        />
                        <div className="flex items-center space-x-1.5 shrink-0">
                          {CategoryIcon && todo.category && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <CategoryIcon className="h-4 w-4 text-muted-foreground/60 group-hover:text-purple-600 transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-background/95 backdrop-blur-xl border-purple-200/30">
                                <p>{getCategoryTooltip(todo.category)}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {DeadlineIcon && todo.deadline && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DeadlineIcon className="h-4 w-4 text-muted-foreground/60 group-hover:text-purple-600 transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-background/95 backdrop-blur-xl border-purple-200/30">
                                <p>{getDeadlineTooltip(todo.deadline)}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {todo.importance === 'important' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <StarIcon className="h-4 w-4 text-purple-400 fill-purple-400 group-hover:text-purple-500 group-hover:fill-purple-500 transition-colors" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-background/95 backdrop-blur-xl border-purple-200/30">
                                <p>{getImportanceTooltip(todo.importance)}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <label
                          htmlFor={`modal-todo-${todo.id}`}
                          className={`text-sm cursor-pointer flex-1 min-w-0 transition-colors ${todo.completed ? 'line-through text-muted-foreground/60' : 'text-foreground/90 group-hover:text-foreground'}`}
                          title={todo.text}
                        >
                          {todo.text.length > 20 ? todo.text.substring(0, 20) + '...' : todo.text}
                        </label>
                      </div>
                      <div className="flex items-center space-x-1 ml-3 shrink-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground/60 hover:text-purple-600 hover:bg-purple-50/50 opacity-30 group-hover:opacity-100 transition-all duration-200"
                              onClick={() => handleStartEdit(todo)}
                              aria-label={translations.editTodo}
                            >
                              <FileEdit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-background/95 backdrop-blur-xl border-purple-200/30">
                            <p>{translations.editTodo}</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground/60 hover:text-red-500 hover:bg-red-50/50 opacity-30 group-hover:opacity-100 transition-all duration-200"
                              onClick={() => handleDeleteTodo(todo.id)}
                              aria-label={translations.deleteTodo}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-background/95 backdrop-blur-xl border-purple-200/30">
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
        <DialogFooter className="mt-6 gap-3">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} className="py-3 border-purple-200/30 hover:bg-purple-50/50 hover:border-purple-300/50 transition-all duration-200">取消</Button>
          </DialogClose>
          <Button onClick={handleSave} className="py-3 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSaveDisabled}>{translations.saveButton}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
