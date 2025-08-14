
"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DayBox } from '@/components/DayBox';
import { DayHoverPreview } from '@/components/DayHoverPreview';
import { Button } from "@/components/ui/button";
import { Languages, Sun, Moon, PauseCircle, ChevronLeft, ChevronRight, CalendarDays, Undo, MessageSquare, FileEdit, CalendarPlus, BarChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfWeek, endOfWeek, isSameDay, subDays, isSameWeek, subWeeks, isBefore, startOfMonth, type Locale, isAfter, differenceInDays } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { ClipboardModal } from '@/components/ClipboardModal';
import copy from 'copy-to-clipboard';


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

const LOCAL_STORAGE_KEY_NOTES = 'weekGlanceNotes_v2'; // Changed key for new structure
const LOCAL_STORAGE_KEY_RATINGS = 'weekGlanceRatings_v2'; // Changed key for new structure
const LOCAL_STORAGE_KEY_SUMMARY = 'weekGlanceSummary_v2'; // Changed key for new structure
const LOCAL_STORAGE_KEY_THEME = 'weekGlanceTheme';
const LOCAL_STORAGE_KEY_SHARE_TARGET = 'weekGlanceShareTarget_v1';

// Keys used by DayDetailPage for its data, now structured with YYYY-MM-DD keys
const LOCAL_STORAGE_KEY_ALL_DAILY_NOTES = 'allWeekDailyNotes_v2';
const LOCAL_STORAGE_KEY_ALL_TODOS = 'allWeekTodos_v2';
const LOCAL_STORAGE_KEY_ALL_MEETING_NOTES = 'allWeekMeetingNotes_v2';
const LOCAL_STORAGE_KEY_ALL_SHARE_LINKS = 'allWeekShareLinks_v2';
const LOCAL_STORAGE_KEY_ALL_REFLECTIONS = 'allWeekReflections_v2';


const translations = {
  'zh-CN': {
    pageTitle: '周览',
    pageSubtitle: '规划你的一周，一日一览。',
    languageButtonText: 'English',
    daysOfWeek: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
    selectDayAria: (day: string) => `查看 ${day} 详情`,
    hasNotesAria: '有内容记录',
    ratingLabels: {
      excellent: '好极了',
      average: '一般般',
      terrible: '糟透了',
    },
    weeklySummaryTitle: '本周总结',
    weeklySummaryPlaceholder: '查看本周总结与统计',
    toggleThemeAria: '切换主题',
    todayPrefix: '今天',
    thumbnailPreviewAlt: (day: string) => `${day} 的缩略图预览`,
    githubAria: 'GitHub',
    wechatAria: '微信',
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
    shareTarget: {
      linkSavedToastTitle: "分享已保存",
      linkSavedToastDescription: (slot: string) => `链接已保存到当前时间段 (${slot})`
    },
    clipboard: {
        linkSavedToastTitle: "链接已记录",
        linkSavedToastDescription: (slot: string) => `链接已保存到: ${slot}`,
        linkAlreadyExists: "这个链接已经记录过了。",
        permissionDenied: "无法访问剪贴板，请检查权限设置。",
        checkClipboardError: "检查剪贴板时出错。",
        modalTitle: "检测到剪贴板内容",
        modalDescription: "您想将以下内容保存到今天的日程中吗？",
        saveButton: "保存",
        cancelButton: "关闭",
    },
    pasteFromClipboard: "从剪贴板粘贴",
    timeIntervals: {
        midnight: '凌晨 (00:00 - 05:00)',
        earlyMorning: '清晨 (05:00 - 09:00)',
        morning: '上午 (09:00 - 12:00)',
        noon: '中午 (12:00 - 14:00)',
        afternoon: '下午 (14:00 - 18:00)',
        evening: '晚上 (18:00 - 24:00)',
    },
  },
  'en': {
    pageTitle: 'Week Glance',
    pageSubtitle: 'Plan your week, one day at a glance.',
    languageButtonText: '中文',
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    selectDayAria: (day: string) => `View details for ${day}`,
    hasNotesAria: 'Has recorded content',
    ratingLabels: {
      excellent: 'Excellent',
      average: 'Average',
      terrible: 'Terrible',
    },
    weeklySummaryTitle: 'Weekly Summary',
    weeklySummaryPlaceholder: 'View weekly summary and statistics',
    toggleThemeAria: 'Toggle theme',
    todayPrefix: 'Today',
    thumbnailPreviewAlt: (day: string) => `Thumbnail preview for ${day}`,
    githubAria: 'GitHub',
    wechatAria: 'WeChat',
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
    shareTarget: {
      linkSavedToastTitle: "Share Saved",
      linkSavedToastDescription: (slot: string) => `Link saved to the current time slot (${slot})`
    },
    clipboard: {
        linkSavedToastTitle: "Link Saved",
        linkSavedToastDescription: (slot: string) => `Link saved to: ${slot}`,
        linkAlreadyExists: "This link has already been saved.",
        permissionDenied: "Could not access clipboard. Please check permissions.",
        checkClipboardError: "Error checking clipboard.",
        modalTitle: "Content Detected in Clipboard",
        modalDescription: "Would you like to save the following content to today's schedule?",
        saveButton: "Save",
        cancelButton: "Close",
    },
    pasteFromClipboard: "Paste from clipboard",
     timeIntervals: {
        midnight: 'Midnight (00:00 - 05:00)',
        earlyMorning: 'Early Morning (05:00 - 09:00)',
        morning: 'Morning (09:00 - 12:00)',
        noon: 'Noon (12:00 - 14:00)',
        afternoon: 'Afternoon (14:00 - 18:00)',
        evening: 'Evening (18:00 - 24:00)',
    },
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
  notes: Record<string, string>; // Key is YYYY-MM-DD
  ratings: Record<string, RatingType>; // Key is YYYY-MM-DD
  allDailyNotes: Record<string, string>; // Key is YYYY-MM-DD
  allTodos: Record<string, Record<string, TodoItem[]>>; // Outer key is YYYY-MM-DD
  allMeetingNotes: Record<string, Record<string, MeetingNoteItem[]>>; // Outer key is YYYY-MM-DD
  allShareLinks: Record<string, Record<string, ShareLinkItem[]>>; // Outer key is YYYY-MM-DD
  allReflections: Record<string, Record<string, ReflectionItem[]>>; // Outer key is YYYY-MM-DD
}

interface ReceivedShareData {
  title: string;
  text: string;
  url: string;
}


const SHOW_PREVIEW_DELAY = 2000;
const HIDE_PREVIEW_DELAY = 200;
const MAX_WEEKS_TO_SEARCH_BACK_FOR_FIRST_CONTENT = 104; // Approx 2 years
const URL_REGEX = /(https?:\/\/[^\s$.?#].[^\s]*)/i;

const getDisplayWeekOfMonth = (weekStartDate: Date, options: { locale: Locale, weekStartsOn: number }): number => {
  const monthOfLabel = weekStartDate.getMonth();
  const yearOfLabel = weekStartDate.getFullYear();

  let weekOrdinal = 0;
  let iterDate = startOfMonth(new Date(yearOfLabel, monthOfLabel, 1));

  while (iterDate.getMonth() === monthOfLabel && iterDate.getFullYear() === yearOfLabel) {
    const currentIterMonday = startOfWeek(iterDate, options);
    
    if (currentIterMonday.getMonth() === monthOfLabel && currentIterMonday.getFullYear() === yearOfLabel) {
        if (isSameDay(currentIterMonday, iterDate) || iterDate.getDay() === options.weekStartsOn) {
             weekOrdinal++;
        }
        if (isSameDay(currentIterMonday, weekStartDate)) {
            return weekOrdinal;
        }
    }
    
    iterDate = addDays(iterDate, 1);
    if (weekOrdinal > 5 && differenceInDays(iterDate, weekStartDate) > 7) break; 
  }
  
  if (weekStartDate.getMonth() === monthOfLabel && weekOrdinal === 0) return 1;

  return weekOrdinal > 0 ? weekOrdinal : 1;
};

const getDateKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

const saveUrlToCurrentTimeSlot = (
    item: { title: string, url: string },
    setAllShareLinks: React.Dispatch<React.SetStateAction<Record<string, Record<string, ShareLinkItem[]>>>>,
    t: (typeof translations)['zh-CN']
): { success: boolean; slotName: string } => {

    const newLink: ShareLinkItem = {
        id: Date.now().toString(),
        url: item.url,
        title: item.title,
    };

    const now = new Date();
    const currentHour = now.getHours();
    const currentDateKey = getDateKey(now);

    const timeIntervals = t.timeIntervals;
    let targetIntervalLabel = timeIntervals.evening; // Default
    if (currentHour < 5) targetIntervalLabel = timeIntervals.midnight;
    else if (currentHour < 9) targetIntervalLabel = timeIntervals.earlyMorning;
    else if (currentHour < 12) targetIntervalLabel = timeIntervals.morning;
    else if (currentHour < 14) targetIntervalLabel = timeIntervals.noon;
    else if (currentHour < 18) targetIntervalLabel = timeIntervals.afternoon;
    
    const hourlySlots = (() => {
        const match = targetIntervalLabel.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
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

    if (hourlySlots.length === 0) {
        console.error("Could not find a valid hourly slot for the current time.");
        return { success: false, slotName: '' };
    }
    const targetSlot = hourlySlots.find(slot => {
        const match = slot.match(/(\d{2}):\d{2}\s*-\s*(\d{2}):\d{2}/);
        if (match) {
            const startH = parseInt(match[1]);
            let endH = parseInt(match[2]);
            if (endH === 0) endH = 24;
            return currentHour >= startH && currentHour < endH;
        }
        return false;
    }) || hourlySlots[0];


    try {
        const existingData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_SHARE_LINKS) || '{}');
        const dayLinks = existingData[currentDateKey] || {};
        const slotLinks = dayLinks[targetSlot] || [];
        const updatedSlotLinks = [...slotLinks, newLink];
        const updatedDayLinks = { ...dayLinks, [targetSlot]: updatedSlotLinks };
        const newAllLinks = { ...existingData, [currentDateKey]: updatedDayLinks };
        
        localStorage.setItem(LOCAL_STORAGE_KEY_ALL_SHARE_LINKS, JSON.stringify(newAllLinks));
        setAllShareLinks(newAllLinks);
        
        return { success: true, slotName: targetIntervalLabel.split(' (')[0] };
    } catch(e) {
        console.error("Failed to save link to localStorage", e);
        return { success: false, slotName: '' };
    }
};

const isUrlAlreadySaved = (url: string, allLinks: Record<string, Record<string, ShareLinkItem[]>>): boolean => {
    if (!url) return false;
    for (const dateKey in allLinks) {
        for (const hourSlot in allLinks[dateKey]) {
            if (allLinks[dateKey][hourSlot].some(item => item.url === url)) {
                return true;
            }
        }
    }
    return false;
};

export default function WeekGlancePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN'); 
  const [theme, setTheme] = useState<Theme>('light'); 
  const [systemToday, setSystemToday] = useState<Date | null>(null);
  const [displayedDate, setDisplayedDate] = useState<Date | null>(null); 
  const [isAfter6PMToday, setIsAfter6PMToday] = useState<boolean>(isAfter(new Date(), new Date().setHours(18, 0, 0, 0))); 
  const [currentYear, setCurrentYear] = useState<number | null>(null); 
  const [isClientMounted, setIsClientMounted] = useState(false);
  
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<string, RatingType>>({});
  const [allDailyNotes, setAllDailyNotes] = useState<Record<string, string>>({});
  const [allTodos, setAllTodos] = useState<Record<string, Record<string, TodoItem[]>>>({});
  const [allMeetingNotes, setAllMeetingNotes] = useState<Record<string, Record<string, MeetingNoteItem[]>>>({});
  const [allShareLinks, setAllShareLinks] = useState<Record<string, Record<string, ShareLinkItem[]>>>({});
  const [allReflections, setAllReflections] = useState<Record<string, Record<string, ReflectionItem[]>>>({});
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [firstEverWeekWithDataStart, setFirstEverWeekWithDataStart] = useState<Date | null>(null);

  const [hoverPreviewData, setHoverPreviewData] = useState<HoverPreviewData | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [isClipboardModalOpen, setIsClipboardModalOpen] = useState(false);
  const [clipboardContent, setClipboardContent] = useState('');
  const [lastProcessedClipboardText, setLastProcessedClipboardText] = useState('');


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

   const handleSaveShareLinkFromPWA = useCallback((shareData: ReceivedShareData) => {
    if (!shareData) return;
    const { text, url } = shareData;

    const linkUrl = url || text;
    if (!linkUrl.match(URL_REGEX)) {
      console.warn("No valid URL found in shared data.");
      return;
    }
    const { success, slotName } = saveUrlToCurrentTimeSlot({ title: text || url, url: linkUrl }, setAllShareLinks, t);
    if(success) {
        toast({ 
            title: t.shareTarget.linkSavedToastTitle,
            description: t.shareTarget.linkSavedToastDescription(slotName),
            duration: 3000,
        });
    }
  }, [toast, t, setAllShareLinks]);

  const checkClipboard = useCallback(async () => {
    if (document.hidden) return;

    try {
        if (typeof navigator?.permissions?.query !== 'function') {
            return;
        }
        const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
        if (permission.state === 'denied') {
            return;
        }
        
        const text = await navigator.clipboard.readText();
        if (!text || text.trim() === '' || text === lastProcessedClipboardText) {
            return;
        }
        
        const urlMatches = text.match(URL_REGEX);
        const url = urlMatches ? urlMatches[0] : null;

        if (!url) { // New filtering logic
            return;
        }

        if (isUrlAlreadySaved(url, allShareLinks)) {
            setLastProcessedClipboardText(text); // Mark as processed to prevent re-triggering
            return; 
        }

        setClipboardContent(text);
        setIsClipboardModalOpen(true);

    } catch (err: any) {
        if (err.name !== 'NotAllowedError' && !err.message.includes('Document is not focused')) {
           console.error(t.clipboard.checkClipboardError, err);
        }
    }
  }, [lastProcessedClipboardText, t.clipboard.checkClipboardError, allShareLinks, t.shareTarget, toast]);


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
    setCurrentYear(today.getFullYear());

    const loadData = () => {
        try {
            setNotes(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_NOTES) || '{}'));
            setRatings(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RATINGS) || '{}'));
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
    
    const sharedDataString = localStorage.getItem(LOCAL_STORAGE_KEY_SHARE_TARGET);
    if (sharedDataString) {
      try {
        const parsedData = JSON.parse(sharedDataString);
        handleSaveShareLinkFromPWA(parsedData);
        localStorage.removeItem(LOCAL_STORAGE_KEY_SHARE_TARGET);
      } catch (e) {
          console.error("Failed to parse or save shared data", e);
          localStorage.removeItem(LOCAL_STORAGE_KEY_SHARE_TARGET);
      }
    }
  }, [clearTimeoutIfNecessary, handleSaveShareLinkFromPWA]);

  // Effect to check clipboard on focus
   useEffect(() => {
        window.addEventListener('focus', checkClipboard);
        return () => {
            window.removeEventListener('focus', checkClipboard);
        };
  }, [checkClipboard]);

  const handleSaveFromClipboard = () => {
    if (!clipboardContent) return;
    
    const urlMatches = clipboardContent.match(URL_REGEX);
    const url = urlMatches ? urlMatches[0] : '';

    if (url && isUrlAlreadySaved(url, allShareLinks)) {
        toast({
            title: t.clipboard.linkAlreadyExists,
            variant: "default",
            duration: 3000,
        });
        setLastProcessedClipboardText(clipboardContent);
        setIsClipboardModalOpen(false);
        return;
    }
    
    const title = url ? clipboardContent.replace(url, '').trim() : clipboardContent;

    const itemToSave = {
        title: title || url,
        url: url
    };

    const { success, slotName } = saveUrlToCurrentTimeSlot(itemToSave, setAllShareLinks, t);
    if (success) {
      toast({
        title: t.clipboard.linkSavedToastTitle,
        description: t.clipboard.linkSavedToastDescription(slotName),
        duration: 3000,
      });
      try {
        copy('');
      } catch (error) {
        console.warn("Could not clear clipboard.", error);
      }
    }
    setLastProcessedClipboardText(clipboardContent);
    setIsClipboardModalOpen(false);
  };
  
  const handleCloseClipboardModal = () => {
    setIsClipboardModalOpen(false);
  };


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
    const dateKey = getDateKey(date);
    
    if (data.notes[dateKey]?.trim()) return true;
    if (data.ratings[dateKey]) return true; 
    if (data.allDailyNotes[dateKey]?.trim()) return true;

    const checkSlotItems = (items: Record<string, any[]> | undefined) => 
        items && Object.values(items).some(slotItems => slotItems.length > 0);

    if (checkSlotItems(data.allTodos[dateKey])) return true;
    if (checkSlotItems(data.allMeetingNotes[dateKey])) return true;
    if (checkSlotItems(data.allShareLinks[dateKey])) return true;
    if (checkSlotItems(data.allReflections[dateKey])) return true;

    return false;
  }, []); 

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

  const handleDaySelect = useCallback((dayNameForUrl: string, dateForDetail: Date) => {
    clearTimeoutIfNecessary();
    setHoverPreviewData(null);
    isPreviewSuppressedByClickRef.current = true;
    const dateKeyForDetail = getDateKey(dateForDetail);
    router.push(`/day/${encodeURIComponent(dayNameForUrl)}?date=${dateKeyForDetail}`);
  }, [router, clearTimeoutIfNecessary]);

  const handleRatingChange = useCallback((dateKey: string, newRating: RatingType) => {
    setRatings(prev => {
      const updated = { ...prev, [dateKey]: newRating };
      if (typeof window !== 'undefined') localStorage.setItem(LOCAL_STORAGE_KEY_RATINGS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleWeeklySummaryClick = () => {
    if (!displayedDate) return;
    const weekStartKey = getDateKey(currentDisplayedWeekStart);
    router.push(`/weekly-summary?weekStart=${weekStartKey}`);
  };

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
            return; 
        }
        if (isBefore(currentWeekStartDate, firstEverWeekWithDataStart) ) {
            if (weekHasContent(firstEverWeekWithDataStart, allLoadedDataMemo)){
                 setDisplayedDate(new Date(firstEverWeekWithDataStart));
            }
            return;
        }
    } else {
      return;
    }
    
    const potentialPrevWeekStartDate = subWeeks(currentWeekStartDate, 1);

    if (firstEverWeekWithDataStart && isBefore(potentialPrevWeekStartDate, firstEverWeekWithDataStart)) {
        if (weekHasContent(firstEverWeekWithDataStart, allLoadedDataMemo)){
           setDisplayedDate(new Date(firstEverWeekWithDataStart));
        } 
        return;
    }
    
    if (weekHasContent(potentialPrevWeekStartDate, allLoadedDataMemo)) {
      setDisplayedDate(potentialPrevWeekStartDate);
    }
  };


  const handleNextWeek = () => {
    if (isViewingActualCurrentWeek || !displayedDate || !systemToday) return; 
    const nextWeekCandidate = addDays(displayedDate, 7);
    if (isAfter(startOfWeek(nextWeekCandidate, { weekStartsOn: 1, locale: dateLocale }), startOfWeek(systemToday, { weekStartsOn: 1, locale: dateLocale }))) {
        setDisplayedDate(new Date(systemToday));
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
        setIsCalendarOpen(false); 
        return; 
      }
      setDisplayedDate(date);
      setIsCalendarOpen(false);
    }
  };
  
  const isPreviousWeekDisabled = useMemo(() => {
    if (!allDataLoaded || !displayedDate) return true;
    if (!firstEverWeekWithDataStart) return true; 

    const currentDisplayedWeekStartDate = startOfWeek(displayedDate, { weekStartsOn: 1, locale: dateLocale });
    
    if (isSameDay(currentDisplayedWeekStartDate, firstEverWeekWithDataStart)) {
        return true;
    }

    let tempDate = subWeeks(currentDisplayedWeekStartDate, 1);
    while(isAfter(tempDate, firstEverWeekWithDataStart) || isSameDay(tempDate, firstEverWeekWithDataStart)) {
        if(weekHasContent(tempDate, allLoadedDataMemo)) {
            return false;
        }
        if(isSameDay(tempDate, firstEverWeekWithDataStart)) break; 
        tempDate = subWeeks(tempDate, 1);
        if (isBefore(tempDate, firstEverWeekWithDataStart) && !isSameDay(tempDate, firstEverWeekWithDataStart)) break;
    }
    
    return true; 
  }, [allDataLoaded, displayedDate, firstEverWeekWithDataStart, dateLocale, weekHasContent, allLoadedDataMemo]);

  const isNextWeekDisabled = useMemo(() => {
    if (!displayedDate || !systemToday) return true;
    return isSameWeek(displayedDate, systemToday, { weekStartsOn: 1, locale: dateLocale });
  }, [displayedDate, systemToday, dateLocale]);


  const calendarDisabledMatcher = useCallback((date: Date) => {
    if (!allDataLoaded || !systemToday) return true; 
    
    if (isAfter(date, systemToday) && !isSameDay(date, systemToday)) {
        return true;
    }

    if (firstEverWeekWithDataStart && isBefore(startOfWeek(date, { weekStartsOn: 1, locale: dateLocale }), firstEverWeekWithDataStart)) {
        return true;
    }
    
    if (firstEverWeekWithDataStart && isSameWeek(date, firstEverWeekWithDataStart, {weekStartsOn: 1, locale: dateLocale})) {
        return !weekHasContent(firstEverWeekWithDataStart, allLoadedDataMemo);
    }

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
    <>
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
                      <Button variant="outline" size="sm" className="w-[240px] sm:w-[320px] justify-start text-left font-normal" aria-label={t.jumpToWeek}>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-8 w-full max-w-4xl place-items-center mb-12 sm:mb-16">
          {daysToDisplay.map((dateInWeek) => {
            const dayNameForDisplay = format(dateInWeek, 'EEEE', { locale: dateLocale });
            const dateKeyForStorage = getDateKey(dateInWeek);
            
            const currentSystemTodayToUse = systemToday; 
            const isCurrentActualDay = currentSystemTodayToUse ? isSameDay(dateInWeek, currentSystemTodayToUse) : false;
            const isPastActualDay = currentSystemTodayToUse ? (isBefore(dateInWeek, currentSystemTodayToUse) && !isSameDay(dateInWeek, currentSystemTodayToUse)) : false;
            const isFutureActualDay = currentSystemTodayToUse ? (!isCurrentActualDay && !isPastActualDay) : false;
            
            const noteForThisDayBox = notes[dateKeyForStorage] || '';
            const ratingForThisDayBox = ratings[dateKeyForStorage] || null;
            const hasAnyDataForThisDay = dayHasContent(dateInWeek, allLoadedDataMemo);

            return (
              <DayBox
                key={dateKeyForStorage} // Use unique dateKey as key
                dayName={dayNameForDisplay}
                onClick={() => handleDaySelect(dayNameForDisplay, dateInWeek)}
                notes={noteForThisDayBox} 
                dayHasAnyData={hasAnyDataForThisDay}
                rating={ratingForThisDayBox}
                onRatingChange={(newRating) => handleRatingChange(dateKeyForStorage, newRating)}
                isCurrentDay={isCurrentActualDay}
                isPastDay={isPastActualDay}
                isFutureDay={isFutureActualDay}
                isAfter6PMToday={isAfter6PMToday} 
                todayLabel={t.todayPrefix}
                selectDayLabel={t.selectDayAria(dayNameForDisplay)}
                contentIndicatorLabel={t.hasNotesAria}
                ratingUiLabels={t.ratingLabels}
                onHoverStart={handleDayHoverStart}
                onHoverEnd={handleDayHoverEnd}
                imageHint="activity memory"
              />
            );
          })}
          <Card 
            className="w-full h-44 sm:w-40 sm:h-48 flex flex-col rounded-xl border-2 border-transparent hover:border-accent/70 bg-card shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer"
            onClick={handleWeeklySummaryClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleWeeklySummaryClick(); }}
            role="button"
            tabIndex={0}
            aria-label={t.weeklySummaryPlaceholder}
          >
            <CardHeader className="p-2 pb-1 text-center">
              <CardTitle className="text-lg sm:text-xl font-medium text-foreground">{t.weeklySummaryTitle}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex-grow flex flex-col items-center justify-center">
              <BarChart className="w-12 h-12 text-primary/80 mb-2" />
              <p className="text-xs text-center text-muted-foreground">{t.weeklySummaryPlaceholder}</p>
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
                <a href="#" aria-label={t.wechatAria} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  <MessageSquare className="h-4 w-4" />
                </a>
                <a href="#" aria-label={t.emailAria} className="text-xs text-muted-foreground hover:text-primary transition-colors">Email</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
      <ClipboardModal
        isOpen={isClipboardModalOpen}
        onClose={handleCloseClipboardModal}
        onSave={handleSaveFromClipboard}
        content={clipboardContent}
        translations={t.clipboard}
      />
    </>
  );
}

    

    