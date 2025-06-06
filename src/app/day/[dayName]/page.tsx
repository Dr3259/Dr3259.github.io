// src/app/day/[dayName]/page.tsx
"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Basic translations (can be expanded)
const translations = {
  'zh-CN': {
    dayDetailsTitle: (dayName: string) => `${dayName} - 详情`,
    backToWeek: '返回周视图',
    notesLabel: '笔记:',
    ratingLabel: '评价:',
    noData: '暂无数据',
  },
  'en': {
    dayDetailsTitle: (dayName: string) => `${dayName} - Details`,
    backToWeek: 'Back to Week View',
    notesLabel: 'Notes:',
    ratingLabel: 'Rating:',
    noData: 'No data available',
  }
};

type LanguageKey = keyof typeof translations;

export default function DayDetailPage() {
  const params = useParams();
  const dayName = typeof params.dayName === 'string' ? decodeURIComponent(params.dayName) : "无效日期";
  
  // For simplicity, using a fixed language. In a real app, this would come from context or props.
  const currentLanguage: LanguageKey = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
  const t = translations[currentLanguage];

  // Placeholder for fetching/displaying notes and rating for `dayName`
  // In a real app, you'd fetch this from localStorage, a state manager, or an API.
  const notes = ""; // Example: localStorage.getItem(`note_${dayName}`) || t.noData;
  const rating = ""; // Example: localStorage.getItem(`rating_${dayName}`) || t.noData;

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-8">
      <header className="w-full max-w-2xl mb-8">
        <Link href="/" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToWeek}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-2xl bg-card p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-headline font-semibold text-primary mb-6">
          {t.dayDetailsTitle(dayName)}
        </h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-medium text-foreground mb-2">{t.notesLabel}</h2>
            {/* Placeholder for notes display and editing area */}
            <div className="p-3 border rounded-md min-h-[100px] bg-background/50">
              <p className="text-muted-foreground">{notes || t.noData}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-medium text-foreground mb-2">{t.ratingLabel}</h2>
            {/* Placeholder for rating display */}
            <div className="p-3 border rounded-md bg-background/50">
               <p className="text-muted-foreground">{rating || t.noData}</p>
            </div>
          </div>
          {/* Add more editing UI elements here as needed */}
        </div>
      </main>
    </div>
  );
}
