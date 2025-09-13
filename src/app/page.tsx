
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DayHoverPreview } from '@/components/DayHoverPreview';
import { useAuth } from '@/context/AuthContext';
import { format, addDays, startOfWeek, isSameWeek, isAfter, parseISO, isSameDay, subDays, isBefore } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { ClipboardModal } from '@/components/ClipboardModal';
import { QuickAddTodoModal } from '@/components/QuickAddTodoModal';
import copy from 'copy-to-clipboard';
import { MainHeader } from '@/components/page/MainHeader';
import { WeekNavigator } from '@/components/page/WeekNavigator';
import { FeatureGrid } from '@/components/page/FeatureGrid';
import { PageFooter } from '@/components/page/PageFooter';
import type { RatingType, ShareLinkItem, ReceivedShareData, HoverPreviewData, LanguageKey, Theme } from '@/lib/page-types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BarChart } from 'lucide-react';
import { usePlannerStore } from '@/hooks/usePlannerStore';
import { translations } from '@/lib/translations';
import { DayBox } from '@/components/DayBox';
import { SyncDebugger } from '@/components/SyncDebugger';


const LOCAL_STORAGE_KEY_THEME = 'weekGlanceTheme';
const LOCAL_STORAGE_KEY_SHARE_TARGET = 'weekGlanceShareTarget_v1';

const SHOW_PREVIEW_DELAY = 2000;
const HIDE_PREVIEW_DELAY = 200;
const URL_REGEX = /(https?:\/\/[^\s$.?#].[^\s]*)/i;

const getDateKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

const dayHasContent = (date: Date, data: ReturnType<typeof usePlannerStore.getState>): boolean => {
    const dateKey = getDateKey(date);
    if (data.allDailyNotes[dateKey]?.trim()) return true;
    if (data.allRatings[dateKey]) return true;
    const checkSlotItems = (items: Record<string, any[]> | undefined) => items && Object.values(items).some(slotItems => slotItems.length > 0);
    if (checkSlotItems(data.allTodos[dateKey])) return true;
    if (checkSlotItems(data.allMeetingNotes[dateKey])) return true;
    if (checkSlotItems(data.allShareLinks[dateKey])) return true;
    if (checkSlotItems(data.allReflections[dateKey])) return true;
    return false;
};

export default function WeekGlancePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const plannerState = usePlannerStore();
  const { setRating, addShareLink, addTodo: addTodoToStore, lastTodoMigrationDate, addUnfinishedTodosToToday } = plannerState;

  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en'); 
  const [theme, setTheme] = useState<Theme>('light'); 
  const [systemToday, setSystemToday] = useState<Date | null>(null);
  const [displayedDate, setDisplayedDate] = useState<Date | null>(null); 
  const [isAfter6PMToday, setIsAfter6PMToday] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);
  
  const [hoverPreviewData, setHoverPreviewData] = useState<HoverPreviewData | null>(null);
  const [isClipboardModalOpen, setIsClipboardModalOpen] = useState(false);
  const [clipboardContent, setClipboardContent] = useState('');
  const [lastProcessedClipboardText, setLastProcessedClipboardText] = useState('');
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [isLoginPromptDismissed, setIsLoginPromptDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('loginPromptDismissed') === 'true';
    }
    return false;
  });
  
  const [showDebugger, setShowDebugger] = useState(false);
  const debugKeySequence = useRef<string[]>([]);


  const showPreviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hidePreviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPreviewSuppressedByClickRef = useRef(false);

  const t = translations[currentLanguage];
  const dateLocale = currentLanguage === 'zh-CN' ? zhCN : enUS;

  const eventfulDays = useMemo(() => {
    const allDataKeys = new Set([
        ...Object.keys(plannerState.allRatings), ...Object.keys(plannerState.allDailyNotes), ...Object.keys(plannerState.allTodos),
        ...Object.keys(plannerState.allMeetingNotes), ...Object.keys(plannerState.allShareLinks), ...Object.keys(plannerState.allReflections),
    ]);
    return Array.from(allDataKeys).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/)).sort();
  }, [plannerState]);

  const isUrlAlreadySaved = useCallback((url: string): boolean => {
    if (!url) return false;
    for (const dateKey in plannerState.allShareLinks) {
      for (const hourSlot in plannerState.allShareLinks[dateKey]) {
        if (plannerState.allShareLinks[dateKey][hourSlot].some(item => item.url === url)) {
          return true;
        }
      }
    }
    return false;
  }, [plannerState.allShareLinks]);

  const saveUrlToCurrentTimeSlot = useCallback((item: { title: string; url: string; category: string | null }): { success: boolean; slotName: string } => {
    const newLink: ShareLinkItem = { id: Date.now().toString(), url: item.url, title: item.title, category: item.category };
    const now = new Date(), currentHour = now.getHours(), currentDateKey = getDateKey(now);
    const timeIntervals = t.timeIntervals;
    let targetIntervalName: keyof typeof timeIntervals = 'evening';
    if (currentHour < 5) targetIntervalName = 'midnight';
    else if (currentHour < 9) targetIntervalName = 'earlyMorning';
    else if (currentHour < 12) targetIntervalName = 'morning';
    else if (currentHour < 14) targetIntervalName = 'noon';
    else if (currentHour < 18) targetIntervalName = 'afternoon';
    const hourlySlots = generateHourlySlots(targetIntervalName, t);
    if (hourlySlots.length === 0) return { success: false, slotName: '' };
    const targetSlot = hourlySlots.find(slot => {
        const match = slot.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        if (match) { const startH = parseInt(match[1]), endH = parseInt(match[2] === '00:00' ? '24' : match[2].split(':')[0]); return currentHour >= startH && currentHour < endH; }
        return false;
    }) || hourlySlots[0];
    addShareLink(currentDateKey, targetSlot, newLink);
    return { success: true, slotName: t.timeIntervals[targetIntervalName as keyof typeof t.timeIntervals] };
  }, [t.timeIntervals, addShareLink]);

  const generateHourlySlots = (intervalName: keyof typeof t.timeIntervals, translationsObj: any): string[] => {
    const intervalLabels = {
        midnight: '(00:00 - 05:00)', earlyMorning: '(05:00 - 09:00)', morning: '(09:00 - 12:00)',
        noon: '(12:00 - 14:00)', afternoon: '(14:00 - 18:00)', evening: '(18:00 - 24:00)',
    };
    const label = intervalLabels[intervalName];
    const match = label.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
    if (!match) return [];
    const [, startTimeStr, endTimeStr] = match;
    const startHour = parseInt(startTimeStr, 10);
    let endHour = parseInt(endTimeStr.split(':')[0], 10);
    if (endTimeStr === '00:00' && startHour !== 0) endHour = 24;
    const slots: string[] = [];
    for (let h = startHour; h < endHour; h++) {
        slots.push(`${String(h).padStart(2, '0')}:00 - ${String(h + 1).padStart(2, '0')}:00`);
    }
    return slots;
  };

  const handleSaveShareLinkFromPWA = useCallback((shareData: ReceivedShareData) => {
    if (!shareData) return;
    const { text, url } = shareData;
    const linkUrl = url || text;
    if (!linkUrl.match(URL_REGEX)) return;
    
    const { success, slotName } = saveUrlToCurrentTimeSlot({ title: text || url, url: linkUrl, category: null });
    if(success) toast({ title: t.shareTarget.linkSavedToastTitle, description: t.shareTarget.linkSavedToastDescription(slotName), duration: 3000 });
  }, [toast, t.shareTarget, saveUrlToCurrentTimeSlot]);

  const checkClipboard = useCallback(async () => {
    if (document.hidden) return;
    try {
        if (typeof navigator?.permissions?.query !== 'function') return;
        const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
        if (permission.state === 'denied') return;
        
        const text = await navigator.clipboard.readText();
        if (!text || text.trim() === '') return;
        const urlMatches = text.match(URL_REGEX);
        if (!urlMatches) return;
        if (text === lastProcessedClipboardText) return; 
        if (isUrlAlreadySaved(urlMatches[0])) {
            setLastProcessedClipboardText(text); 
            return; 
        }
        setClipboardContent(text);
        setIsClipboardModalOpen(true);
    } catch (err: any) {}
  }, [lastProcessedClipboardText, isUrlAlreadySaved]);

  const onDaySelect = useCallback((dayNameForUrl: string, dateForDetail: Date) => {
    if (showPreviewTimerRef.current) clearTimeout(showPreviewTimerRef.current);
    if (hidePreviewTimerRef.current) clearTimeout(hidePreviewTimerRef.current);
    setHoverPreviewData(null);
    isPreviewSuppressedByClickRef.current = true;
    router.push(`/day/${encodeURIComponent(dayNameForUrl)}?date=${getDateKey(dateForDetail)}&eventfulDays=${eventfulDays.join(',')}`);
  }, [router, eventfulDays]);

  useEffect(() => {
    setIsClientMounted(true);
    const today = new Date();
    setSystemToday(today);
    setDisplayedDate(today);
    setIsAfter6PMToday(isAfter(today, new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0)));

    const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    setCurrentLanguage(browserLang);
    document.documentElement.lang = browserLang;
    
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEY_THEME) as Theme | null;
    const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    setTheme(storedTheme || (systemPrefersDark ? 'dark' : 'light'));
    
    const sharedDataString = localStorage.getItem(LOCAL_STORAGE_KEY_SHARE_TARGET);
    if (sharedDataString) {
      try {
        handleSaveShareLinkFromPWA(JSON.parse(sharedDataString));
        localStorage.removeItem(LOCAL_STORAGE_KEY_SHARE_TARGET);
      } catch (e) {
          localStorage.removeItem(LOCAL_STORAGE_KEY_SHARE_TARGET);
      }
    }
    
    const todayStr = format(today, 'yyyy-MM-dd');
    if(lastTodoMigrationDate !== todayStr) {
        const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
        const migratedCount = addUnfinishedTodosToToday(todayStr, yesterdayStr);
        if (migratedCount > 0) {
            const toastMessage = currentLanguage === 'zh-CN' 
                ? `已将昨天 ${migratedCount} 个未完成事项同步到今天。`
                : `Moved ${migratedCount} unfinished to-dos from yesterday to today.`;
            toast({ title: toastMessage });
        }
    }
  }, [handleSaveShareLinkFromPWA, toast, lastTodoMigrationDate, addUnfinishedTodosToToday, currentLanguage]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (isQuickAddModalOpen) return;
        const activeElement = document.activeElement;
        const isInputFocused = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement || (activeElement as HTMLElement)?.isContentEditable;
        
        // Debugger sequence
        if (event.key.toLowerCase() === 'd') {
          debugKeySequence.current.push('d');
          if (debugKeySequence.current.length > 3) {
            debugKeySequence.current.shift();
          }
          if (debugKeySequence.current.join('') === 'ddd') {
            setShowDebugger(prev => !prev);
            debugKeySequence.current = [];
          }
        } else {
          debugKeySequence.current = [];
        }

        if (!isInputFocused && event.key === 'Enter') {
            event.preventDefault();
            setIsQuickAddModalOpen(true);
        }
    };
    window.addEventListener('focus', checkClipboard);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('focus', checkClipboard);
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [checkClipboard, isQuickAddModalOpen]);

  const handleSaveFromClipboard = (data: { category: string }) => {
    if (!clipboardContent) return;
    const urlMatches = clipboardContent.match(URL_REGEX);
    const url = urlMatches ? urlMatches[0] : '';
    if (url && isUrlAlreadySaved(url)) {
        toast({ title: t.clipboard.linkAlreadyExists, variant: "default", duration: 3000 });
        setLastProcessedClipboardText(clipboardContent);
        setIsClipboardModalOpen(false);
        return;
    }
    const title = url ? clipboardContent.replace(url, '').trim() : clipboardContent;
    const { success, slotName } = saveUrlToCurrentTimeSlot({ title: title || url, url: url, category: data.category || null });
    if (success) {
      toast({ title: t.clipboard.linkSavedToastTitle, description: t.clipboard.linkSavedToastDescription(slotName), duration: 3000 });
      try { copy(''); } catch (error) {}
    }
    setLastProcessedClipboardText(clipboardContent);
    setIsClipboardModalOpen(false);
  };
  
  const handleCloseClipboardModal = () => {
    setLastProcessedClipboardText(clipboardContent);
    setIsClipboardModalOpen(false);
  };

  const handleSaveQuickAddTodo = ({ text, date, completed }: { text: string; date: Date; completed: boolean; }) => {
    const dateKey = getDateKey(date);
    let slotKey = 'all-day';
    if (isSameDay(date, new Date())) {
        const now = new Date(), currentHour = now.getHours();
        slotKey = `${String(currentHour).padStart(2, '0')}:00 - ${String(currentHour + 1).padStart(2, '0')}:00`;
    }
    addTodoToStore(dateKey, slotKey, { text, completed, category: null, deadline: null, importance: null });
    toast({ title: t.quickAddTodo.successToast, duration: 3000 });
    setIsQuickAddModalOpen(false);
  };

  useEffect(() => {
    if (isClientMounted) {
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.setItem(LOCAL_STORAGE_KEY_THEME, theme);
    }
  }, [theme, isClientMounted]);

  const daysToDisplay = useMemo(() => {
    if (!displayedDate) return [];
    return Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek(displayedDate, { weekStartsOn: 1, locale: dateLocale }), i));
  }, [displayedDate, dateLocale]);

  if (!isClientMounted || !systemToday || !displayedDate) {
    return <main className="flex flex-col items-center min-h-screen bg-background text-foreground py-10 sm:py-16 px-4" />;
  }

  return (
    <>
      <main className="flex flex-col items-center min-h-screen bg-background text-foreground py-10 sm:py-16 px-4">
        <div className="w-full max-w-4xl">
           <MainHeader translations={t} currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} theme={theme} onThemeChange={setTheme} />
           {!user && !isLoginPromptDismissed && (
             <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg relative">
               <button
                 onClick={() => {
                   setIsLoginPromptDismissed(true);
                   localStorage.setItem('loginPromptDismissed', 'true');
                 }}
                 className="absolute top-2 right-2 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
                 aria-label={currentLanguage === 'zh-CN' ? '关闭提示' : 'Dismiss'}
               >
                 ×
               </button>
               <p className="text-sm text-amber-800 dark:text-amber-200 pr-6">
                 {currentLanguage === 'zh-CN' 
                   ? '💾 当前使用本地模式，数据仅保存在此设备。登录后可云端同步数据。' 
                   : '💾 Currently in local mode. Data is saved on this device only. Sign in to sync data to the cloud.'
                 }
               </p>
             </div>
           )}
        </div>
        <WeekNavigator translations={t} dateLocale={dateLocale} displayedDate={displayedDate} setDisplayedDate={setDisplayedDate} systemToday={systemToday} eventfulDays={eventfulDays} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full max-w-4xl mb-12 sm:mb-16 justify-items-center">
             {daysToDisplay.map((dateInWeek) => {
                const dayNameForDisplay = format(dateInWeek, 'EEEE', { locale: dateLocale });
                const dateKeyForStorage = getDateKey(dateInWeek);
                return (
                    <DayBox key={dateKeyForStorage} dayName={dayNameForDisplay}
                        onClick={() => onDaySelect(dayNameForDisplay, dateInWeek)}
                        notes={plannerState.allDailyNotes[dateKeyForStorage] || ''} 
                        dayHasAnyData={dayHasContent(dateInWeek, plannerState)}
                        rating={plannerState.allRatings[dateKeyForStorage] || null}
                        onRatingChange={(newRating) => setRating(dateKeyForStorage, newRating as RatingType)}
                        isCurrentDay={isSameDay(dateInWeek, systemToday)}
                        isPastDay={isBefore(dateInWeek, systemToday) && !isSameDay(dateInWeek, systemToday)}
                        isFutureDay={isAfter(dateInWeek, systemToday) && !isSameDay(dateInWeek, systemToday)}
                        isAfter6PMToday={isAfter6PMToday} 
                        todayLabel={t.todayPrefix}
                        selectDayLabel={t.selectDayAria(dayNameForDisplay)}
                        contentIndicatorLabel={t.hasNotesAria}
                        ratingUiLabels={t.ratingLabels}
                        onHoverStart={(data) => { if (!isPreviewSuppressedByClickRef.current) showPreviewTimerRef.current = setTimeout(() => setHoverPreviewData({ ...data, altText: t.thumbnailPreviewAlt(data.dayName) }), SHOW_PREVIEW_DELAY); }}
                        onHoverEnd={() => { isPreviewSuppressedByClickRef.current = false; if (showPreviewTimerRef.current) clearTimeout(showPreviewTimerRef.current); hidePreviewTimerRef.current = setTimeout(() => setHoverPreviewData(null), HIDE_PREVIEW_DELAY); }}
                        imageHint="activity memory"
                    />
                );
            })}
             <Card
                className="w-full h-44 sm:w-40 sm:h-48 flex flex-col rounded-xl border-2 transition-all duration-200 ease-in-out cursor-pointer bg-card border-transparent hover:border-accent/70 hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => router.push(`/weekly-summary?weekStart=${getDateKey(daysToDisplay[0])}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') router.push(`/weekly-summary?weekStart=${getDateKey(daysToDisplay[0])}`);}}
                aria-label={t.weeklySummaryPlaceholder}
            >
                <CardHeader className="p-2 pb-1 text-center">
                    <CardTitle className="text-lg sm:text-xl font-medium text-foreground">
                        {t.weeklySummaryTitle}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-2 flex-grow flex items-center justify-center">
                    <BarChart className="w-10 h-10 text-primary" />
                </CardContent>
            </Card>
        </div>
        {hoverPreviewData && (<DayHoverPreview {...hoverPreviewData} onMouseEnterPreview={() => { if (showPreviewTimerRef.current) clearTimeout(showPreviewTimerRef.current); if (hidePreviewTimerRef.current) clearTimeout(hidePreviewTimerRef.current); }} onMouseLeavePreview={() => { hidePreviewTimerRef.current = setTimeout(() => setHoverPreviewData(null), HIDE_PREVIEW_DELAY); }} onClickPreview={() => { if (showPreviewTimerRef.current) clearTimeout(showPreviewTimerRef.current); if (hidePreviewTimerRef.current) clearTimeout(hidePreviewTimerRef.current); setHoverPreviewData(null); isPreviewSuppressedByClickRef.current = true; }} />)}

        
        <FeatureGrid />
        
        {showDebugger && <SyncDebugger />}

        <PageFooter translations={t} currentYear={systemToday.getFullYear()} />
      </main>
      <ClipboardModal isOpen={isClipboardModalOpen} onClose={handleCloseClipboardModal} onSave={handleSaveFromClipboard} content={clipboardContent} translations={t.clipboard} />
      <QuickAddTodoModal isOpen={isQuickAddModalOpen} onClose={() => setIsQuickAddModalOpen(false)} onSave={handleSaveQuickAddTodo} weekDays={daysToDisplay.filter(day => isSameDay(day, systemToday) || isAfter(day, systemToday))} translations={t.quickAddTodo} dateLocale={dateLocale} />
    </>
  );
}
