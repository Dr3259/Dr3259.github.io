
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
import { Trash2 } from 'lucide-react';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
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
    addButton: string;
    saveButton: string;
    noTodos: string;
    markComplete: string;
    markIncomplete: string;
    deleteTodo: string;
  }
}

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

  useEffect(() => {
    if (isOpen) {
        setTodos(initialTodos); // Reset/load todos when modal opens or initialTodos change
        setNewItemText(''); // Reset input field
    }
  }, [isOpen, initialTodos]);

  const handleAddItem = () => {
    if (newItemText.trim() === '') return;
    const newTodo: TodoItem = {
      id: Date.now().toString(), 
      text: newItemText.trim(),
      completed: false,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
    setNewItemText('');
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>{translations.modalTitle(hourSlot)}</DialogTitle>
          <DialogDescription>
            {translations.modalDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Input
              id="todo-item"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder={translations.addItemPlaceholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddItem();
                  e.preventDefault(); 
                }
              }}
              className="bg-background"
            />
            <Button onClick={handleAddItem}>{translations.addButton}</Button>
          </div>
          <ScrollArea className="h-[200px] w-full rounded-md border p-2 bg-background/50">
            {todos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{translations.noTodos}</p>
            ) : (
              <ul className="space-y-2">
                {todos.map(todo => (
                  <li key={todo.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 group">
                    <div className="flex items-center space-x-3">
                       <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodoCompletion(todo.id)}
                        aria-label={todo.completed ? translations.markIncomplete : translations.markComplete}
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className={`text-sm cursor-pointer ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                      >
                        {todo.text}
                      </label>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-50 group-hover:opacity-100"
                      onClick={() => handleDeleteTodo(todo.id)}
                      aria-label={translations.deleteTodo}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
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
