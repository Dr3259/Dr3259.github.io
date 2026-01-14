"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Keyboard } from 'lucide-react';

interface KeyboardShortcut {
  key: string;
  description: string;
  category: string;
}

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  translations: {
    title: string;
    description: string;
    categories: {
      general: string;
      navigation: string;
      actions: string;
      debug: string;
    };
    shortcuts: {
      [key: string]: string;
    };
  };
}

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
  translations
}) => {
  const shortcuts: KeyboardShortcut[] = [
    { key: 'T', description: translations.shortcuts.addTodo, category: 'actions' },
    { key: 'B', description: translations.shortcuts.quickInspiration, category: 'actions' },
    { key: 'C', description: translations.shortcuts.quickDraft || '快速记录草稿', category: 'actions' },
    { key: 'L', description: translations.shortcuts.checkClipboard, category: 'actions' },
    { key: 'H', description: translations.shortcuts.showCalendar, category: 'navigation' },
    { key: 'DDD', description: translations.shortcuts.debugMode, category: 'debug' },
    { key: '?', description: translations.shortcuts.showHelp, category: 'general' },
  ];

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const categoryOrder = ['general', 'actions', 'navigation', 'debug'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Keyboard className="w-6 h-6 text-blue-500" />
            {translations.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {translations.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {categoryOrder.map((category) => {
            const categoryShortcuts = groupedShortcuts[category];
            if (!categoryShortcuts || categoryShortcuts.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-500 rounded"></span>
                  {translations.categories[category as keyof typeof translations.categories]}
                </h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut, index) => (
                    <Card key={index} className="p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">
                          {shortcut.description}
                        </span>
                        <kbd className="px-3 py-1.5 text-sm font-semibold text-foreground bg-muted border border-border rounded-md shadow-sm">
                          {shortcut.key}
                        </kbd>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
          <p className="font-medium mb-1">💡 提示：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>快捷键在输入框外使用时生效</li>
            <li>在输入框内输入时快捷键会被禁用</li>
            <li>按 Esc 键可以关闭大多数弹窗</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
