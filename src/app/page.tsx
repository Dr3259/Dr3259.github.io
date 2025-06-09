
"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DayBox } from '@/components/DayBox';
import { DayHoverPreview } from '@/components/DayHoverPreview';
import { Button } from "@/components/ui/button";
import { Languages, Sun, Moon, PauseCircle, ChevronLeft, ChevronRight, CalendarDays, Undo, Utensils } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfWeek, endOfWeek, isSameDay, subDays, isSameWeek, subWeeks, isBefore, startOfMonth, type Locale, isAfter, differenceInDays } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';

// Types from DayDetailPage - needed for checking content
type CategoryType = 'work' | 'study' | 'shopping' | 'organizing' | 'relaxing' | 'cooking' | 'childcare' | 'dating';
interface TodoItem {
  id: string; text: string; completed: boolean; category: CategoryType | null;
  deadline: 'hour' | 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'nextMonth' | null;
  importance: 'important' | 'notImportant' | null;
}
interface MeetingNoteItem { id: string; title: string; notes: string; attendees: string; actionItems: string; }
interface ShareLinkItem { id: string; url: string; title: string; }
interface ReflectionItem { id: string; text: string; }

type RatingType = 'excellent' | 'terrible' | 'average' | null;

const LOCAL_STORAGE_KEY_NOTES = 'weekGlanceNotes';
const LOCAL_STORAGE_KEY_RATINGS = 'weekGlanceRatings';
const LOCAL_STORAGE_KEY_SUMMARY = 'weekGlanceSummary';
const LOCAL_STORAGE_KEY_THEME = 'weekGlanceTheme';

// Keys used by DayDetailPage for its data
const LOCAL_STORAGE_KEY_ALL_DAILY_NOTES = 'allWeekDailyNotes';
const LOCAL_STORAGE_KEY_ALL_TODOS = 'allWeekTodos';
const LOCAL_STORAGE_KEY_ALL_MEETING_NOTES = 'allWeekMeetingNotes';
const LOCAL_STORAGE_KEY_ALL_SHARE_LINKS = 'allWeekShareLinks';
const LOCAL_STORAGE_KEY_ALL_REFLECTIONS = 'allWeekReflections';


const translations = {
  'zh-CN': {
    pageTitle: '周览',
    pageSubtitle: '规划你的一周，一日一览。',
    languageButtonText: 'English',
    daysOfWeek: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
    selectDayAria: (day: string) => `查看 ${day} 详情`,
    hasNotesAria: '有笔记',
    ratingLabels: {
      excellent: '好极了',
      average: '一般般',
      terrible: '糟透了',
    },
    weeklySummaryTitle: '本周总结',
    weeklySummaryPlaceholder: '写下你的本周总结...',
    toggleThemeAria: '切换主题',
    todayPrefix: '今天',
    thumbnailPreviewAlt: (day: string) => `${day} 的缩略图预览`,
    githubAria: 'GitHub',
    twitterAria: 'X (原推特)',
    emailAria: '电子邮件',
    copyrightText: (year: number, appName: string) => `© ${year} ${appName}`,
    mitLicenseLinkText: '本站依据 MIT 许可证发行',
    mitLicenseLinkAria: '查看 MIT 许可证详情',
    restButtonText: '休息一下',
    restButtonAria: '进入休息页面',
    previousWeek: '上一周',
    nextWeek: '下一周',
    currentWeek: '本周',
    jumpToWeek: '跳转到周',
    backToCurrentWeek: '返回本周',
    yearMonthFormat: "yyyy年M月",
    weekLabelFormat: (weekNumber: number) => `第 ${weekNumber} 周`,
    selectDate: '选择日期',
  },
  'en': {
    pageTitle: 'Week Glance',
    pageSubtitle: 'Plan your week, one day at a glance.',
    languageButtonText: '中文',
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    selectDayAria: (day: string) => `View details for ${day}`,
    hasNotesAria: 'Has notes',
    ratingLabels: {
      excellent: 'Excellent',
      average: 'Average',
      terrible: 'Terrible',
    },
    weeklySummaryTitle: 'Weekly Summary',
    weeklySummaryPlaceholder: 'Write your weekly summary here...',
    toggleThemeAria: 'Toggle theme',
    todayPrefix: 'Today',
    thumbnailPreviewAlt: (day: string) => `Thumbnail preview for ${day}`,
    githubAria: 'GitHub',
    twitterAria: 'X (formerly Twitter)',
    emailAria: 'Email',
    copyrightText: (year: number, appName: string) => `© ${year} ${appName}`,
    mitLicenseLinkText: 'Released under the MIT License',
    mitLicenseLinkAria: 'View MIT License details',
    restButtonText: 'Take a Break',
    restButtonAria: 'Go to rest page',
    previousWeek: 'Previous Week',
    nextWeek: 'Next Week',
    currentWeek: 'Current Week',
    jumpToWeek: 'Jump to Week',
    backToCurrentWeek: 'Back to Current Week',
    yearMonthFormat: "MMMM yyyy",
    weekLabelFormat: (weekNumber: number) => `Week ${weekNumber}`,
    selectDate: 'Select a date',
  }
};
type LanguageKey = keyof typeof translations;
type Theme = 'light' | 'dark';

interface HoverPreviewData {
  dayName: string;
  notes: string;
  imageHint: string;
  altText: string;
}

interface AllLoadedData {
  notes: Record<string, string>;
  ratings: Record<string, RatingType>;
  allDailyNotes: Record<string, string>;
  allTodos: Record<string, Record<string, TodoItem[]>>;
  allMeetingNotes: Record<string, Record<string, MeetingNoteItem[]>>;
  allShareLinks: Record<string, Record<string, ShareLinkItem[]>>;
  allReflections: Record<string, Record<string, ReflectionItem[]>>;
}


const SHOW_PREVIEW_DELAY = 2000;
const HIDE_PREVIEW_DELAY = 200;
const MAX_WEEKS_TO_SEARCH_BACK_FOR_FIRST_CONTENT = 104; // Approx 2 years

const getDisplayWeekOfMonth = (weekStartDate: Date, options: { locale: Locale, weekStartsOn: number }): number => {
  const monthOfLabel = weekStartDate.getMonth();
  const yearOfLabel = weekStartDate.getFullYear();

  let weekOrdinal = 0;
  let iterDate = startOfMonth(new Date(yearOfLabel, monthOfLabel, 1));

  while (iterDate.getMonth() === monthOfLabel && iterDate.getFullYear() === yearOfLabel) {
    const currentIterMonday = startOfWeek(iterDate, options);
    
    // Only count weeks whose Monday (start of the week) is in the target month
    if (currentIterMonday.getMonth() === monthOfLabel && currentIterMonday.getFullYear() === yearOfLabel) {
        // Check if this is the *first* day of this specific Monday-starting week within the month
        if (isSameDay(currentIterMonday, iterDate) || iterDate.getDay() === options.weekStartsOn) {
             weekOrdinal++;
        }
        // If the currentIterMonday is the weekStartDate we're looking for, return its calculated ordinal
        if (isSameDay(currentIterMonday, weekStartDate)) {
            return weekOrdinal;
        }
    }
    
    iterDate = addDays(iterDate, 1);
    // Safety break for very unusual calendar structures, though unlikely with standard month lengths
    if (weekOrdinal > 5 && differenceInDays(iterDate, weekStartDate) > 7) break; 
  }
  
  // Fallback for edge cases, e.g. if weekStartDate is somehow not found (shouldn't happen)
  // or if weekStartDate's Monday is in the previous month but it still "belongs" to current month's display.
  // The primary logic above aims to count based on Mondays *within* the month.
  // If weekOrdinal is 0, it implies the first Monday of weekStartDate's month hasn't been hit yet in a way that satisfies conditions.
  // This often means weekStartDate's Monday is in the *previous* month.
  // A simple approach: if weekStartDate is in monthOfLabel, and no ordinal calculated, it's likely the "first" conceptual week.
  if (weekStartDate.getMonth() === monthOfLabel && weekOrdinal === 0) return 1;

  return weekOrdinal > 0 ? weekOrdinal : 1; // Default to 1 if calculation is ambiguous
};


export default function WeekGlancePage() {
  const router = useRouter();
  
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN'); 
  const [theme, setTheme] = useState<Theme>('light'); 
  const [systemToday, setSystemToday] = useState<Date | null>(null);
  const [displayedDate, setDisplayedDate] = useState<Date | null>(null); 
  const [isAfter6PMToday, setIsAfter6PMToday] = useState<boolean>(false); 
  const [currentYear, setCurrentYear] = useState<number | null>(null); 
  const [isClientMounted, setIsClientMounted] = useState(false);
  
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<string, RatingType>>({});
  const [weeklySummary, setWeeklySummary] = useState<string>('');
  const [allDailyNotes, setAllDailyNotes] = useState<Record<string, string>>({});
  const [allTodos, setAllTodos] = useState<Record<string, Record<string, TodoItem[]>>>({});
  const [allMeetingNotes, setAllMeetingNotes] = useState<Record<string, Record<string, MeetingNoteItem[]>>>({});
  const [allShareLinks, setAllShareLinks] = useState<Record<string, Record<string, ShareLinkItem[]>>>({});
  const [allReflections, setAllReflections] = useState<Record<string, Record<string, ReflectionItem[]>>>({});
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [firstEverWeekWithDataStart, setFirstEverWeekWithDataStart] = useState<Date | null>(null);

  const [hoverPreviewData, setHoverPreviewData] = useState<HoverPreviewData | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const showPreviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hidePreviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPreviewSuppressedByClickRef = useRef(false);

  const t = translations[currentLanguage];
  const dateLocale = currentLanguage === 'zh-CN' ? zhCN : enUS;

  const clearTimeoutIfNecessary = useCallback(() => {
    if (showPreviewTimerRef.current) {
      clearTimeout(showPreviewTimerRef.current);
      showPreviewTimerRef.current = null;
    }
    if (hidePreviewTimerRef.current) {
      clearTimeout(hidePreviewTimerRef.current);
      hidePreviewTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setIsClientMounted(true); 

    const browserLang: LanguageKey = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
    setCurrentLanguage(browserLang);
    if (typeof document !== 'undefined') document.documentElement.lang = browserLang;
    
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY_THEME) as Theme | null : null;
    const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    setTheme(storedTheme || (systemPrefersDark ? 'dark' : 'light'));

    const today = new Date();
    setSystemToday(today);
    setDisplayedDate(today); 
    setIsAfter6PMToday(today.getHours() >= 18);
    setCurrentYear(today.getFullYear());

    const loadData = () => {
        try {
            setNotes(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NOTES) || '{}'));
            setRatings(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RATINGS) || '{}'));
            setWeeklySummary(localStorage.getItem(LOCAL_STORAGE_KEY_SUMMARY) || '');
            setAllDailyNotes(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_DAILY_NOTES) || '{}'));
            setAllTodos(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_TODOS) || '{}'));
            setAllMeetingNotes(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_MEETING_NOTES) || '{}'));
            setAllShareLinks(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_SHARE_LINKS) || '{}'));
            setAllReflections(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_REFLECTIONS) || '{}'));
        } catch (e) {
            console.error("Error loading data from localStorage", e);
        } finally {
            setAllDataLoaded(true);
        }
    };
    loadData();
    
    return () => {
      if (showPreviewTimerRef.current) {
        clearTimeout(showPreviewTimerRef.current);
        showPreviewTimerRef.current = null;
      }
      if (hidePreviewTimerRef.current) {
        clearTimeout(hidePreviewTimerRef.current);
        hidePreviewTimerRef.current = null;
      }
    };
  }, []); 


  const getDayKeyForStorage = useCallback((date: Date): string => {
    const dayIndex = (date.getDay() + 6) % 7; 
    const langToUseForDayKey = translations[currentLanguage] ? currentLanguage : 'en'; 
    return translations[langToUseForDayKey].daysOfWeek[dayIndex];
  }, [currentLanguage]);


  useEffect(() => {
    if (isClientMounted) {
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      if (typeof window !== 'undefined') localStorage.setItem(LOCAL_STORAGE_KEY_THEME, theme);
    }
  }, [theme, isClientMounted]);

  const allLoadedDataMemo = useMemo((): AllLoadedData => ({
    notes, ratings, allDailyNotes, allTodos, allMeetingNotes, allShareLinks, allReflections
  }), [notes, ratings, allDailyNotes, allTodos, allMeetingNotes, allShareLinks, allReflections]);
  
  const dayHasContent = useCallback((date: Date, data: AllLoadedData): boolean => {
    const dayKey = getDayKeyForStorage(date); 
    
    if (data.notes[dayKey]?.trim()) return true;
    if (data.ratings[dayKey]) return true; 

    if (data.allDailyNotes[dayKey]?.trim()) return true;

    const checkSlotItems = (items: Record<string, any[]> | undefined) => 
        items && Object.values(items).some(slotItems => slotItems.length > 0);

    if (checkSlotItems(data.allTodos[dayKey])) return true;
    if (checkSlotItems(data.allMeetingNotes[dayKey])) return true;
    if (checkSlotItems(data.allShareLinks[dayKey])) return true;
    if (checkSlotItems(data.allReflections[dayKey])) return true;

    return false;
  }, [getDayKeyForStorage]); 

  const weekHasContent = useCallback((weekDate: Date, data: AllLoadedData): boolean => {
    const weekToCheckStart = startOfWeek(weekDate, { weekStartsOn: 1, locale: dateLocale });
    for (let i = 0; i < 7; i++) {
        if (dayHasContent(addDays(weekToCheckStart, i), data)) {
            return true;
        }
    }
    return false;
  }, [dayHasContent, dateLocale]);

  useEffect(() => {
    if (!allDataLoaded || !systemToday) return; 

    let searchDate = startOfWeek(systemToday, { weekStartsOn: 1, locale: dateLocale });
    let earliestWeekFound: Date | null = null;

    for (let i = 0; i < MAX_WEEKS_TO_SEARCH_BACK_FOR_FIRST_CONTENT; i++) {
        if (weekHasContent(searchDate, allLoadedDataMemo)) {
            earliestWeekFound = new Date(searchDate); 
        }
        if (i === MAX_WEEKS_TO_SEARCH_BACK_FOR_FIRST_CONTENT - 1) break;
        searchDate = subWeeks(searchDate, 1);
    }
    setFirstEverWeekWithDataStart(earliestWeekFound);
  }, [allDataLoaded, systemToday, dateLocale, weekHasContent, allLoadedDataMemo]);


  const currentDisplayedWeekStart = useMemo(() => {
    if (!displayedDate) return new Date(); 
    return startOfWeek(displayedDate, { weekStartsOn: 1, locale: dateLocale });
  }, [displayedDate, dateLocale]);

  const currentDisplayedWeekEnd = useMemo(() => {
    if (!displayedDate) return new Date(); 
    return endOfWeek(displayedDate, { weekStartsOn: 1, locale: dateLocale });
  }, [displayedDate, dateLocale]);

  const daysToDisplay = useMemo(() => {
    if (!displayedDate) return [];
    const start = currentDisplayedWeekStart;
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [currentDisplayedWeekStart, displayedDate]);

  const isViewingActualCurrentWeek = useMemo(() => {
    if (!displayedDate || !systemToday) return true; 
    return isSameWeek(displayedDate, systemToday, { weekStartsOn: 1, locale: dateLocale });
  }, [displayedDate, systemToday, dateLocale]);


  const toggleLanguage = () => {
    const newLang = currentLanguage === 'zh-CN' ? 'en' : 'zh-CN';
    setCurrentLanguage(newLang);
    if (typeof document !== 'undefined') document.documentElement.lang = newLang;
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleDaySelect = useCallback((dayNameForUrl: string) => {
    clearTimeoutIfNecessary();
    setHoverPreviewData(null);
    isPreviewSuppressedByClickRef.current = true;
    router.push(`/day/${encodeURIComponent(dayNameForUrl)}`);
  }, [router, clearTimeoutIfNecessary]);

  const handleRatingChange = useCallback((dayKey: string, newRating: RatingType) => {
    setRatings(prev => {
      const updated = { ...prev, [dayKey]: newRating };
      if (typeof window !== 'undefined') localStorage.setItem(LOCAL_STORAGE_KEY_RATINGS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSummaryChange = useCallback((summary: string) => {
    setWeeklySummary(summary);
    if (typeof window !== 'undefined') localStorage.setItem(LOCAL_STORAGE_KEY_SUMMARY, summary);
  }, []);

  const handleDayHoverStart = useCallback((dayData: { dayName: string; notes: string; imageHint: string }) => {
    clearTimeoutIfNecessary();
    if (isPreviewSuppressedByClickRef.current) return;
    showPreviewTimerRef.current = setTimeout(() => setHoverPreviewData({ ...dayData, altText: t.thumbnailPreviewAlt(dayData.dayName) }), SHOW_PREVIEW_DELAY);
  }, [t, clearTimeoutIfNecessary]);

  const handleDayHoverEnd = useCallback(() => {
    isPreviewSuppressedByClickRef.current = false;
    clearTimeoutIfNecessary();
    hidePreviewTimerRef.current = setTimeout(() => setHoverPreviewData(null), HIDE_PREVIEW_DELAY);
  }, [clearTimeoutIfNecessary]);

  const handlePreviewMouseEnter = useCallback(() => clearTimeoutIfNecessary(), [clearTimeoutIfNecessary]);
  const handlePreviewMouseLeave = useCallback(() => {
    clearTimeoutIfNecessary();
    hidePreviewTimerRef.current = setTimeout(() => setHoverPreviewData(null), HIDE_PREVIEW_DELAY);
  }, [clearTimeoutIfNecessary]);

  const handlePreviewClick = useCallback(() => {
    clearTimeoutIfNecessary();
    setHoverPreviewData(null);
    isPreviewSuppressedByClickRef.current = true;
  }, [clearTimeoutIfNecessary]);

  const handleRestButtonClick = () => router.push('/rest');

  const handlePreviousWeek = () => {
    if (!displayedDate || !allDataLoaded) return;

    const currentWeekStartDate = startOfWeek(displayedDate, { weekStartsOn: 1, locale: dateLocale });

    if (firstEverWeekWithDataStart) {
        if (isSameDay(currentWeekStartDate, firstEverWeekWithDataStart)) {
            return; // Already at the earliest recorded week
        }
        if (isBefore(currentWeekStartDate, firstEverWeekWithDataStart) ) {
             // Should not happen if button is correctly disabled, but as a safeguard:
            if (weekHasContent(firstEverWeekWithDataStart, allLoadedDataMemo)){
                 setDisplayedDate(new Date(firstEverWeekWithDataStart));
            }
            return;
        }
    } else {
      // No content found ever, cannot go back.
      return;
    }
    
    const potentialPrevWeekStartDate = subWeeks(currentWeekStartDate, 1);

    // If potential previous week is before the first recorded week, jump to the first recorded week.
    if (firstEverWeekWithDataStart && isBefore(potentialPrevWeekStartDate, firstEverWeekWithDataStart)) {
        if (weekHasContent(firstEverWeekWithDataStart, allLoadedDataMemo)){
           setDisplayedDate(new Date(firstEverWeekWithDataStart));
        } // else, do nothing, stay on current week because firstEver is empty (should not happen)
        return;
    }
    
    // Only navigate if the potential previous week has content
    if (weekHasContent(potentialPrevWeekStartDate, allLoadedDataMemo)) {
      setDisplayedDate(potentialPrevWeekStartDate);
    }
    // If it doesn't have content, do nothing (stay on current week).
  };


  const handleNextWeek = () => {
    if (isViewingActualCurrentWeek || !displayedDate || !systemToday) return; 
    const nextWeekCandidate = addDays(displayedDate, 7);
    // Ensure we don't go past the current system week
    if (isAfter(startOfWeek(nextWeekCandidate, { weekStartsOn: 1, locale: dateLocale }), startOfWeek(systemToday, { weekStartsOn: 1, locale: dateLocale }))) {
        setDisplayedDate(new Date(systemToday)); // Go to current week if next is beyond
    } else {
        setDisplayedDate(nextWeekCandidate);
    }
  };

  const handleGoToCurrentWeek = () => {
    if (systemToday) {
      setDisplayedDate(new Date(systemToday));
    }
  };


  const handleDateSelectForJump = (date: Date | undefined) => {
    if (date) {
      if (systemToday && isAfter(date, systemToday)) {
        // Prevent selecting future dates explicitly, though toDate on Calendar should handle this
        setIsCalendarOpen(false); 
        return; 
      }
      setDisplayedDate(date);
      setIsCalendarOpen(false);
    }
  };
  
  const isPreviousWeekDisabled = useMemo(() => {
    if (!allDataLoaded || !displayedDate) return true; // Disable if data not loaded or no display date
    if (!firstEverWeekWithDataStart) return true; // Disable if no historical data found at all

    const currentDisplayedWeekStartDate = startOfWeek(displayedDate, { weekStartsOn: 1, locale: dateLocale });
    
    // Check if current week is the first recorded week
    if (isSameDay(currentDisplayedWeekStartDate, firstEverWeekWithDataStart)) {
        return true;
    }

    // Check if there's any content in any week before the current one, down to firstEverWeek
    let tempDate = subWeeks(currentDisplayedWeekStartDate, 1);
    while(isAfter(tempDate, firstEverWeekWithDataStart) || isSameDay(tempDate, firstEverWeekWithDataStart)) {
        if(weekHasContent(tempDate, allLoadedDataMemo)) {
            return false; // Found a previous week with content
        }
        if(isSameDay(tempDate, firstEverWeekWithDataStart)) break; // Stop if we checked firstEverWeek
        tempDate = subWeeks(tempDate, 1);
        if (isBefore(tempDate, firstEverWeekWithDataStart) && !isSameDay(tempDate, firstEverWeekWithDataStart)) break; // Safety break
    }
    
    return true; // No previous weeks with content found up to firstEverWeekWithDataStart
  }, [allDataLoaded, displayedDate, firstEverWeekWithDataStart, dateLocale, weekHasContent, allLoadedDataMemo]);

  const isNextWeekDisabled = useMemo(() => {
    if (!displayedDate || !systemToday) return true;
    return isSameWeek(displayedDate, systemToday, { weekStartsOn: 1, locale: dateLocale });
  }, [displayedDate, systemToday, dateLocale]);


  const calendarDisabledMatcher = useCallback((date: Date) => {
    if (!allDataLoaded || !systemToday) return true; 
    
    // Disable dates after today
    if (isAfter(date, systemToday) && !isSameDay(date, systemToday)) {
        return true;
    }

    // Disable dates before the first week with data
    if (firstEverWeekWithDataStart && isBefore(startOfWeek(date, { weekStartsOn: 1, locale: dateLocale }), firstEverWeekWithDataStart)) {
        return true;
    }
    
    // If a specific first week is known, and the date is in that week, allow if that week has content
    if (firstEverWeekWithDataStart && isSameWeek(date, firstEverWeekWithDataStart, {weekStartsOn: 1, locale: dateLocale})) {
        return !weekHasContent(firstEverWeekWithDataStart, allLoadedDataMemo);
    }

    // For other dates, disable if the week they belong to has no content
    return !weekHasContent(date, allLoadedDataMemo);
  }, [allDataLoaded, weekHasContent, allLoadedDataMemo, firstEverWeekWithDataStart, dateLocale, systemToday]);

  if (!isClientMounted || !systemToday || !displayedDate) {
    return (
      <main className="flex flex-col items-center min-h-screen bg-background text-foreground py-10 sm:py-16 px-4">
        <header className="mb-8 sm:mb-12 w-full max-w-4xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary">{t.pageTitle}</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t.pageSubtitle}</p>
          </div>
        </header>
        <div className="text-center p-10">Loading week data...</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-background text-foreground py-10 sm:py-16 px-4">
      <header className="mb-8 sm:mb-12 w-full max-w-4xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary">{t.pageTitle}</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t.pageSubtitle}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={toggleLanguage} aria-label={currentLanguage === 'zh-CN' ? 'Switch to English' : '切换到中文'}>
            <Languages className="mr-2 h-4 w-4" />{t.languageButtonText}
          </Button>
          <Button variant="outline" size="sm" onClick={toggleTheme} aria-label={t.toggleThemeAria}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRestButtonClick} aria-label={t.restButtonAria}>
            <PauseCircle className="mr-2 h-4 w-4" />{t.restButtonText}
          </Button>
        </div>
      </header>

      <div className="w-full max-w-4xl mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 p-3 bg-card/50 rounded-lg shadow">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousWeek} aria-label={t.previousWeek} disabled={isPreviousWeekDisabled}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
             <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-[280px] sm:w-[320px] justify-start text-left font-normal" aria-label={t.jumpToWeek}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        <span className="truncate">
                           {`${format(currentDisplayedWeekStart, t.yearMonthFormat, { locale: dateLocale })}, ${t.weekLabelFormat(getDisplayWeekOfMonth(currentDisplayedWeekStart, { locale: dateLocale, weekStartsOn: 1 }))}`}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={displayedDate}
                        onSelect={handleDateSelectForJump}
                        disabled={calendarDisabledMatcher}
                        initialFocus
                        locale={dateLocale}
                        weekStartsOn={1}
                        fromDate={firstEverWeekWithDataStart || undefined} 
                        toDate={systemToday || undefined} 
                    />
                </PopoverContent>
            </Popover>
             <Button variant="outline" size="sm" onClick={handleNextWeek} aria-label={t.nextWeek} disabled={isNextWeekDisabled}>
                <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {!isViewingActualCurrentWeek && (
            <Button variant="outline" size="sm" onClick={handleGoToCurrentWeek} aria-label={t.backToCurrentWeek} className="mt-2 sm:mt-0">
              <Undo className="mr-2 h-4 w-4" />{t.backToCurrentWeek}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 w-full max-w-4xl place-items-center mb-12 sm:mb-16">
        {daysToDisplay.map((dateInWeek) => {
          const dayNameForDisplay = format(dateInWeek, 'EEEE', { locale: dateLocale });
          const dayKeyForStorage = getDayKeyForStorage(dateInWeek);
          
          const currentSystemTodayToUse = systemToday; 
          const isCurrentActualDay = currentSystemTodayToUse ? isSameDay(dateInWeek, currentSystemTodayToUse) : false;
          const isPastActualDay = currentSystemTodayToUse ? (isBefore(dateInWeek, currentSystemTodayToUse) && !isSameDay(dateInWeek, currentSystemTodayToUse)) : false;
          const isFutureActualDay = currentSystemTodayToUse ? (!isCurrentActualDay && !isPastActualDay) : false;
          
          const noteForThisDayBox = notes[dayKeyForStorage] || '';
          const ratingForThisDayBox = ratings[dayKeyForStorage] || null;

          return (
            <DayBox
              key={dateInWeek.toISOString()}
              dayName={dayNameForDisplay}
              onClick={() => handleDaySelect(dayNameForDisplay)}
              notes={noteForThisDayBox} 
              hasNotes={!!noteForThisDayBox?.trim()}
              rating={ratingForThisDayBox}
              onRatingChange={(newRating) => handleRatingChange(dayKeyForStorage, newRating)}
              isCurrentDay={isCurrentActualDay}
              isPastDay={isPastActualDay}
              isFutureDay={isFutureActualDay}
              isAfter6PMToday={isAfter6PMToday} 
              todayLabel={t.todayPrefix}
              selectDayLabel={t.selectDayAria(dayNameForDisplay)}
              hasNotesLabel={t.hasNotesAria}
              ratingUiLabels={t.ratingLabels}
              onHoverStart={handleDayHoverStart}
              onHoverEnd={handleDayHoverEnd}
              imageHint="activity memory"
            />
          );
        })}
         <Card className="w-36 h-44 sm:w-40 sm:h-48 flex flex-col rounded-xl border-2 border-transparent hover:border-accent/70 bg-card shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105">
            <CardHeader className="p-2 pb-1 text-center">
               <CardTitle className="text-lg sm:text-xl font-medium text-foreground">{t.weeklySummaryTitle}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex-grow flex flex-col">
              <Textarea
                placeholder={t.weeklySummaryPlaceholder}
                value={weeklySummary}
                onChange={(e) => handleSummaryChange(e.target.value)}
                className="flex-grow bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary text-sm rounded-md w-full resize-none p-1"
                aria-label={t.weeklySummaryTitle}
              />
            </CardContent>
          </Card>
      </div>

      {hoverPreviewData && (
        <DayHoverPreview
          dayName={hoverPreviewData.dayName}
          notes={hoverPreviewData.notes}
          imageHint={hoverPreviewData.imageHint}
          altText={hoverPreviewData.altText}
          onMouseEnterPreview={handlePreviewMouseEnter}
          onMouseLeavePreview={handlePreviewMouseLeave}
          onClickPreview={handlePreviewClick}
        />
      )}

      <footer className="mt-auto pt-10 pb-6 w-full max-w-4xl">
        <div className="border-t border-border pt-8">
          <div className="text-center md:flex md:items-center md:justify-between">
            <div className="md:order-1">
              {currentYear && (
                <p className="text-sm text-muted-foreground">
                  {t.copyrightText(currentYear, t.pageTitle)}
                  <span className="mx-1">·</span>
                  <a href="/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label={t.mitLicenseLinkAria}>
                    {t.mitLicenseLinkText}
                  </a>
                </p>
              )}
            </div>
            <div className="flex flex-col items-center space-y-3 mt-4 md:flex-row md:space-y-0 md:space-x-6 md:mt-0 md:order-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label={t.githubAria} className="text-xs text-muted-foreground hover:text-primary transition-colors">GitHub</a>
              <a href="#" aria-label={t.twitterAria} className="text-xs text-muted-foreground hover:text-primary transition-colors">X</a>
              <a href="#" aria-label={t.emailAria} className="text-xs text-muted-foreground hover:text-primary transition-colors">Email</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

