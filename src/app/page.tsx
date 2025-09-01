
"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DayBox } from '@/components/DayBox';
import { DayHoverPreview } from '@/components/DayHoverPreview';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, subWeeks, isSameWeek, isAfter, parseISO } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { ClipboardModal } from '@/components/ClipboardModal';
import { QuickAddTodoModal } from '@/components/QuickAddTodoModal';
import copy from 'copy-to-clipboard';
import { MainHeader } from '@/components/page/MainHeader';
import { WeekNavigator } from '@/components/page/WeekNavigator';
import { FeatureGrid } from '@/components/page/FeatureGrid';
import { PageFooter } from '@/components/page/PageFooter';
import { DaysGrid } from '@/components/page/DaysGrid';
import type { AllLoadedData, RatingType, ShareLinkItem, ReceivedShareData, HoverPreviewData, LanguageKey, Theme } from '@/lib/page-types';

// Local storage keys
const LOCAL_STORAGE_KEY_RATINGS = 'weekGlanceRatings_v2';
const LOCAL_STORAGE_KEY_THEME = 'weekGlanceTheme';
const LOCAL_STORAGE_KEY_SHARE_TARGET = 'weekGlanceShareTarget_v1';
const LOCAL_STORAGE_KEY_ALL_TODOS = 'allWeekTodos_v2';
const LOCAL_STORAGE_KEY_ALL_MEETING_NOTES = 'allWeekMeetingNotes_v2';
const LOCAL_STORAGE_KEY_ALL_SHARE_LINKS = 'allWeekShareLinks_v2';
const LOCAL_STORAGE_KEY_ALL_REFLECTIONS = 'allWeekReflections_v2';
const LOCAL_STORAGE_KEY_ALL_DAILY_NOTES = 'allWeekDailyNotes_v2';


const SHOW_PREVIEW_DELAY = 2000;
const HIDE_PREVIEW_DELAY = 200;
const URL_REGEX = /(https?:\/\/[^\s$.?#].[^\s]*)/i;

const getDateKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
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

const translations = {
  'zh-CN': {
    pageTitle: 'Week Glance',
    pageSubtitle: '规划你的一周，一日一览。',
    languageButtonText: '语言选择',
    themeButtonText: '切换主题',
    settingsMenuTitle: '设置',
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
    emailAria: '发送反馈邮件',
    donateAria: '捐赠',
    copyrightText: (year: number, appName: string) => `© ${year} ${appName}`,
    mitLicenseLinkText: '本站依据 MIT 许可证发行',
    mitLicenseLinkAria: '查看 MIT 许可证详情',
    featureHub: '功能中心',
    restButtonText: '休息一下',
    healthButtonText: '健康一下',
    techButtonText: '科技一下',
    richButtonText: '富豪一下',
    studyButtonText: '学习一下',
    organizeButtonText: '整理一下',
    workplaceButtonText: '职场一下',
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
        categoryLabel: "标签 (可选):",
        categoryPlaceholder: "例如：学习资料, 食谱",
    },
    quickAddTodo: {
      modalTitle: "快速添加事项",
      modalDescription: "输入您的事项并选择一个日期。",
      todoPlaceholder: "例如：下午3点和张三开会...",
      dateLabel: "日期",
      completedLabel: "标记为已完成",
      saveButton: "保存事项",
      cancelButton: "取消",
      successToast: "事项已添加！"
    },
    pasteFromClipboard: "从剪贴板粘贴",
     timeIntervals: {
        midnight: '凌晨',
        earlyMorning: '清晨',
        morning: '上午',
        noon: '中午',
        afternoon: '下午',
        evening: '晚上',
    },
  },
  'en': {
    pageTitle: 'Week Glance',
    pageSubtitle: 'Plan your week, one day at a glance.',
    languageButtonText: 'Language',
    themeButtonText: 'Toggle Theme',
    settingsMenuTitle: 'Settings',
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
    emailAria: 'Send Feedback Email',
    donateAria: 'Donate',
    copyrightText: (year: number, appName: string) => `© ${year} ${appName}`,
    mitLicenseLinkText: 'Released under the MIT License',
    mitLicenseLinkAria: 'View MIT License details',
    featureHub: 'Feature Hub',
    restButtonText: 'Take a Break',
    healthButtonText: 'Get Healthy',
    techButtonText: 'Tech Time',
    richButtonText: 'Rich Time',
    studyButtonText: 'Study Time',
    organizeButtonText: 'Get Organized',
    workplaceButtonText: 'Workplace',
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
        categoryLabel: "Tag (optional):",
        categoryPlaceholder: "e.g. Study, Recipe",
    },
    quickAddTodo: {
      modalTitle: "Quick Add Item",
      modalDescription: "Enter your item and select a date.",
      todoPlaceholder: "e.g., Meeting with John at 3 PM...",
      dateLabel: "Date",
      completedLabel: "Mark as completed",
      saveButton: "Save Item",
      cancelButton: "Cancel",
      successToast: "Item added!"
    },
    pasteFromClipboard: "Paste from clipboard",
     timeIntervals: {
        midnight: 'Midnight',
        earlyMorning: 'Early Morning',
        morning: 'Morning',
        noon: 'Noon',
        afternoon: 'Afternoon',
        evening: 'Evening',
    },
  }
};

export default function WeekGlancePage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN'); 
  const [theme, setTheme] = useState<Theme>('light'); 
  const [systemToday, setSystemToday] = useState<Date | null>(null);
  const [displayedDate, setDisplayedDate] = useState<Date | null>(null); 
  const [isAfter6PMToday, setIsAfter6PMToday] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);
  
  const [allLoadedData, setAllLoadedData] = useState<AllLoadedData | null>(null);
  
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

  const saveUrlToCurrentTimeSlot = useCallback((
      item: { title: string, url: string, category: string | null },
  ): { success: boolean; slotName: string } => {
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
          midnight: '(00:00 - 05:00)',
          earlyMorning: '(05:00 - 09:00)',
          morning: '(09:00 - 12:00)',
          noon: '(12:00 - 14:00)',
          afternoon: '(14:00 - 18:00)',
          evening: '(18:00 - 24:00)',
      };
      
      const targetIntervalLabel = intervalLabels[targetIntervalName];

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
          setAllLoadedData(prev => prev ? { ...prev, allShareLinks: newAllLinks } : null);
          
          return { success: true, slotName: t.timeIntervals[targetIntervalName as keyof typeof t.timeIntervals] };
      } catch(e) {
          console.error("Failed to save link to localStorage", e);
          return { success: false, slotName: '' };
      }
  }, [t.timeIntervals]);

  const handleSaveShareLinkFromPWA = useCallback((shareData: ReceivedShareData) => {
    if (!shareData) return;
    const { text, url } = shareData;

    const linkUrl = url || text;
    if (!linkUrl.match(URL_REGEX)) {
      console.warn("No valid URL found in shared data.");
      return;
    }
    const { success, slotName } = saveUrlToCurrentTimeSlot({ title: text || url, url: linkUrl, category: null });
    if(success) {
        toast({ 
            title: t.shareTarget.linkSavedToastTitle,
            description: t.shareTarget.linkSavedToastDescription(slotName),
            duration: 3000,
        });
    }
  }, [toast, t.shareTarget, saveUrlToCurrentTimeSlot]);

  const checkClipboard = useCallback(async () => {
    if (document.hidden || !allLoadedData) return;

    try {
        if (typeof navigator?.permissions?.query !== 'function') {
            return;
        }
        const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
        if (permission.state === 'denied') {
            return;
        }
        
        const text = await navigator.clipboard.readText();
        
        if (!text || text.trim() === '') return;
        const urlMatches = text.match(URL_REGEX);
        if (!urlMatches) return;
        if (text === lastProcessedClipboardText) return; 
        if (isUrlAlreadySaved(urlMatches[0], allLoadedData.allShareLinks)) {
            setLastProcessedClipboardText(text); 
            return; 
        }

        setClipboardContent(text);
        setIsClipboardModalOpen(true);

    } catch (err: any) {
        if (err.name !== 'NotAllowedError' && !err.message.includes('Document is not focused')) {
           console.error(t.clipboard.checkClipboardError, err);
        }
    }
  }, [lastProcessedClipboardText, t.clipboard.checkClipboardError, allLoadedData]);

  const loadAllDataFromStorage = useCallback(() => {
    try {
        setAllLoadedData({
            ratings: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RATINGS) || '{}'),
            allDailyNotes: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_DAILY_NOTES) || '{}'),
            allTodos: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_TODOS) || '{}'),
            allMeetingNotes: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_MEETING_NOTES) || '{}'),
            allShareLinks: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_SHARE_LINKS) || '{}'),
            allReflections: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_REFLECTIONS) || '{}'),
        });
    } catch (e) {
        console.error("Error loading data from localStorage", e);
        setAllLoadedData({
            ratings: {}, allDailyNotes: {}, allTodos: {}, allMeetingNotes: {}, allShareLinks: {}, allReflections: {}
        });
    }
  }, []);

  useEffect(() => {
    setIsClientMounted(true);
    
    const today = new Date();
    setSystemToday(today);
    setDisplayedDate(today);
    setIsAfter6PMToday(isAfter(today, new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0)));

    const browserLang: LanguageKey = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    setCurrentLanguage(browserLang);
    if (typeof document !== 'undefined') document.documentElement.lang = browserLang;
    
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY_THEME) as Theme | null : null;
    const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    setTheme(storedTheme || (systemPrefersDark ? 'dark' : 'light'));
    
    loadAllDataFromStorage();
    
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
  }, [loadAllDataFromStorage, handleSaveShareLinkFromPWA]);

   useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                const activeElement = document.activeElement;
                const isInputFocused = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement || (activeElement as HTMLElement)?.isContentEditable;
                if (!isInputFocused) {
                    event.preventDefault();
                    setIsQuickAddModalOpen(true);
                }
            }
        };

        window.addEventListener('focus', checkClipboard);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('focus', checkClipboard);
            window.removeEventListener('keydown', handleKeyDown);
        };
  }, [checkClipboard]);

  const handleSaveFromClipboard = (data: { category: string }) => {
    if (!clipboardContent) return;
    
    const urlMatches = clipboardContent.match(URL_REGEX);
    const url = urlMatches ? urlMatches[0] : '';

    if (url && allLoadedData && isUrlAlreadySaved(url, allLoadedData.allShareLinks)) {
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

    const { success, slotName } = saveUrlToCurrentTimeSlot({ title: title || url, url: url, category: data.category || null });
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
    setLastProcessedClipboardText(clipboardContent);
    setIsClipboardModalOpen(false);
  };

  const handleSaveQuickAddTodo = ({ text, date, completed }: { text: string; date: Date; completed: boolean; }) => {
    const newTodo = {
      id: Date.now().toString(), text, completed, category: null, deadline: null, importance: null,
    };
    
    const dateKey = getDateKey(date);
    let slotKey = 'all-day';
    
    if (isSameDay(date, new Date())) {
        const now = new Date();
        const currentHour = now.getHours();
        const timeIntervals: Record<string, string> = {
            midnight: '(00:00 - 05:00)', earlyMorning: '(05:00 - 09:00)', morning: '(09:00 - 12:00)',
            noon: '(12:00 - 14:00)', afternoon: '(14:00 - 18:00)', evening: '(18:00 - 24:00)',
        };
        let targetIntervalName = Object.keys(timeIntervals).find(key => {
            const match = timeIntervals[key].match(/\((\d{2}):\d{2}\s*-\s*(\d{2}):\d{2}\)/);
            if (!match) return false;
            const startH = parseInt(match[1]);
            let endH = parseInt(match[2]);
            if (endH === 0) endH = 24;
            return currentHour >= startH && currentHour < endH;
        }) || 'evening';
        
        const hourlySlots = (() => {
            const match = timeIntervals[targetIntervalName].match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
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

        if (hourlySlots.length > 0) {
            slotKey = hourlySlots.find(slot => {
                const match = slot.match(/(\d{2}):\d{2}\s*-\s*(\d{2}):\d{2}/);
                if (match) {
                    const startH = parseInt(match[1]);
                    let endH = parseInt(match[2]);
                    if (endH === 0) endH = 24;
                    return currentHour >= startH && currentHour < endH;
                }
                return false;
            }) || hourlySlots[0];
        }
    }
    
    setAllLoadedData(prevData => {
        if (!prevData) return prevData;
        const newAllTodos = JSON.parse(JSON.stringify(prevData.allTodos));
        const dayTodos = newAllTodos[dateKey] || {};
        const slotTodos = dayTodos[slotKey] || [];
        dayTodos[slotKey] = [...slotTodos, newTodo];
        newAllTodos[dateKey] = dayTodos;
        localStorage.setItem(LOCAL_STORAGE_KEY_ALL_TODOS, JSON.stringify(newAllTodos));
        return { ...prevData, allTodos: newAllTodos };
    });

    toast({ title: t.quickAddTodo.successToast, duration: 3000 });
    setIsQuickAddModalOpen(false);
  };


  useEffect(() => {
    if (isClientMounted) {
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      if (typeof window !== 'undefined') localStorage.setItem(LOCAL_STORAGE_KEY_THEME, theme);
    }
  }, [theme, isClientMounted]);
  
  const eventfulDays = useMemo(() => {
    if (!allLoadedData) return [];
    const allDataKeys = new Set([
        ...Object.keys(allLoadedData.ratings),
        ...Object.keys(allLoadedData.allDailyNotes),
        ...Object.keys(allLoadedData.allTodos),
        ...Object.keys(allLoadedData.allMeetingNotes),
        ...Object.keys(allLoadedData.allShareLinks),
        ...Object.keys(allLoadedData.allReflections),
    ]);
    return Array.from(allDataKeys).filter(key => key.match(/^\d{4}-\d{2}-\d{2}$/)).sort();
  }, [allLoadedData]);

  const daysToDisplay = useMemo(() => {
    if (!displayedDate) return [];
    const start = startOfWeek(displayedDate, { weekStartsOn: 1, locale: dateLocale });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [displayedDate, dateLocale]);
  
  const handleDaySelect = useCallback((dayNameForUrl: string, dateForDetail: Date) => {
    clearTimeoutIfNecessary();
    setHoverPreviewData(null);
    isPreviewSuppressedByClickRef.current = true;
    const dateKeyForDetail = getDateKey(dateForDetail);
    router.push(`/day/${encodeURIComponent(dayNameForUrl)}?date=${dateKeyForDetail}&eventfulDays=${eventfulDays.join(',')}`);
  }, [router, clearTimeoutIfNecessary, eventfulDays]);

  const handleRatingChange = useCallback((dateKey: string, newRating: RatingType) => {
    setAllLoadedData(prev => {
        if (!prev) return null;
        const updatedRatings = { ...prev.ratings, [dateKey]: newRating };
        localStorage.setItem(LOCAL_STORAGE_KEY_RATINGS, JSON.stringify(updatedRatings));
        return { ...prev, ratings: updatedRatings };
    });
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

  if (!isClientMounted || !systemToday || !displayedDate || !allLoadedData) {
    return (
      <main className="flex flex-col items-center min-h-screen bg-background text-foreground py-10 sm:py-16 px-4">
        <div className="text-center p-10">Loading week data...</div>
      </main>
    );
  }

  return (
    <>
      <main className="flex flex-col items-center min-h-screen bg-background text-foreground py-10 sm:py-16 px-4">
        <MainHeader 
            translations={t}
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            theme={theme}
            onThemeChange={setTheme}
        />
        
        <WeekNavigator
            translations={t}
            dateLocale={dateLocale}
            displayedDate={displayedDate}
            setDisplayedDate={setDisplayedDate}
            systemToday={systemToday}
            eventfulDays={eventfulDays}
        />
        
        <DaysGrid
            daysToDisplay={daysToDisplay}
            dateLocale={dateLocale}
            systemToday={systemToday}
            allLoadedData={allLoadedData}
            isAfter6PMToday={isAfter6PMToday}
            translations={t}
            onDaySelect={handleDaySelect}
            onRatingChange={handleRatingChange}
            onHoverStart={handleDayHoverStart}
            onHoverEnd={handleDayHoverEnd}
        />

        <div className="hidden md:block w-full max-w-sm">
            <FeatureGrid 
                translations={t} 
                router={router}
            />
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

        <PageFooter translations={t} currentYear={systemToday.getFullYear()} />
      </main>

      <div className="md:hidden">
          <FeatureGrid 
              translations={t} 
              router={router}
          />
      </div>

      <ClipboardModal
        isOpen={isClipboardModalOpen}
        onClose={handleCloseClipboardModal}
        onSave={handleSaveFromClipboard}
        content={clipboardContent}
        translations={t.clipboard}
      />
      <QuickAddTodoModal
        isOpen={isQuickAddModalOpen}
        onClose={() => setIsQuickAddModalOpen(false)}
        onSave={handleSaveQuickAddTodo}
        weekDays={daysToDisplay.filter(day => isSameDay(day, systemToday) || isAfter(day, systemToday))}
        translations={t.quickAddTodo}
        dateLocale={dateLocale}
      />
    </>
  );
}
