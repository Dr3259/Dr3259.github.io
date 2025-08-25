
"use client";

import { useState, useEffect, useCallback, useRef, useMemo, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { DayBox } from '@/components/DayBox';
import { DayHoverPreview } from '@/components/DayHoverPreview';
import { Button } from "@/components/ui/button";
import { Languages, Sun, Moon, PauseCircle, ChevronLeft, ChevronRight, CalendarDays, Undo, BarChart, Settings, Check, Mail, MessageCircle, Coffee, HeartPulse, Cpu, Gem, LayoutGrid } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, startOfWeek, endOfWeek, isSameDay, subDays, isSameWeek, subWeeks, isBefore, startOfMonth, type Locale, isAfter, differenceInDays } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { ClipboardModal } from '@/components/ClipboardModal';
import { QuickAddTodoModal } from '@/components/QuickAddTodoModal';
import copy from 'copy-to-clipboard';
import Image from 'next/image';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';


// Types from DayDetailPage - needed for checking content
type CategoryType = 'work' | 'study' | 'shopping' | 'organizing' | 'relaxing' | 'cooking' | 'childcare' | 'dating';
interface TodoItem {
  id: string; text: string; completed: boolean; category: CategoryType | null;
  deadline: 'hour' | 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'nextMonth' | null;
  importance: 'important' | 'notImportant' | null;
}
interface MeetingNoteItem { id: string; title: string; notes: string; attendees: string; actionItems: string; }
interface ShareLinkItem { id: string; url: string; title: string; category: string | null; }
interface ReflectionItem { id: string; text: string; }

type RatingType = 'excellent' | 'terrible' | 'average' | null;

const LOCAL_STORAGE_KEY_NOTES = 'weekGlanceNotes_v2'; // Changed key for new structure
const LOCAL_STORAGE_KEY_RATINGS = 'weekGlanceRatings_v2'; // Changed key for new structure
const LOCAL_STORAGE_KEY_SUMMARY = 'weekGlanceSummary_v2'; // Changed key for new structure
const LOCAL_STORAGE_KEY_THEME = 'weekGlanceTheme';
const LOCAL_STORAGE_KEY_SHARE_TARGET = 'weekGlanceShareTarget_v1';
const LOCAL_STORAGE_KEY_FEATURE_ORDER = 'weekGlanceFeatureOrder_v1';


// Keys used by DayDetailPage for its data, now structured with YYYY-MM-DD keys
const LOCAL_STORAGE_KEY_ALL_DAILY_NOTES = 'allWeekDailyNotes_v2';
const LOCAL_STORAGE_KEY_ALL_TODOS = 'allWeekTodos_v2';
const LOCAL_STORAGE_KEY_ALL_MEETING_NOTES = 'allWeekMeetingNotes_v2';
const LOCAL_STORAGE_KEY_ALL_SHARE_LINKS = 'allWeekShareLinks_v2';
const LOCAL_STORAGE_KEY_ALL_REFLECTIONS = 'allWeekReflections_v2';


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
    featureHub: '功能中心',
    restButtonText: 'Take a Break',
    healthButtonText: 'Get Healthy',
    techButtonText: 'Tech Time',
    richButtonText: 'Rich Time',
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
    item: { title: string, url: string, category: string | null },
    setAllShareLinks: React.Dispatch<React.SetStateAction<Record<string, Record<string, ShareLinkItem[]>>>>,
    t: (typeof translations)['zh-CN']
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

    const timeIntervals = {
        midnight: '(00:00 - 05:00)',
        earlyMorning: '(05:00 - 09:00)',
        morning: '(09:00 - 12:00)',
        noon: '(12:00 - 14:00)',
        afternoon: '(14:00 - 18:00)',
        evening: '(18:00 - 24:00)',
    };
    
    let targetIntervalName = 'evening';
    if (currentHour < 5) targetIntervalName = 'midnight';
    else if (currentHour < 9) targetIntervalName = 'earlyMorning';
    else if (currentHour < 12) targetIntervalName = 'morning';
    else if (currentHour < 14) targetIntervalName = 'noon';
    else if (currentHour < 18) targetIntervalName = 'afternoon';
    
    const targetIntervalLabel = timeIntervals[targetIntervalName as keyof typeof timeIntervals];

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
        
        return { success: true, slotName: t.timeIntervals[targetIntervalName as keyof typeof t.timeIntervals] };
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

interface FeatureButtonProps {
    icon: React.ElementType;
    title: string;
    onClick: () => void;
    onDragStart: (e: DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: DragEvent<HTMLDivElement>) => void;
    onDrop: (e: DragEvent<HTMLDivElement>) => void;
    onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
    isDraggedOver: boolean;
}

const FeatureButton: React.FC<FeatureButtonProps> = ({ icon: Icon, title, onClick, onDragStart, onDragOver, onDrop, onDragEnd, isDraggedOver }) => (
    <button
        onClick={onClick}
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        className={cn(
            "flex flex-col items-center justify-center p-3 rounded-lg hover:bg-muted transition-colors w-full group gap-2 cursor-grab active:cursor-grabbing",
            isDraggedOver && "bg-primary/20 ring-2 ring-primary"
        )}
    >
        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
        </div>
        <p className="text-xs font-medium text-center text-foreground">{title}</p>
    </button>
);


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
  
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);

  const showPreviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hidePreviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPreviewSuppressedByClickRef = useRef(false);

  const t = translations[currentLanguage];
  const dateLocale = currentLanguage === 'zh-CN' ? zhCN : enUS;

  // --- Feature Hub Drag & Drop State ---
  const [featureOrder, setFeatureOrder] = useState<string[]>(['tech', 'rich', 'health', 'rest']);
  const draggedFeature = useRef<string | null>(null);
  const [draggedOverFeature, setDraggedOverFeature] = useState<string | null>(null);

  const handleRestButtonClick = () => router.push('/rest');
  const handleHealthButtonClick = () => router.push('/health');
  const handleTechButtonClick = () => router.push('/tech');
  const handleRichButtonClick = () => router.push('/rich');

  const allFeatures = useMemo(() => ({
    tech: { id: 'tech', icon: Cpu, title: t.techButtonText, onClick: handleTechButtonClick },
    rich: { id: 'rich', icon: Gem, title: t.richButtonText, onClick: handleRichButtonClick },
    health: { id: 'health', icon: HeartPulse, title: t.healthButtonText, onClick: handleHealthButtonClick },
    rest: { id: 'rest', icon: PauseCircle, title: t.restButtonText, onClick: handleRestButtonClick },
  }), [t]);

  const orderedFeatures = useMemo(() => featureOrder.map(id => allFeatures[id as keyof typeof allFeatures]).filter(Boolean), [featureOrder, allFeatures]);

  useEffect(() => {
    try {
        const savedOrder = localStorage.getItem(LOCAL_STORAGE_KEY_FEATURE_ORDER);
        if (savedOrder) {
            const parsedOrder = JSON.parse(savedOrder);
            // Validate that the saved order contains all expected keys
            const currentKeys = Object.keys(allFeatures);
            if (parsedOrder.length === currentKeys.length && parsedOrder.every((key: string) => currentKeys.includes(key))) {
                setFeatureOrder(parsedOrder);
            }
        }
    } catch(e) { console.error("Failed to load feature order from localStorage", e); }
  }, [allFeatures]);
  
  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    draggedFeature.current = id;
    e.dataTransfer.effectAllowed = "move";
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>, id: string) => {
      e.preventDefault();
      if (draggedFeature.current !== id) {
          setDraggedOverFeature(id);
      }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropTargetId: string) => {
    e.preventDefault();
    if (!draggedFeature.current || draggedFeature.current === dropTargetId) {
      setDraggedOverFeature(null);
      return;
    }

    const currentIndex = featureOrder.indexOf(draggedFeature.current);
    const targetIndex = featureOrder.indexOf(dropTargetId);

    const newOrder = [...featureOrder];
    const [removed] = newOrder.splice(currentIndex, 1);
    newOrder.splice(targetIndex, 0, removed);

    setFeatureOrder(newOrder);
    localStorage.setItem(LOCAL_STORAGE_KEY_FEATURE_ORDER, JSON.stringify(newOrder));
    
    draggedFeature.current = null;
    setDraggedOverFeature(null);
  };
  
  const handleDragEnd = () => {
    draggedFeature.current = null;
    setDraggedOverFeature(null);
  };

  // --- End of Drag & Drop Logic ---


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
    const { success, slotName } = saveUrlToCurrentTimeSlot({ title: text || url, url: linkUrl, category: null }, setAllShareLinks, t);
    if(success) {
        toast({ 
            title: t.shareTarget.linkSavedToastTitle,
            description: t.shareTarget.linkSavedToastDescription(slotName),
            duration: 3000,
        });
    }
  }, [toast, t]);

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
        
        if (!text || text.trim() === '') {
            return;
        }

        const urlMatches = text.match(URL_REGEX);
        const url = urlMatches ? urlMatches[0] : null;
        
        if (!url) {
            return;
        }

        if (text === lastProcessedClipboardText) {
            return;
        }
        
        if (isUrlAlreadySaved(url, allShareLinks)) {
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
  }, [lastProcessedClipboardText, t.clipboard.checkClipboardError, allShareLinks, t]);


  useEffect(() => {
    setIsClientMounted(true);
    
    // Set today's date and related states immediately
    const today = new Date();
    setSystemToday(today);
    setDisplayedDate(today);
    setCurrentYear(today.getFullYear());

    // Language setting
    const browserLang: LanguageKey = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    setCurrentLanguage(browserLang);
    if (typeof document !== 'undefined') document.documentElement.lang = browserLang;
    
    // Theme setting
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY_THEME) as Theme | null : null;
    const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    setTheme(storedTheme || (systemPrefersDark ? 'dark' : 'light'));
    
    // Load all data from localStorage
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
    
    // Handle PWA Share Target
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
  }, [handleSaveShareLinkFromPWA]);

  // Effect to check clipboard on focus and handle enter key
   useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                const activeElement = document.activeElement;
                const isInputFocused = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement || (activeElement as HTMLElement)?.isContentEditable;
                if (!isInputFocused) {
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
        url: url,
        category: data.category || null
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
    setLastProcessedClipboardText(clipboardContent); // Mark as handled even if closed
    setIsClipboardModalOpen(false);
  };

  const handleSaveQuickAddTodo = ({ text, date, completed }: { text: string; date: Date; completed: boolean; }) => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text: text,
      completed: completed,
      category: null,
      deadline: null,
      importance: null,
    };
    
    const dateKey = getDateKey(date);
    let slotKey = 'all-day';
    
    // If adding for today, find the current time slot
    if (isSameDay(date, new Date())) {
        const now = new Date();
        const currentHour = now.getHours();

        const timeIntervals = {
            midnight: '(00:00 - 05:00)',
            earlyMorning: '(05:00 - 09:00)',
            morning: '(09:00 - 12:00)',
            noon: '(12:00 - 14:00)',
            afternoon: '(14:00 - 18:00)',
            evening: '(18:00 - 24:00)',
        };
        
        let targetIntervalName = 'evening';
        if (currentHour < 5) targetIntervalName = 'midnight';
        else if (currentHour < 9) targetIntervalName = 'earlyMorning';
        else if (currentHour < 12) targetIntervalName = 'morning';
        else if (currentHour < 14) targetIntervalName = 'noon';
        else if (currentHour < 18) targetIntervalName = 'afternoon';

        const targetIntervalLabel = timeIntervals[targetIntervalName as keyof typeof timeIntervals];
        
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

        if (hourlySlots.length > 0) {
            const currentSlot = hourlySlots.find(slot => {
                const match = slot.match(/(\d{2}):\d{2}\s*-\s*(\d{2}):\d{2}/);
                if (match) {
                    const startH = parseInt(match[1]);
                    let endH = parseInt(match[2]);
                    if (endH === 0) endH = 24;
                    return currentHour >= startH && currentHour < endH;
                }
                return false;
            }) || hourlySlots[0];
            slotKey = currentSlot;
        }
    }


    setAllTodos(prevAllTodos => {
      const dayTodos = prevAllTodos[dateKey] || {};
      const slotTodos = dayTodos[slotKey] || [];
      const updatedSlotTodos = [...slotTodos, newTodo];
      const updatedDayTodos = { ...dayTodos, [slotKey]: updatedSlotTodos };
      const newAllTodos = { ...prevAllTodos, [dateKey]: updatedDayTodos };

      localStorage.setItem(LOCAL_STORAGE_KEY_ALL_TODOS, JSON.stringify(newAllTodos));
      return newAllTodos;
    });

    toast({
      title: t.quickAddTodo.successToast,
      duration: 3000
    });
    setIsQuickAddModalOpen(false);
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


  const setLanguage = (lang: LanguageKey) => {
    setCurrentLanguage(lang);
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
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
  
  const daysForQuickAdd = useMemo(() => {
      if (!systemToday) return [];
      const today = new Date(systemToday.setHours(0,0,0,0));
      return daysToDisplay.filter(day => isSameDay(day, today) || isAfter(day, today));
  }, [daysToDisplay, systemToday]);


  if (!isClientMounted || !systemToday || !displayedDate) {
    return (
      <main className="flex flex-col items-center min-h-screen bg-background text-foreground py-10 sm:py-16 px-4">
        <header className="mb-8 sm:mb-12 w-full max-w-4xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-headline font-light text-primary">{t.pageTitle}</h1>
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
            <h1 className="text-3xl sm:text-4xl font-headline font-light text-primary">{t.pageTitle}</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">{t.pageSubtitle}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <LayoutGrid className="h-4 w-4" />
                  <span className="sr-only">{t.featureHub}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div 
                    className="grid grid-cols-2 gap-2"
                    onDragEnd={handleDragEnd}
                >
                  {orderedFeatures.map((feature) => (
                    <FeatureButton 
                        key={feature.id} 
                        {...feature}
                        onDragStart={(e) => handleDragStart(e, feature.id)}
                        onDragOver={(e) => handleDragOver(e, feature.id)}
                        onDrop={(e) => handleDrop(e, feature.id)}
                        onDragEnd={handleDragEnd}
                        isDraggedOver={draggedOverFeature === feature.id}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">{t.settingsMenuTitle}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t.settingsMenuTitle}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <Languages className="mr-2 h-4 w-4" />
                            <span>{t.languageButtonText}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => setLanguage('zh-CN')}>
                                    {currentLanguage === 'zh-CN' && <Check className="mr-2 h-4 w-4" />}
                                    <span>中文</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setLanguage('en')}>
                                    {currentLanguage === 'en' && <Check className="mr-2 h-4 w-4" />}
                                    <span>English</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem onClick={toggleTheme}>
                        {theme === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                        <span>{t.themeButtonText}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 w-full max-w-4xl place-items-center mb-12 sm:mb-16">
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
                    <a href="mailto:your-email@example.com?subject=Week Glance User Feedback" className="hover:text-primary transition-colors" aria-label={t.emailAria}>
                      {t.mitLicenseLinkText}
                    </a>
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center space-x-4 mt-4 md:space-x-6 md:mt-0 md:order-2">
                <a href="https://github.com/Dr3259/Dr3259.github.io" target="_blank" rel="noopener noreferrer" aria-label={t.githubAria} className="text-muted-foreground hover:text-primary transition-colors">
                  <svg role="img" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                </a>
                <Popover>
                    <PopoverTrigger asChild>
                        <button aria-label={t.wechatAria} className="text-muted-foreground hover:text-primary transition-colors">
                            <MessageCircle className="h-5 w-5" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2">
                        <Image 
                            src="https://placehold.co/200x200.png"
                            width={200}
                            height={200}
                            alt="WeChat QR Code"
                            data-ai-hint="wechat qr code"
                            className="rounded-sm"
                        />
                    </PopoverContent>
                </Popover>
                <a href="mailto:your-email@example.com?subject=Week Glance User Feedback" aria-label={t.emailAria} className="text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
                <a href="#" aria-label={t.donateAria} className="text-muted-foreground hover:text-primary transition-colors">
                  <Coffee className="h-5 w-5" />
                </a>
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
      <QuickAddTodoModal
        isOpen={isQuickAddModalOpen}
        onClose={() => setIsQuickAddModalOpen(false)}
        onSave={handleSaveQuickAddTodo}
        weekDays={daysForQuickAdd}
        translations={t.quickAddTodo}
        dateLocale={dateLocale}
      />
    </>
  );
}
