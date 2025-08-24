
"use client";

import React, { useState, useEffect, useMemo, useCallback, type DragEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Cpu, MoreVertical, Pin, PinOff, GripVertical, BarChart3, Github, BrainCircuit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const translations = {
  'zh-CN': {
    backButton: '返回主页',
    pageTitle: '科技一下',
    pageDescription: '探索前沿科技，发现改变世界的工具。',
    pinnedTitle: '置顶功能',
    allFeaturesTitle: '所有功能',
    pinItem: '置顶',
    unpinItem: '取消置顶',
    pinLimitReached: '最多只能置顶2个项目',
    dragHandleLabel: '拖动排序',
    items: {
      languageRankings: { title: '开发语言排行榜', description: '查看最新的编程语言流行趋势。', icon: BarChart3, path: '/tech/language-rankings' },
      githubTrending: { title: 'GitHub趋势榜', description: '洞察开源世界的持久度与潜力股。', icon: Github, path: '/tech/github-trending' },
      aiWorld: { title: 'AI 世界', description: '探索全球AI模型、产品与公司，抹平全球AI信息差。', icon: BrainCircuit, path: '/tech/ai-world' },
    }
  },
  'en': {
    backButton: 'Back to Home',
    pageTitle: 'Tech Time',
    pageDescription: 'Explore cutting-edge technology and discover world-changing tools.',
    pinnedTitle: 'Pinned',
    allFeaturesTitle: 'All Features',
    pinItem: 'Pin',
    unpinItem: 'Unpin',
    pinLimitReached: 'You can only pin up to 2 items',
    dragHandleLabel: 'Drag to reorder',
    items: {
      languageRankings: { title: 'Language Rankings', description: 'Check out the latest trends in programming languages.', icon: BarChart3, path: '/tech/language-rankings' },
      githubTrending: { title: 'GitHub Trending', description: 'Insights into open source persistence and potential.', icon: Github, path: '/tech/github-trending' },
      aiWorld: { title: 'AI World', description: 'Explore global AI models, products, and companies to bridge the information gap.', icon: BrainCircuit, path: '/tech/ai-world' },
    }
  }
};

type LanguageKey = keyof typeof translations;
type TechItemKey = keyof (typeof translations)['en']['items'];

interface TechItemProps {
  itemKey: TechItemKey;
  icon: React.ElementType;
  title: string;
  description?: string;
  path: string;
  isPinned: boolean;
  canPin: boolean;
  onPinToggle: (itemKey: TechItemKey) => void;
  onClick: (path: string) => void;
  pinLimitReachedText: string;
  pinItemText: string;
  unpinItemText: string;
  isDraggable: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>, itemKey: TechItemKey) => void;
  onDragOver?: (e: DragEvent<HTMLDivElement>, itemKey: TechItemKey) => void;
  onDragLeave?: (e: DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: DragEvent<HTMLDivElement>, itemKey: TechItemKey) => void;
  onDragEnd?: (e: DragEvent<HTMLDivElement>) => void;
  isBeingDragged: boolean;
  isDragOver: boolean;
  dragHandleLabel: string;
}

const LOCAL_STORAGE_KEY_PINNED_TECH_ITEMS = 'weekglance_pinned_tech_items_v1';
const LOCAL_STORAGE_KEY_UNPINNED_TECH_ORDER = 'weekglance_unpinned_tech_order_v1';
const MAX_PINS = 2;

const TechItem: React.FC<TechItemProps> = ({ 
    itemKey, icon: Icon, title, description, path, 
    isPinned, canPin, onPinToggle, onClick, 
    pinLimitReachedText, pinItemText, unpinItemText,
    isDraggable, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd,
    isBeingDragged, isDragOver, dragHandleLabel
}) => {
  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => onDragStart?.(e, itemKey)}
      onDragOver={(e) => onDragOver?.(e, itemKey)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop?.(e, itemKey)}
      onDragEnd={onDragEnd}
      className={cn(
        "group w-full text-left p-4 sm:p-5 rounded-xl transition-all duration-200 flex items-center gap-5 relative",
        "focus-within:ring-2 focus-within:ring-primary/60 focus-within:ring-offset-2 focus-within:ring-offset-background",
        isPinned 
          ? "bg-primary/10 border-2 border-primary/20 hover:bg-primary/20 hover:shadow-lg"
          : "bg-card/60 hover:bg-card/90 hover:shadow-lg",
        isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isBeingDragged && "opacity-50 ring-2 ring-primary",
        isDragOver && "border-t-4 border-t-primary"
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


export default function TechPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [pinnedItems, setPinnedItems] = useState<TechItemKey[]>([]);
  const router = useRouter();

  const allItemKeys = useMemo(() => Object.keys(translations['en'].items) as TechItemKey[], []);

  const [unpinnedOrder, setUnpinnedOrder] = useState<TechItemKey[]>([]);
  const [draggedItem, setDraggedItem] = useState<TechItemKey | null>(null);
  const [dragOverItem, setDragOverItem] = useState<TechItemKey | null>(null);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
      
      const savedPins = localStorage.getItem(LOCAL_STORAGE_KEY_PINNED_TECH_ITEMS);
      const savedOrder = localStorage.getItem(LOCAL_STORAGE_KEY_UNPINNED_TECH_ORDER);
      const initialPins = savedPins ? JSON.parse(savedPins) : [];
      setPinnedItems(initialPins);

      const initialUnpinned = allItemKeys.filter(key => !initialPins.includes(key));

      if (savedOrder) {
        const orderedKeys = JSON.parse(savedOrder) as TechItemKey[];
        const validOrderedKeys = orderedKeys.filter(key => initialUnpinned.includes(key));
        const newItems = initialUnpinned.filter(key => !validOrderedKeys.includes(key));
        setUnpinnedOrder([...validOrderedKeys, ...newItems]);
      } else {
        setUnpinnedOrder(initialUnpinned);
      }
    }
  }, [allItemKeys]);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const handleNavigation = useCallback((path: string) => {
    router.push(path)
  }, [router]);

  const handlePinToggle = (itemKey: TechItemKey) => {
    let newPinnedItems;
    const isCurrentlyPinned = pinnedItems.includes(itemKey);

    if (isCurrentlyPinned) {
        newPinnedItems = pinnedItems.filter(key => key !== itemKey);
    } else {
        if (pinnedItems.length >= MAX_PINS) return;
        newPinnedItems = [...pinnedItems, itemKey];
    }
    
    setPinnedItems(newPinnedItems);
    localStorage.setItem(LOCAL_STORAGE_KEY_PINNED_TECH_ITEMS, JSON.stringify(newPinnedItems));

    const newUnpinnedOrder = allItemKeys.filter(key => !newPinnedItems.includes(key));
    const reordered = unpinnedOrder.filter(key => newUnpinnedOrder.includes(key));
    const newlyUnpinned = newUnpinnedOrder.filter(key => !reordered.includes(key));
    const finalOrder = [...reordered, ...newlyUnpinned];

    setUnpinnedOrder(finalOrder);
    localStorage.setItem(LOCAL_STORAGE_KEY_UNPINNED_TECH_ORDER, JSON.stringify(finalOrder));
  };
  
  const canPinMore = pinnedItems.length < MAX_PINS;
  
  const handleDragStart = (e: DragEvent<HTMLDivElement>, itemKey: TechItemKey) => {
      setDraggedItem(itemKey);
      e.dataTransfer.effectAllowed = "move";
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>, itemKey: TechItemKey) => {
      e.preventDefault(); 
      if (draggedItem !== itemKey) {
        setDragOverItem(itemKey);
      }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    setDragOverItem(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropTargetKey: TechItemKey) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === dropTargetKey) {
        return;
    }

    const currentIndex = unpinnedOrder.indexOf(draggedItem);
    const targetIndex = unpinnedOrder.indexOf(dropTargetKey);
    
    const newOrder = [...unpinnedOrder];
    newOrder.splice(currentIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);
    
    setUnpinnedOrder(newOrder);
    localStorage.setItem(LOCAL_STORAGE_KEY_UNPINNED_TECH_ORDER, JSON.stringify(newOrder));
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
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
                    <TechItem
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
                      isBeingDragged={false}
                      isDragOver={false}
                      dragHandleLabel={t.dragHandleLabel}
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
                        <TechItem
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
                          onDragStart={handleDragStart}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onDragEnd={handleDragEnd}
                          isBeingDragged={draggedItem === itemKey}
                          isDragOver={dragOverItem === itemKey}
                          dragHandleLabel={t.dragHandleLabel}
                        />
                    );
                })}
                 {unpinnedOrder.length === 0 && pinnedItems.length === 0 && (
                     <div className="md:col-span-2 flex flex-col items-center justify-center text-center text-muted-foreground h-full py-20 bg-card rounded-xl">
                        <Cpu className="h-20 w-20 mb-6" />
                        <p className="max-w-xs">更多功能，敬请期待！</p>
                    </div>
                )}
              </div>
            </section>
        </div>
      </main>
    </div>
  );
}
