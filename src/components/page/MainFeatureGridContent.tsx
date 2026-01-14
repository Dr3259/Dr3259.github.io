
"use client";

import React, { useState, useEffect, useMemo, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PauseCircle, HeartPulse, Cpu, Gem, BookOpen, Archive, Briefcase, ChefHat } from "lucide-react";
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const LOCAL_STORAGE_KEY_FEATURE_ORDER = 'weekGlanceFeatureOrder_v3';

interface Feature {
    id: string;
    icon: React.ElementType;
    title: string;
    onClick: () => void;
}

const FeatureButton: React.FC<{
  item: Feature;
  onDragStart: (e: DragEvent<HTMLDivElement>, item: Feature) => void;
  onDragEnd: () => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: DragEvent<HTMLDivElement>, item: Feature) => void;
  isDragging: boolean;
  isDragOver: boolean;
}> = ({ item, onDragStart, onDragEnd, onDragOver, onDragEnter, isDragging, isDragOver }) => (
  <motion.div
    layout
    draggable
    onDragStart={(e) => onDragStart(e as unknown as DragEvent<HTMLDivElement>, item)}
    onDragEnd={(_: any, __: any) => onDragEnd()}
    onDragOver={onDragOver}
    onDragEnter={(e) => onDragEnter(e as unknown as DragEvent<HTMLDivElement>, item)}
    className={cn(
      "relative flex aspect-square flex-col items-center justify-center rounded-lg hover:bg-muted transition-colors cursor-grab",
      isDragging && "opacity-50 z-50",
      isDragOver && "border-2 border-primary"
    )}
  >
    <div
      className="flex flex-col items-center justify-center gap-1 text-center w-full h-full p-1"
      onClick={item.onClick}
      style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
        <item.icon className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />
      </div>
      <p className="text-xs font-medium text-center text-foreground">{item.title}</p>
    </div>
  </motion.div>
);

const translations = {
  'zh-CN': {
    techButtonText: '科技一下',
    healthButtonText: '健康一下',
    restButtonText: '休息一下',
    studyButtonText: '学习一下',
    workplaceButtonText: '职场一下',
    richButtonText: '富豪一下',
    organizeButtonText: '整理一下',
    kitchenButtonText: '厨房一下',
  },
  'en': {
    techButtonText: 'Tech Time',
    healthButtonText: 'Get Healthy',
    restButtonText: 'Take a Break',
    studyButtonText: 'Study Time',
    workplaceButtonText: 'Workplace',
    richButtonText: 'Rich Time',
    organizeButtonText: 'Get Organized',
    kitchenButtonText: 'Kitchen Time',
  }
};

export const MainFeatureGridContent: React.FC = () => {
    const router = useRouter();
    const [language, setLanguage] = useState<'zh-CN' | 'en'>('zh-CN');
    const t = translations[language];

    const [features, setFeatures] = useState<Feature[]>([]);
    const [draggedItem, setDraggedItem] = useState<Feature | null>(null);
    const [dragOverItem, setDragOverItem] = useState<Feature | null>(null);
    const [showOrganizeButton, setShowOrganizeButton] = useState(false);
    const [showRichButton, setShowRichButton] = useState(false);
    
    useEffect(() => {
        const browserLang = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
        setLanguage(browserLang);

        const handleKeyDown = (event: KeyboardEvent) => {
            const activeElement = document.activeElement;
            const isInputFocused = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement || (activeElement as HTMLElement)?.isContentEditable;

            if (!isInputFocused) {
                if (event.key === '6') setShowOrganizeButton(prev => !prev);
                else if (event.key === '7') setShowRichButton(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleNavigation = (path: string) => router.push(path);

        let initialFeatures: Feature[] = [
            { id: 'tech', icon: Cpu, title: t.techButtonText, onClick: () => handleNavigation('/tech') },
            { id: 'health', icon: HeartPulse, title: t.healthButtonText, onClick: () => handleNavigation('/health') },
            { id: 'rest', icon: PauseCircle, title: t.restButtonText, onClick: () => handleNavigation('/rest') },
            { id: 'study', icon: BookOpen, title: t.studyButtonText, onClick: () => handleNavigation('/study') },
            { id: 'workplace', icon: Briefcase, title: t.workplaceButtonText, onClick: () => handleNavigation('/workplace') },
            { id: 'kitchen', icon: ChefHat, title: t.kitchenButtonText, onClick: () => handleNavigation('/kitchen') },
        ];
        
        if (showRichButton) {
            initialFeatures.push({ id: 'rich', icon: Gem, title: t.richButtonText, onClick: () => handleNavigation('/rich') });
        }
        if (showOrganizeButton) {
            initialFeatures.push({ id: 'organize', icon: Archive, title: t.organizeButtonText, onClick: () => handleNavigation('/organize') });
        }

        try {
            const savedOrder = localStorage.getItem(LOCAL_STORAGE_KEY_FEATURE_ORDER);
            if (savedOrder) {
                const orderedIds = JSON.parse(savedOrder);
                const orderedFeatures = orderedIds.map((id: string) => initialFeatures.find(f => f.id === id)).filter(Boolean);
                const newFeatures = initialFeatures.filter(f => !orderedIds.includes(f.id));
                setFeatures([...orderedFeatures, ...newFeatures] as Feature[]);
            } else {
                setFeatures(initialFeatures);
            }
        } catch (e) {
            console.error("Failed to load feature order from localStorage", e);
            setFeatures(initialFeatures);
        }
    }, [t, showOrganizeButton, showRichButton, router]);

    const handleDragStart = (e: DragEvent<HTMLDivElement>, item: Feature) => {
        setDraggedItem(item);
    };
      
    const handleDragEnd = () => {
        if(draggedItem && dragOverItem && draggedItem.id !== dragOverItem.id) {
            const currentIndex = features.findIndex(item => item.id === draggedItem.id);
            const targetIndex = features.findIndex(item => item.id === dragOverItem.id);
    
            const newFeatures = [...features];
            newFeatures.splice(currentIndex, 1);
            newFeatures.splice(targetIndex, 0, draggedItem);
            
            setFeatures(newFeatures);
            localStorage.setItem(LOCAL_STORAGE_KEY_FEATURE_ORDER, JSON.stringify(newFeatures.map(f => f.id)));
        }
        setDraggedItem(null);
        setDragOverItem(null);
    };
      
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const handleDragEnter = (e: DragEvent<HTMLDivElement>, item: Feature) => {
        if(draggedItem && draggedItem.id !== item.id) {
            setDragOverItem(item);
        }
    }
    
    return (
      <div className="grid grid-cols-3 gap-2">
          {features.map((feature) => (
              <FeatureButton 
                  key={feature.id} 
                  item={feature}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  isDragging={draggedItem?.id === feature.id}
                  isDragOver={dragOverItem?.id === feature.id}
              />
          ))}
      </div>
    );
}
