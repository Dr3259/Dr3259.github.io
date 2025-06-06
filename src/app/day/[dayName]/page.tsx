
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
    timeIntervalsTitle: '每日安排',
    midnight: '凌晨 (00:00 - 05:00)',
    earlyMorning: '清晨 (05:00 - 09:00)',
    morning: '上午 (09:00 - 12:00)',
    afternoon: '下午 (12:00 - 18:00)',
    evening: '晚上 (18:00 - 24:00)',
    activitiesPlaceholder: (intervalName: string) => `记录${intervalName.split(' ')[0]}的活动...`
  },
  'en': {
    dayDetailsTitle: (dayName: string) => `${dayName} - Details`,
    backToWeek: 'Back to Week View',
    notesLabel: 'Notes:',
    ratingLabel: 'Rating:',
    noData: 'No data available',
    timeIntervalsTitle: 'Daily Schedule',
    midnight: 'Midnight (00:00 - 05:00)',
    earlyMorning: 'Early Morning (05:00 - 09:00)',
    morning: 'Morning (09:00 - 12:00)',
    afternoon: 'Afternoon (12:00 - 18:00)',
    evening: 'Evening (18:00 - 24:00)',
    activitiesPlaceholder: (intervalName: string) => `Log activities for ${intervalName.split(' (')[0]}...`
  }
};

type LanguageKey = keyof typeof translations;

export default function DayDetailPage() {
  const params = useParams();
  const dayName = typeof params.dayName === 'string' ? decodeURIComponent(params.dayName) : "无效日期";
  
  const currentLanguage: LanguageKey = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
  const t = translations[currentLanguage];

  const notes = ""; 
  const rating = ""; 

  const timeIntervals = [
    { key: 'midnight', label: t.midnight },
    { key: 'earlyMorning', label: t.earlyMorning },
    { key: 'morning', label: t.morning },
    { key: 'afternoon', label: t.afternoon },
    { key: 'evening', label: t.evening }
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-8">
      <header className="w-full max-w-4xl mb-8">
        <Link href="/" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backToWeek}
          </Button>
        </Link>
      </header>

      <main className="w-full max-w-4xl">
        <h1 className="text-3xl font-headline font-semibold text-primary mb-6">
          {t.dayDetailsTitle(dayName)}
        </h1>
        
        <div className="bg-card p-6 rounded-lg shadow-lg mb-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-medium text-foreground mb-2">{t.notesLabel}</h2>
              <div className="p-3 border rounded-md min-h-[100px] bg-background/50">
                <p className="text-muted-foreground">{notes || t.noData}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-medium text-foreground mb-2">{t.ratingLabel}</h2>
              <div className="p-3 border rounded-md bg-background/50">
                 <p className="text-muted-foreground">{rating || t.noData}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-primary mb-4">{t.timeIntervalsTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {timeIntervals.map(interval => (
              <div key={interval.key} className="bg-card p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-medium text-foreground mb-1">{interval.label.split(' (')[0]}</h3>
                <p className="text-xs text-muted-foreground mb-2">{interval.label.includes('(') ? `(${interval.label.split(' (')[1]}` : ''}</p>
                <div className="h-1 w-full bg-primary/30 rounded-full mb-3"></div>
                <div className="p-3 border rounded-md min-h-[80px] bg-background/50">
                  <p className="text-sm text-muted-foreground italic">{t.activitiesPlaceholder(interval.label)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
