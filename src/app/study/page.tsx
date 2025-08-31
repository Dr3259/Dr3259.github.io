
"use client";

import React, { useState, useEffect, useMemo, type DragEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Brain, BookOpen, Music, MoreVertical, Pin, PinOff, GripVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const translations = {
  'zh-CN': {
    backButton: '返回主页',
    pageTitle: '学习一下',
    pageDescription: '利用高效工具，规划你的学习时间。',
    pinnedTitle: '置顶功能',
    allFeaturesTitle: '所有功能',
    pinItem: '置顶',
    unpinItem: '取消置顶',
    pinLimitReached: '最多只能置顶2个项目',
    dragHandleLabel: '拖动排序',
    items: {
      pomodoro: { title: '番茄钟', description: '使用番茄工作法保持专注，劳逸结合。', icon: Clock, path: '/study/pomodoro' },
      flashcards: { title: '抽认卡', description: '创建和复习卡片，巩固记忆。', icon: Brain, path: '/study/flashcards' },
      knowledgeBase: { title: '知识库', description: '整理和查阅您的学习笔记和资料。', icon: BookOpen, path: '/study/knowledge-base' },
      studyMusic: { title: '学习音乐', description: '精选白噪音和纯音乐，创造沉浸式学习环境。', icon: Music, path: '/study/music' },
    }
  },
  'en': {
    backButton: 'Back to Home',
    pageTitle: 'Study Time',
    pageDescription: 'Plan your study time with efficient tools.',
    pinnedTitle: 'Pinned',
    allFeaturesTitle: 'All Features',
    pinItem: 'Pin',
    unpinItem: 'Unpin',
    pinLimitReached: 'You can only pin up to 2 items',
    dragHandleLabel: 'Drag to reorder',
    items: {
      pomodoro: { title: 'Pomodoro Timer', description: 'Stay focused with the Pomodoro Technique.', icon: Clock, path: '/study/pomodoro' },
      flashcards: { title: 'Flashcards', description: 'Create and review cards to consolidate knowledge.', icon: Brain, path: '/study/flashcards' },
      knowledgeBase: { title: 'Knowledge Base', description: 'Organize and consult your study notes and materials.', icon: BookOpen, path: '/study/knowledge-base' },
      studyMusic: { title: 'Study Music', description: 'Curated white noise and ambient music for focus.', icon: Music, path: '/study/music' },
    }
  }
};

type LanguageKey = keyof typeof translations;
type StudyItemKey = keyof (typeof translations)['en']['items'];

interface StudyItemProps {
  itemKey: StudyItemKey;
  icon: React.ElementType;
  title: string;
  description?: string;
  path: string;
  isPinned: boolean;
  canPin: boolean;
  onPinToggle: (itemKey: StudyItemKey) => void;
  onClick: (path: string) => void;
  pinLimitReachedText: string;
  pinItemText: string;
  unpinItemText: string;
  isDraggable?: boolean;
  dragHandleLabel?: string;
  onDragStart: (e: DragEvent, itemKey: StudyItemKey) => void;
  onDragEnter: (e: DragEvent, itemKey: StudyItemKey) => void;
  onDragEnd: (e: DragEvent) => void;
  isBeingDragged: boolean;
  isDragOver: boolean;
}

const LOCAL_STORAGE_KEY_PINNED_STUDY_ITEMS = 'weekglance_pinned_study_items_v1';
const LOCAL_STORAGE_KEY_UNPINNED_STUDY_ORDER = 'weekglance_unpinned_study_order_v1';
const MAX_PINS = 2;

const StudyItem: React.FC<StudyItemProps> = ({ 
    itemKey, icon: Icon, title, description, path, 
    isPinned, canPin, onPinToggle, onClick, 
    pinLimitReachedText, pinItemText, unpinItemText,
    isDraggable, dragHandleLabel,
    onDragStart, onDragEnter, onDragEnd, isBeingDragged, isDragOver,
}) => {
    const handleDragStart = (e: DragEvent) => {
        onDragStart(e, itemKey);
    };
  
    const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        onDragEnter(e, itemKey);
    }

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        "group w-full text-left p-4 sm:p-5 rounded-xl transition-all duration-200 flex items-center gap-5 relative focus-within:ring-2 focus-within:ring-primary/60 focus-within:ring-offset-2 focus-within:ring-offset-background",
        isPinned 
          ? "bg-primary/10 border-2 border-primary/20 hover:bg-primary/20 hover:shadow-lg"
          : "bg-card/60 hover:bg-card/90 hover:shadow-lg",
        isDraggable ? "cursor-grab" : "cursor-pointer",
        isBeingDragged && "opacity-50",
        isDragOver && 'border-2 border-primary border-dashed',
      )}
    >
      {isDraggable && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-hover:text-muted-foreground" title={dragHandleLabel}>
            <GripVertical className="h-5 w-5" />
        </div>
      )}
      <div 
        onClick={() => onClick(path)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(path); }}
        role="button"
        tabIndex={0}
        className={cn(
            "flex items-center gap-5 w-full focus:outline-none",
            isDraggable && "pl-5"
        )}
      >
          <div className={cn(
              "p-2.5 rounded-lg transition-colors",
              isPinned ? "bg-primary/20" : "bg-primary/10 group-hover:bg-primary/20"
          )}>
            <Icon className={cn("text-primary transition-transform duration-300 group-hover:scale-110 h-6 w-6")} />
          </div>
          <div className="flex-grow">
            <p className={cn("font-semibold text-foreground text-base")}>{title}</p>
            {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
          </div>
      </div>
      
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent onClick={(e) => e.stopPropagation()} align="end">
            {isPinned ? (
              <DropdownMenuItem onClick={() => onPinToggle(itemKey)}>
                <PinOff className="mr-2 h-4 w-4" />
                <span>{unpinItemText}</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onPinToggle(itemKey)} disabled={!canPin} title={!canPin ? pinLimitReachedText : ''}>
                <Pin className="mr-2 h-4 w-4" />
                <span>{pinItemText}</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default function StudyPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [pinnedItems, setPinnedItems] = useState<StudyItemKey[]>([]);
  const router = useRouter();

  const allItemKeys = useMemo(() => Object.keys(translations['en'].items) as StudyItemKey[], []);
  const [unpinnedOrder, setUnpinnedOrder] = useState<StudyItemKey[]>([]);
  
  const [draggedItem, setDraggedItem] = useState<StudyItemKey | null>(null);
  const [dragOverItem, setDragOverItem] = useState<StudyItemKey | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
      
      const savedPins = localStorage.getItem(LOCAL_STORAGE_KEY_PINNED_STUDY_ITEMS);
      const savedOrder = localStorage.getItem(LOCAL_STORAGE_KEY_UNPINNED_STUDY_ORDER);
      const initialPins = savedPins ? JSON.parse(savedPins) : [];
      setPinnedItems(initialPins);

      const initialUnpinned = allItemKeys.filter(key => !initialPins.includes(key));

      if (savedOrder) {
        const orderedKeys = JSON.parse(savedOrder) as StudyItemKey[];
        const validOrderedKeys = orderedKeys.filter(key => initialUnpinned.includes(key));
        const newItems = initialUnpinned.filter(key => !validOrderedKeys.includes(key));
        setUnpinnedOrder([...validOrderedKeys, ...newItems]);
      } else {
        setUnpinnedOrder(initialUnpinned);
      }
    }
  }, [allItemKeys]);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleNavigation = (path: string) => {
    console.log(`Navigating to: ${path}`);
    // router.push(path);
  };

  const handlePinToggle = (itemKey: StudyItemKey) => {
    let newPinnedItems;
    const isCurrentlyPinned = pinnedItems.includes(itemKey);

    if (isCurrentlyPinned) {
        newPinnedItems = pinnedItems.filter(key => key !== itemKey);
    } else {
        if (pinnedItems.length >= MAX_PINS) return;
        newPinnedItems = [...pinnedItems, itemKey];
    }
    
    setPinnedItems(newPinnedItems);
    localStorage.setItem(LOCAL_STORAGE_KEY_PINNED_STUDY_ITEMS, JSON.stringify(newPinnedItems));

    const newUnpinnedOrder = allItemKeys.filter(key => !newPinnedItems.includes(key));
    const reordered = unpinnedOrder.filter(key => newUnpinnedOrder.includes(key));
    const newlyUnpinned = newUnpinnedOrder.filter(key => !reordered.includes(key));
    const finalOrder = [...reordered, ...newlyUnpinned];

    setUnpinnedOrder(finalOrder);
    localStorage.setItem(LOCAL_STORAGE_KEY_UNPINNED_STUDY_ORDER, JSON.stringify(finalOrder));
  };
  
  const canPinMore = pinnedItems.length < MAX_PINS;
  
  const handleDragStart = (e: DragEvent, itemKey: StudyItemKey) => {
    setDraggedItem(itemKey);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemKey);
  };

  const handleDragEnter = (e: DragEvent, itemKey: StudyItemKey) => {
    if (draggedItem !== itemKey) {
        setDragOverItem(itemKey);
    }
  };

  const handleDragEnd = (e: DragEvent) => {
    if (draggedItem && dragOverItem && draggedItem !== dragOverItem) {
        const currentIndex = unpinnedOrder.indexOf(draggedItem);
        const targetIndex = unpinnedOrder.indexOf(dragOverItem);
        
        const newOrder = [...unpinnedOrder];
        const [movedItem] = newOrder.splice(currentIndex, 1);
        newOrder.splice(targetIndex, 0, movedItem);

        setUnpinnedOrder(newOrder);
        localStorage.setItem(LOCAL_STORAGE_KEY_UNPINNED_STUDY_ORDER, JSON.stringify(newOrder));
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-10 px-4 sm:px-8 items-center">
      <header className="w-full max-w-4xl mb-8 self-center">
        <Link href="/" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center text-center flex-grow">
        <h1 className="text-2xl sm:text-3xl font-headline font-bold text-primary mb-2">
          {t.pageTitle}
        </h1>
        <p className="text-muted-foreground mb-8 text-sm sm:text-base max-w-md">
            {t.pageDescription}
        </p>
        
        <div className="w-full space-y-12">
          {pinnedItems.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-left mb-4 text-foreground/80">{t.pinnedTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pinnedItems.map(itemKey => {
                  const item = t.items[itemKey];
                  return (
                    <StudyItem
                      key={itemKey}
                      itemKey={itemKey}
                      {...item}
                      isPinned={true}
                      canPin={true}
                      onPinToggle={handlePinToggle}
                      onClick={handleNavigation}
                      pinLimitReachedText={t.pinLimitReached}
                      pinItemText={t.pinItem}
                      unpinItemText={t.unpinItem}
                      isDraggable={false}
                      onDragStart={() => {}}
                      onDragEnter={() => {}}
                      onDragEnd={() => {}}
                      isBeingDragged={false}
                      isDragOver={false}
                    />
                  );
                })}
              </div>
            </section>
          )}

          <section>
              <h2 className="text-xl font-semibold text-left mb-4 text-foreground/80">{t.allFeaturesTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {unpinnedOrder.map(itemKey => {
                    const item = t.items[itemKey];
                    if (!item) return null;
                    return (
                       <StudyItem
                          key={itemKey}
                          itemKey={itemKey}
                          {...item}
                          isPinned={false}
                          canPin={canPinMore}
                          onPinToggle={handlePinToggle}
                          onClick={handleNavigation}
                          pinLimitReachedText={t.pinLimitReached}
                          pinItemText={t.pinItem}
                          unpinItemText={t.unpinItem}
                          isDraggable={true}
                          dragHandleLabel={t.dragHandleLabel}
                          onDragStart={handleDragStart}
                          onDragEnter={handleDragEnter}
                          onDragEnd={handleDragEnd}
                          isBeingDragged={draggedItem === itemKey}
                          isDragOver={dragOverItem === itemKey}
                      />
                    );
                })}
              </div>
            </section>
        </div>
      </main>
    </div>
  );
}
