
// src/app/day/[dayName]/page.tsx
"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ListChecks, ClipboardList, Link2, MessageSquareText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Helper function to extract time range and generate hourly slots
const generateHourlySlots = (intervalLabelWithTime: string): string[] => {
  const match = intervalLabelWithTime.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
  if (!match) {
    console.warn(`Could not parse time from: ${intervalLabelWithTime}`);
    return [];
  }

  const startTimeStr = match[1]; 
  const endTimeStr = match[2];   

  const startHour = parseInt(startTimeStr.split(':')[0]);
  let endHour = parseInt(endTimeStr.split(':')[0]);

  if (endTimeStr === "00:00" && startHour !== 0 && endHour === 0) {
      endHour = 24; 
  }
  
  const slots: string[] = [];
  if (startHour > endHour && !(endHour === 0 && startHour > 0) ) {
     if (!(startHour < 24 && endHour === 0)) {
        console.warn(`Start hour ${startHour} is not before end hour ${endHour} for ${intervalLabelWithTime}`);
        return [];
     }
  }

  for (let h = startHour; h < endHour; h++) {
    const currentSlotStart = `${String(h).padStart(2, '0')}:00`;
    const nextHour = h + 1;
    const currentSlotEnd = `${String(nextHour).padStart(2, '0')}:00`;
    slots.push(`${currentSlotStart} - ${currentSlotEnd}`);
  }
  return slots;
};


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
    noon: '中午 (12:00 - 14:00)',
    afternoon: '下午 (14:00 - 18:00)',
    evening: '晚上 (18:00 - 24:00)',
    activitiesPlaceholder: (intervalName: string) => `记录${intervalName.split(' ')[0]}的活动...`,
    addTodo: '添加待办事项',
    addMeetingNote: '添加会议记录',
    addLink: '添加分享链接',
    addReflection: '添加个人感悟',
    noItemsForHour: '此时间段暂无记录事项。',
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
    noon: 'Noon (12:00 - 14:00)',
    afternoon: 'Afternoon (14:00 - 18:00)',
    evening: 'Evening (18:00 - 24:00)',
    activitiesPlaceholder: (intervalName: string) => `Log activities for ${intervalName.split(' (')[0]}...`,
    addTodo: 'Add To-do',
    addMeetingNote: 'Add Meeting Note',
    addLink: 'Add Link',
    addReflection: 'Add Reflection',
    noItemsForHour: 'No items recorded for this hour.',
  }
};

type LanguageKey = keyof typeof translations;

export default function DayDetailPage() {
  const params = useParams();
  const dayName = typeof params.dayName === 'string' ? decodeURIComponent(params.dayName) : "无效日期";
  
  const [currentLanguage, setCurrentLanguage] = React.useState<LanguageKey>('en');

  React.useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);
  
  const t = translations[currentLanguage];

  const notes = ""; 
  const rating = ""; 

  const timeIntervals = [
    { key: 'midnight', label: t.midnight },
    { key: 'earlyMorning', label: t.earlyMorning },
    { key: 'morning', label: t.morning },
    { key: 'noon', label: t.noon },
    { key: 'afternoon', label: t.afternoon },
    { key: 'evening', label: t.evening }
  ];

  // Placeholder for actual items data structure
  // const [hourlyItems, setHourlyItems] = React.useState<Record<string, any[]>>({});

  // Placeholder functions for adding items
  // const handleAddItem = (hourSlot: string, itemType: string) => {
  //   console.log(`Add ${itemType} to ${hourSlot} for ${dayName}`);
  //   // Here you would update state to add the item
  // };

  return (
    <TooltipProvider>
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
            <div className="grid grid-cols-1 gap-6">
              {timeIntervals.map(interval => {
                const hourlySlots = generateHourlySlots(interval.label);
                const mainTitle = interval.label.split(' (')[0];
                const timeRangeSubtext = interval.label.includes('(') ? `(${interval.label.split(' (')[1]}` : '';

                return (
                  <div key={interval.key} className="bg-card p-4 rounded-lg shadow-lg">
                    <h3 className="text-lg font-medium text-foreground mb-1">{mainTitle}</h3>
                    {timeRangeSubtext && <p className="text-xs text-muted-foreground mb-2">{timeRangeSubtext}</p>}
                    <div className="h-1 w-full bg-primary/30 rounded-full mb-3"></div>
                    
                    {hourlySlots.length > 0 ? (
                      <div className="space-y-3 mt-4">
                        {hourlySlots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="p-3 border rounded-md bg-muted/20 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm font-semibold text-foreground/90">{slot}</p>
                              <div className="flex space-x-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                                      <ListChecks className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{t.addTodo}</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                                      <ClipboardList className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{t.addMeetingNote}</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                                      <Link2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{t.addLink}</p>
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                                      <MessageSquareText className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{t.addReflection}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <div className="p-2 border rounded-md min-h-[60px] bg-background/50">
                              <p className="text-xs text-muted-foreground italic">{t.noItemsForHour}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 border rounded-md min-h-[80px] bg-background/50 mt-4">
                        <p className="text-sm text-muted-foreground italic">{t.activitiesPlaceholder(interval.label)}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
