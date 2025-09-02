
"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DayBox } from '@/components/DayBox';
import { DayHoverPreview } from '@/components/DayHoverPreview';
import { format, addDays, startOfWeek, subWeeks, isSameWeek, isAfter, parseISO, isSameDay, subDays } from 'date-fns';
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
import { GameCard } from '@/components/GameCard';
import { BarChart } from 'lucide-react';
import Link from 'next/link';
import { usePlannerStore } from '@/hooks/usePlannerStore';

const LOCAL_STORAGE_KEY_THEME = 'weekGlanceTheme';
const LOCAL_STORAGE_KEY_SHARE_TARGET = 'weekGlanceShareTarget_v1';

const SHOW_PREVIEW_DELAY = 2000;
const HIDE_PREVIEW_DELAY = 200;
const URL_REGEX = /(https?:\/\/[^\s$.?#].[^\s]*)/i;

const translations = {
  'zh-CN': {
    pageTitle: '周览',
    pageSubtitle: '规划你的一周，回顾你的每一天。',
    settingsMenuTitle: '设置',
    languageButtonText: '切换语言',
    themeButtonText: '切换主题',
    previousWeek: '上一周',
    nextWeek: '下一周',
    backToCurrentWeek: '回到本周',
    jumpToWeek: '跳转到周',
    yearMonthFormat: 'yyyy年 MMMM',
    weekLabelFormat: (week: number) => `第 ${week} 周`,
    todayPrefix: '今天',
    selectDayAria: (day: string) => `选择 ${day}`,
    hasNotesAria: '有内容记录',
    ratingLabels: {
      excellent: '好极了',
      average: '一般般',
      terrible: '糟透了'
    },
    thumbnailPreviewAlt: (dayName: string) => `${dayName} 的缩略图预览`,
    techButtonText: '科技一下',
    healthButtonText: '健康一下',
    restButtonText: '休息一下',
    studyButtonText: '学习一下',
    workplaceButtonText: '职场一下',
    richButtonText: '富豪一下',
    organizeButtonText: '整理一下',
    copyrightText: (year: number, title: string) => `© ${year} ${title}. `,
    mitLicenseLinkText: 'MIT 许可',
    githubAria: '查看 GitHub 仓库',
    wechatAria: '扫码关注微信公众号',
    emailAria: '发送邮件反馈',
    donateAria: '给我买杯咖啡',
    shareTarget: {
      linkSavedToastTitle: '链接已保存',
      linkSavedToastDescription: (slotName: string) => `链接已添加到今天的“${slotName}”时段。`
    },
    clipboard: {
      modalTitle: '发现剪贴板中的链接',
      modalDescription: '您想将这个链接保存到今天的计划中吗？',
      saveButton: '保存链接',
      cancelButton: '忽略',
      categoryLabel: '添加一个分类（可选）',
      categoryPlaceholder: '例如：阅读、购物',
      linkSavedToastTitle: '链接已保存',
      linkSavedToastDescription: (slotName: string) => `链接已添加到今天的“${slotName}”时段。`,
      linkAlreadyExists: '该链接已存在于您的记录中。'
    },
    quickAddTodo: {
      modalTitle: '快速添加待办',
      modalDescription: '快速记录您的想法和任务。',
      todoPlaceholder: '例如：下午三点去拿快递',
      dateLabel: '选择日期',
      completedLabel: '已完成',
      saveButton: '保存',
      cancelButton: '取消',
      pasteFromClipboard: '从剪贴板粘贴',
      successToast: '待办事项已添加！'
    },
    timeIntervals: {
        midnight: "凌晨",
        earlyMorning: "清晨",
        morning: "上午",
        noon: "中午",
        afternoon: "下午",
        evening: "晚上",
    },
    weeklySummaryTitle: "本周总结",
    weeklySummaryPlaceholder: "查看本周总结报告",
  },
  'en': {
    pageTitle: 'Week Glance',
    pageSubtitle: 'Plan your week, reflect on your days.',
    settingsMenuTitle: 'Settings',
    languageButtonText: 'Switch Language',
    themeButtonText: 'Switch Theme',
    previousWeek: 'Previous Week',
    nextWeek: 'Next Week',
    backToCurrentWeek: 'Back to Current Week',
    jumpToWeek: 'Jump to Week',
    yearMonthFormat: 'MMMM yyyy',
    weekLabelFormat: (week: number) => `Week ${week}`,
    todayPrefix: 'Today',
    selectDayAria: (day: string) => `Select ${day}`,
    hasNotesAria: 'Has content',
    ratingLabels: {
      excellent: 'Excellent',
      average: 'Average',
      terrible: 'Terrible'
    },
    thumbnailPreviewAlt: (dayName: string) => `Thumbnail preview for ${dayName}`,
    techButtonText: 'Tech Time',
    healthButtonText: 'Get Healthy',
    restButtonText: 'Take a Break',
    studyButtonText: 'Study Time',
    workplaceButtonText: 'Workplace',
    richButtonText: 'Rich Time',
    organizeButtonText: 'Get Organized',
    copyrightText: (year: number, title: string) => `© ${year} ${title}. `,
    mitLicenseLinkText: 'MIT Licensed',
    githubAria: 'View on GitHub',
    wechatAria: 'Follow on WeChat',
    emailAria: 'Send Feedback Email',
    donateAria: 'Buy me a coffee',
    shareTarget: {
      linkSavedToastTitle: 'Link Saved',
      linkSavedToastDescription: (slotName: string) => `Link added to today's "${slotName}" period.`
    },
    clipboard: {
      modalTitle: 'Link Found in Clipboard',
      modalDescription: 'Would you like to save this link to today\'s plan?',
      saveButton: 'Save Link',
      cancelButton: 'Ignore',
      categoryLabel: 'Add a category (optional)',
      categoryPlaceholder: 'e.g. Reading, Shopping',
      linkSavedToastTitle: 'Link Saved',
      linkSavedToastDescription: (slotName: string) => `Link added to today's "${slotName}" period.`,
      linkAlreadyExists: 'This link already exists in your records.'
    },
    quickAddTodo: {
      modalTitle: 'Quick Add To-do',
      modalDescription: 'Quickly jot down your ideas and tasks.',
      todoPlaceholder: 'e.g., Pick up package at 3 PM',
      dateLabel: 'Select Date',
      completedLabel: 'Completed',
      saveButton: 'Save',
      cancelButton: 'Cancel',
      pasteFromClipboard: 'Paste from clipboard',
      successToast: 'To-do item added!'
    },
    timeIntervals: {
        midnight: "Midnight",
        earlyMorning: "Early Morning",
        morning: "Morning",
        noon: "Noon",
        afternoon: "Afternoon",
        evening: "Evening",
    },
    weeklySummaryTitle: "Weekly Summary",
    weeklySummaryPlaceholder: "View weekly summary report",
  }
};


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
  
  // Zustand store selectors
  const {
    allRatings, allDailyNotes, allTodos, allMeetingNotes, allShareLinks, allReflections,
    setRating, addShareLink, addTodo: addTodoToStore,
  } = usePlannerStore(state => ({
    allRatings: state.allRatings,
    allDailyNotes: state.allDailyNotes,
    allTodos: state.allTodos,
    allMeetingNotes: state.allMeetingNotes,
    allShareLinks: state.allShareLinks,
    allReflections: state.allReflections,
    setRating: state.setRating,
    addShareLink: state.addShareLink,
    addTodo: state.addTodo,
  }));
  const lastTodoMigrationDate = usePlannerStore(state => state.lastTodoMigrationDate);
  const addUnfinishedTodosToToday = usePlannerStore(state => state.addUnfinishedTodosToToday);

  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN'); 
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

  const showPreviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hidePreviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPreviewSuppressedByClickRef = useRef(false);

  const t = translations[currentLanguage];
  const dateLocale = currentLanguage === 'zh-CN' ? zhCN : enUS;
  
  const allPlannerData = usePlannerStore.getState();

  const isUrlAlreadySaved = useCallback((url: string): boolean => {
    if (!url) return false;
    for (const dateKey in allShareLinks) {
        for (const hourSlot in allShareLinks[dateKey]) {
            if (allShareLinks[dateKey][hourSlot].some(item => item.url === url)) {
                return true;
            }
        }
    }
    return false;
  }, [allShareLinks]);

  const saveUrlToCurrentTimeSlot = useCallback((item: { title: string; url: string; category: string | null }): { success: boolean; slotName: string } => {
    const newLink: ShareLinkItem = {
      id: Date.now().toString(),
      url: item.url,
      title: item.title,
      category: item.category,
    };

    const now = new Date();
    const currentHour = now.getHours();
    const currentDateKey = getDateKey(now);

    const timeIntervals = t.timeIntervals;
    let targetIntervalName = 'evening';
    if (currentHour < 5) targetIntervalName = 'midnight';
    else if (currentHour < 9) targetIntervalName = 'earlyMorning';
    else if (currentHour < 12) targetIntervalName = 'morning';
    else if (currentHour < 14) targetIntervalName = 'noon';
    else if (currentHour < 18) targetIntervalName = 'afternoon';
    
    const intervalLabels: Record<string, string> = {
        midnight: '(00:00 - 05:00)', earlyMorning: '(05:00 - 09:00)', morning: '(09:00 - 12:00)',
        noon: '(12:00 - 14:00)', afternoon: '(14:00 - 18:00)', evening: '(18:00 - 24:00)',
    };
    
    const targetIntervalLabel = intervalLabels[targetIntervalName];
    const hourlySlots = (() => {
        const match = targetIntervalLabel.match(/\((\d{2}):\d{2}\s*-\s*(\d{2}:\d{2})\)/);
        if (!match) return [];
        const [, startTimeStr, endTimeStr] = match;
        const startHour = parseInt(startTimeStr.split(':')[0]);
        let endHour = parseInt(endTimeStr.split(':')[0]);
        if (endTimeStr === "00:00" && startHour !== 0) endHour = 24;
        const slots: string[] = [];
        for (let h = startHour; h < endHour; h++) {
            slots.push(`${String(h).padStart(2, '0')}:00 - ${String(h + 1).padStart(2, '0')}:00`);
        }
        return slots;
    })();

    if (hourlySlots.length === 0) return { success: false, slotName: '' };
    
    const targetSlot = hourlySlots.find(slot => {
        const match = slot.match(/(\d{2}):\d{2}\s*-\s*(\d{2}):\d{2}/);
        if (match) {
            const startH = parseInt(match[1]), endH = parseInt(match[2]);
            return currentHour >= startH && currentHour < (endH || 24);
        }
        return false;
    }) || hourlySlots[0];
    
    addShareLink(currentDateKey, targetSlot, newLink);
    return { success: true, slotName: t.timeIntervals[targetIntervalName as keyof typeof t.timeIntervals] };
  }, [t.timeIntervals, addShareLink]);

  const handleSaveShareLinkFromPWA = useCallback((shareData: ReceivedShareData) => {
    if (!shareData) return;
    const { text, url } = shareData;
    const linkUrl = url || text;
    if (!linkUrl.match(URL_REGEX)) return;
    
    const { success, slotName } = saveUrlToCurrentTimeSlot({ title: text || url, url: linkUrl, category: null });
    if(success) {
        toast({ title: t.shareTarget.linkSavedToastTitle, description: t.shareTarget.linkSavedToastDescription(slotName), duration: 3000 });
    }
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
    } catch (err: any) {
        // Silently fail
    }
  }, [lastProcessedClipboardText, isUrlAlreadySaved]);

  const eventfulDays = useMemo(() => {
    const allDataKeys = new Set([
        ...Object.keys(allRatings), ...Object.keys(allDailyNotes), ...Object.keys(allTodos),
        ...Object.keys(allMeetingNotes), ...Object.keys(allShareLinks), ...Object.keys(allReflections),
    ]);
    return Array.from(allDataKeys).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/)).sort();
  }, [allRatings, allDailyNotes, allTodos, allMeetingNotes, allShareLinks, allReflections]);

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
    
    // Migrate todos
    const todayStr = format(today, 'yyyy-MM-dd');
    if(lastTodoMigrationDate !== todayStr) {
        const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
        const migratedCount = addUnfinishedTodosToToday(todayStr, yesterdayStr);
        if (migratedCount > 0) {
            toast({ title: `已将昨天 ${migratedCount} 个未完成事项同步到今天` });
        }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (isQuickAddModalOpen) return;
        const activeElement = document.activeElement;
        const isInputFocused = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement || (activeElement as HTMLElement)?.isContentEditable;
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
        const timeIntervals: Record<string, string> = { /* ... */ }; // simplified
        slotKey = '08:00 - 09:00'; // Default to a morning slot for simplicity
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
        </div>
        <WeekNavigator translations={t} dateLocale={dateLocale} displayedDate={displayedDate} setDisplayedDate={setDisplayedDate} systemToday={systemToday} eventfulDays={eventfulDays} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full max-w-4xl mb-12 sm:mb-16">
             {daysToDisplay.map((dateInWeek) => {
                const dayNameForDisplay = format(dateInWeek, 'EEEE', { locale: dateLocale });
                const dateKeyForStorage = getDateKey(dateInWeek);
                const noteForThisDayBox = allDailyNotes[dateKeyForStorage] || '';
                const ratingForThisDayBox = allRatings[dateKeyForStorage] || null;
                const hasAnyDataForThisDay = dayHasContent(dateInWeek, allPlannerData);
                return (
                    <DayBox key={dateKeyForStorage} dayName={dayNameForDisplay}
                        onClick={() => onDaySelect(dayNameForDisplay, dateInWeek)}
                        notes={noteForThisDayBox} 
                        dayHasAnyData={hasAnyDataForThisDay}
                        rating={ratingForThisDayBox}
                        onRatingChange={(newRating) => setRating(dateKeyForStorage, newRating)}
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
             <div className="w-full sm:w-40 h-44 sm:h-48 justify-self-center">
                <GameCard title={t.weeklySummaryTitle} icon={BarChart} onClick={() => router.push(`/weekly-summary?weekStart=${getDateKey(daysToDisplay[0])}`)} ariaLabel={t.weeklySummaryPlaceholder}/>
            </div>
        </div>
        {hoverPreviewData && (<DayHoverPreview {...hoverPreviewData} onMouseEnterPreview={() => { if (showPreviewTimerRef.current) clearTimeout(showPreviewTimerRef.current); if (hidePreviewTimerRef.current) clearTimeout(hidePreviewTimerRef.current); }} onMouseLeavePreview={() => { hidePreviewTimerRef.current = setTimeout(() => setHoverPreviewData(null), HIDE_PREVIEW_DELAY); }} onClickPreview={() => { if (showPreviewTimerRef.current) clearTimeout(showPreviewTimerRef.current); if (hidePreviewTimerRef.current) clearTimeout(hidePreviewTimerRef.current); setHoverPreviewData(null); isPreviewSuppressedByClickRef.current = true; }} />)}
        <FeatureGrid />
        <PageFooter translations={t} currentYear={systemToday.getFullYear()} />
      </main>
      <ClipboardModal isOpen={isClipboardModalOpen} onClose={handleCloseClipboardModal} onSave={handleSaveFromClipboard} content={clipboardContent} translations={t.clipboard} />
      <QuickAddTodoModal isOpen={isQuickAddModalOpen} onClose={() => setIsQuickAddModalOpen(false)} onSave={handleSaveQuickAddTodo} weekDays={daysToDisplay.filter(day => isSameDay(day, systemToday) || isAfter(day, systemToday))} translations={t.quickAddTodo} dateLocale={dateLocale} />
    </>
  );
}

    