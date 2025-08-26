
"use client";

import { useState, useEffect, useMemo, useCallback, type DragEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BrainCircuit, HeartPulse, Sparkles, Leaf, MoreVertical, Pin, PinOff, GripVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const translations = {
  'zh-CN': {
    backButton: '返回主页',
    pageTitle: '健康中心',
    pageDescription: '关注您的身心健康，让生活更美好。',
    pinnedTitle: '置顶功能',
    allFeaturesTitle: '所有功能',
    pinItem: '置顶',
    unpinItem: '取消置顶',
    pinLimitReached: '最多只能置顶2个项目',
    dragHandleLabel: '拖动排序',
    items: {
      mentalHealth: { title: '心理健康', description: '关注情绪与思维健康，提供正念练习与心理支持工具。', icon: BrainCircuit, path: '/health/mental' },
      physicalHealth: { title: '身体健康', description: '追踪身体指标，获取个性化运动与营养建议。', icon: HeartPulse, path: '/health/physical' },
      stayYoung: { title: '永葆青春', description: '探索前沿科技，了解延缓衰老的科学方法。', icon: Sparkles, path: '/health/stay-young' },
      vegetarianism: { title: '素食主义', description: '探索植物性饮食带来的健康与活力。', icon: Leaf, path: '/health/vegetarianism' },
    }
  },
  'en': {
    backButton: 'Back to Home',
    pageTitle: 'Health Center',
    pageDescription: 'Focus on your mental and physical well-being for a better life.',
    pinnedTitle: 'Pinned',
    allFeaturesTitle: 'All Features',
    pinItem: 'Pin',
    unpinItem: 'Unpin',
    pinLimitReached: 'You can only pin up to 2 items',
    dragHandleLabel: 'Drag to reorder',
    items: {
      mentalHealth: { title: 'Mental Health', description: 'Care for your emotional and cognitive well-being with mindfulness and support tools.', icon: BrainCircuit, path: '/health/mental' },
      physicalHealth: { title: 'Physical Health', description: 'Track physical metrics and get personalized fitness and nutrition advice.', icon: HeartPulse, path: '/health/physical' },
      stayYoung: { title: 'Stay Young', description: 'Explore cutting-edge science on anti-aging and longevity.', icon: Sparkles, path: '/health/stay-young' },
      vegetarianism: { title: 'Vegetarianism', description: 'Explore the health and vitality of a plant-based diet.', icon: Leaf, path: '/health/vegetarianism' },
    }
  }
};

type LanguageKey = keyof typeof translations;
type HealthItemKey = keyof (typeof translations)['en']['items'];

interface HealthItemProps {
  itemKey: HealthItemKey;
  icon: React.ElementType;
  title: string;
  description?: string;
  path: string;
  isPinned: boolean;
  canPin: boolean;
  onPinToggle: (itemKey: HealthItemKey) => void;
  onClick: (path: string) => void;
  pinLimitReachedText: string;
  pinItemText: string;
  unpinItemText: string;
  isDraggable: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>, itemKey: HealthItemKey) => void;
  onDragOver?: (e: DragEvent<HTMLDivElement>, itemKey: HealthItemKey) => void;
  onDragLeave?: (e: DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: DragEvent<HTMLDivElement>, itemKey: HealthItemKey) => void;
  onDragEnd?: (e: DragEvent<HTMLDivElement>) => void;
  isBeingDragged: boolean;
  isDragOver: boolean;
  dragHandleLabel: string;
}

const LOCAL_STORAGE_KEY_PINNED_HEALTH_ITEMS = 'weekglance_pinned_health_items_v1';
const LOCAL_STORAGE_KEY_UNPINNED_HEALTH_ORDER = 'weekglance_unpinned_health_order_v1';
const MAX_PINS = 2;

const HealthItem: React.FC<HealthItemProps> = ({ 
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


export default function HealthPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [pinnedItems, setPinnedItems] = useState<HealthItemKey[]>([]);
  const router = useRouter();

  const allItemKeys = useMemo(() => Object.keys(translations['en'].items) as HealthItemKey[], []);

  const [unpinnedOrder, setUnpinnedOrder] = useState<HealthItemKey[]>([]);
  const [draggedItem, setDraggedItem] = useState<HealthItemKey | null>(null);
  const [dragOverItem, setDragOverItem] = useState<HealthItemKey | null>(null);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
      
      const savedPins = localStorage.getItem(LOCAL_STORAGE_KEY_PINNED_HEALTH_ITEMS);
      const savedOrder = localStorage.getItem(LOCAL_STORAGE_KEY_UNPINNED_HEALTH_ORDER);
      const initialPins = savedPins ? JSON.parse(savedPins) : [];
      setPinnedItems(initialPins);

      const initialUnpinned = allItemKeys.filter(key => !initialPins.includes(key));

      if (savedOrder) {
        const orderedKeys = JSON.parse(savedOrder) as HealthItemKey[];
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
      router.push(path);
  }, [router]);

  const handlePinToggle = (itemKey: HealthItemKey) => {
    let newPinnedItems;
    const isCurrentlyPinned = pinnedItems.includes(itemKey);

    if (isCurrentlyPinned) {
        newPinnedItems = pinnedItems.filter(key => key !== itemKey);
    } else {
        if (pinnedItems.length >= MAX_PINS) return;
        newPinnedItems = [...pinnedItems, itemKey];
    }
    
    setPinnedItems(newPinnedItems);
    localStorage.setItem(LOCAL_STORAGE_KEY_PINNED_HEALTH_ITEMS, JSON.stringify(newPinnedItems));

    const newUnpinnedOrder = allItemKeys.filter(key => !newPinnedItems.includes(key));
    const reordered = unpinnedOrder.filter(key => newUnpinnedOrder.includes(key));
    const newlyUnpinned = newUnpinnedOrder.filter(key => !reordered.includes(key));
    const finalOrder = [...reordered, ...newlyUnpinned];

    setUnpinnedOrder(finalOrder);
    localStorage.setItem(LOCAL_STORAGE_KEY_UNPINNED_HEALTH_ORDER, JSON.stringify(finalOrder));
  };
  
  const canPinMore = pinnedItems.length < MAX_PINS;
  
  const handleDragStart = (e: DragEvent<HTMLDivElement>, itemKey: HealthItemKey) => {
      setDraggedItem(itemKey);
      e.dataTransfer.effectAllowed = "move";
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>, itemKey: HealthItemKey) => {
      e.preventDefault(); 
      if (draggedItem !== itemKey) {
        setDragOverItem(itemKey);
      }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    setDragOverItem(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropTargetKey: HealthItemKey) => {
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
    localStorage.setItem(LOCAL_STORAGE_KEY_UNPINNED_HEALTH_ORDER, JSON.stringify(newOrder));
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
                    <HealthItem
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
                        <HealthItem
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
              </div>
            </section>
        </div>
      </main>
    </div>
  );
}
