
// src/app/day/[dayName]/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, ListChecks, ClipboardList, Link2 as LinkIconLucide, MessageSquareText,
    Briefcase, BookOpen, ShoppingCart, Archive, Coffee, ChefHat, Baby, CalendarClock,
    Hourglass, CalendarCheck, Sunrise, CalendarRange, ArrowRightToLine, CalendarPlus,
    Star as StarIcon, FileEdit, Trash2, Calendar as CalendarIcon, Smile, Meh, Frown,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { TodoModal, type TodoItem, type CategoryType } from '@/components/TodoModal';
import { MeetingNoteModal, type MeetingNoteItem, type MeetingNoteModalTranslations } from '@/components/MeetingNoteModal';
import { ShareLinkModal, type ShareLinkItem, type ShareLinkModalTranslations } from '@/components/ShareLinkModal';
import { ReflectionModal, type ReflectionItem, type ReflectionModalTranslations } from '@/components/ReflectionModal';
import { format, parseISO, isAfter as dateIsAfter, isBefore, addDays, subDays, isToday, isSameWeek } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { ClipboardModal } from '@/components/ClipboardModal';
import copy from 'copy-to-clipboard';
import { DailySummaryCard } from '@/components/page/day-view/DailySummaryCard';
import { TimeIntervalSection } from '@/components/page/day-view/TimeIntervalSection';

type RatingType = 'excellent' | 'terrible' | 'average' | null;

// Helper function to extract time range and generate hourly slots
export const generateHourlySlots = (intervalLabelWithTime: string): string[] => {
  const match = intervalLabelWithTime.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
  if (!match) {
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


const translations = {
  'zh-CN': {
    dayDetailsTitle: (dayName: string) => `${dayName} - 详情`,
    backToWeek: '返回周视图',
    notesLabel: '本日总结:',
    ratingLabel: '本日评价:',
    noData: '暂无数据',
    notesPlaceholder: '记录今天的总结...',
    summaryAvailableLater: '总结可在下午6点后填写。',
    allDayTasks: "全天事项",
    timeIntervalsTitle: (dayName: string) => `${dayName}规划`,
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
    addReflection: '添加个人心得',
    noItemsForHour: '暂无事项',
    editItem: '编辑事项',
    deleteItem: '删除事项',
    markComplete: '标记为已完成',
    markIncomplete: '标记为未完成',
    ratingUiLabels: {
      excellent: '好极了',
      average: '一般般',
      terrible: '糟透了',
    },
    todoModal: {
        modalTitle: (hourSlot: string) => `${hourSlot} - 待办事项`,
        modalDescription: '在此处添加、编辑或删除您的待办事项。',
        addItemPlaceholder: '输入新的待办事项...',
        categoryInputPlaceholder: '例如：处理邮件，购买牛奶 (可选)',
        addButton: '添加',
        updateButton: '更新',
        saveButton: '保存',
        noTodos: '还没有待办事项。',
        markComplete: '标记为已完成',
        markIncomplete: '标记为未完成',
        editTodo: '编辑待办事项',
        deleteTodo: '删除待办事项',
        categoryLabel: '性质:',
        deadlineLabel: '完成时间:',
        importanceLabel: '重要性:',
        selectPlaceholder: '请选择...',
        categories: {
            work: '工作',
            study: '学习',
            shopping: '购物',
            organizing: '整理',
            relaxing: '放松',
            cooking: '做饭',
            childcare: '带娃',
            dating: '约会',
        } as Record<CategoryType, string>,
        deadlines: {
            hour: '一小时内',
            today: '今天',
            tomorrow: '明天',
            thisWeek: '这周内',
            nextWeek: '下周内',
            nextMonth: '下月内',
        },
        importances: {
            important: '重要',
            notImportant: '不重要',
        }
    },
    meetingNotesSectionTitle: '会议记录',
    noMeetingNotesForHour: '此时间段暂无会议记录。',
    editMeetingNote: '编辑会议记录',
    deleteMeetingNote: '删除会议记录',
    meetingNoteModal: {
        modalTitleNew: '新会议记录',
        modalTitleEdit: (title: string) => `编辑: ${title || '会议记录'}`,
        modalDescription: '在此处记录您的会议详情。',
        titleLabel: '标题:',
        titlePlaceholder: '输入会议标题...',
        notesLabel: '笔记内容:',
        notesPlaceholder: '输入会议笔记...',
        attendeesLabel: '参与者 (可选):',
        attendeesPlaceholder: '例如: 张三, 李四',
        actionItemsLabel: '行动项 (可选):',
        actionItemsPlaceholder: '例如: 跟进市场部',
        saveButton: '保存记录',
        updateButton: '更新记录',
        cancelButton: '取消',
        deleteButton: '删除记录',
    } as MeetingNoteModalTranslations,
    shareLinkModal: {
        modalTitleNew: '新分享链接',
        modalTitleEdit: (titleOrUrl: string) => `编辑链接: ${titleOrUrl}`,
        modalDescription: '在此处添加、编辑或删除您的分享链接。',
        urlLabel: '链接 URL:',
        urlPlaceholder: 'https://example.com',
        titleLabel: '标题 (可选):',
        titlePlaceholder: '输入链接标题或描述...',
        categoryLabel: '标签 (可选):',
        categoryPlaceholder: '例如：学习，食谱',
        saveButton: '保存链接',
        updateButton: '更新链接',
        cancelButton: '取消',
        deleteButton: '删除链接',
    } as ShareLinkModalTranslations,
    linksSectionTitle: '分享链接',
    noLinksForHour: '此时间段暂无分享链接。',
    editLink: '编辑链接',
    deleteLink: '删除链接',
    reflectionModal: {
        modalTitleNew: '新个人心得',
        modalTitleEdit: '编辑心得',
        modalDescription: '在此处记录您的个人心得。',
        textLabel: '心得内容:',
        textPlaceholder: '输入您的心得体会...',
        saveButton: '保存心得',
        updateButton: '更新心得',
        cancelButton: '取消',
        deleteButton: '删除心得',
    } as ReflectionModalTranslations,
    reflectionsSectionTitle: '个人心得',
    noReflectionsForHour: '此时间段暂无个人心得。',
    editReflection: '编辑心得',
    deleteReflection: '删除心得',
    daysOfWeek: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
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
    timeIntervals: {
        midnight: '凌晨 (00:00 - 05:00)',
        earlyMorning: '清晨 (05:00 - 09:00)',
        morning: '上午 (09:00 - 12:00)',
        noon: '中午 (12:00 - 14:00)',
        afternoon: '下午 (14:00 - 18:00)',
        evening: '晚上 (18:00 - 24:00)',
    },
    previousDay: '上一个有内容的日子',
    nextDay: '下一个有内容的日子',
  },
  'en': {
    dayDetailsTitle: (dayName: string) => `${dayName} - Details`,
    backToWeek: 'Back to Week View',
    notesLabel: 'Daily Summary:',
    ratingLabel: 'Daily Rating:',
    noData: 'No data available',
    notesPlaceholder: 'Write your summary for the day...',
    summaryAvailableLater: 'Summary can be written after 6 PM.',
    allDayTasks: "All-day Tasks",
    timeIntervalsTitle: (dayName: string) => `${dayName} Schedule`,
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
    addReflection: 'Add Personal Insights',
    noItemsForHour: 'No items.',
    editItem: 'Edit item',
    deleteItem: 'Delete item',
    markComplete: 'Mark as complete',
    markIncomplete: 'Mark as incomplete',
    ratingUiLabels: {
      excellent: 'Excellent',
      average: 'Average',
      terrible: 'Terrible',
    },
    todoModal: {
        modalTitle: (hourSlot: string) => `${hourSlot} - To-do List`,
        modalDescription: 'Add, edit, or delete your to-do items here.',
        addItemPlaceholder: 'Enter a new to-do item...',
        categoryInputPlaceholder: 'E.g., Process emails, Buy milk (optional)',
        addButton: 'Add',
        updateButton: 'Update',
        saveButton: 'Save',
        noTodos: 'No to-do items yet.',
        markComplete: 'Mark as complete',
        markIncomplete: 'Mark as incomplete',
        editTodo: 'Edit to-do item',
        deleteTodo: 'Delete to-do item',
        categoryLabel: 'Category:',
        deadlineLabel: 'Deadline:',
        importanceLabel: 'Importance:',
        selectPlaceholder: 'Select...',
        categories: {
            work: 'Work',
            study: 'Study',
            shopping: 'Shopping',
            organizing: 'Organizing',
            relaxing: 'Relaxing',
            cooking: 'Cooking',
            childcare: 'Childcare',
            dating: 'Dating/Appointment',
        } as Record<CategoryType, string>,
        deadlines: {
            hour: 'Within the hour',
            today: 'Today',
            tomorrow: 'Tomorrow',
            thisWeek: 'This Week',
            nextWeek: 'Next Week',
            nextMonth: 'Next Month',
        },
        importances: {
            important: 'Important',
            notImportant: 'Not Important',
        }
    },
    meetingNotesSectionTitle: 'Meeting Notes',
    noMeetingNotesForHour: 'No meeting notes recorded for this hour.',
    editMeetingNote: 'Edit Meeting Note',
    deleteMeetingNote: 'Delete Meeting Note',
    meetingNoteModal: {
        modalTitleNew: 'New Meeting Note',
        modalTitleEdit: (title: string) => `Edit: ${title || 'Note'}`,
        modalDescription: 'Record details for your meeting.',
        titleLabel: 'Title:',
        titlePlaceholder: 'Enter meeting title...',
        notesLabel: 'Notes:',
        notesPlaceholder: 'Enter your meeting notes here...',
        attendeesLabel: 'Attendees (optional):',
        attendeesPlaceholder: 'e.g., John Doe, Jane Smith',
        actionItemsLabel: 'Action Items (optional):',
        actionItemsPlaceholder: 'e.g., Follow up with marketing team',
        saveButton: 'Save Note',
        updateButton: 'Update Note',
        cancelButton: 'Cancel',
        deleteButton: 'Delete Note',
    } as MeetingNoteModalTranslations,
    shareLinkModal: {
        modalTitleNew: 'New Share Link',
        modalTitleEdit: (titleOrUrl: string) => `Edit Link: ${titleOrUrl}`,
        modalDescription: 'Add, edit, or delete your share links here.',
        urlLabel: 'Link URL:',
        urlPlaceholder: 'https://example.com',
        titleLabel: 'Title (optional):',
        titlePlaceholder: 'Enter link title or description...',
        categoryLabel: 'Tag (optional):',
        categoryPlaceholder: 'E.g. Study, Recipe',
        saveButton: 'Save Link',
        updateButton: 'Update Link',
        cancelButton: 'Cancel',
        deleteButton: 'Delete Link',
    } as ShareLinkModalTranslations,
    linksSectionTitle: 'Shared Links',
    noLinksForHour: 'No links recorded for this hour.',
    editLink: 'Edit Link',
    deleteLink: 'Delete Link',
    reflectionModal: {
        modalTitleNew: 'New Personal Insight',
        modalTitleEdit: 'Edit Insight',
        modalDescription: 'Record your personal insights here.',
        textLabel: 'Insight:',
        textPlaceholder: 'Enter your insights...',
        saveButton: 'Save Insight',
        updateButton: 'Update Insight',
        cancelButton: 'Cancel',
        deleteButton: 'Delete Insight',
    } as ReflectionModalTranslations,
    reflectionsSectionTitle: 'Personal Insights',
    noReflectionsForHour: 'No insights recorded for this hour.',
    editReflection: 'Edit Insight',
    deleteReflection: 'Delete Insight',
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
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
    timeIntervals: {
        midnight: 'Midnight (00:00 - 05:00)',
        earlyMorning: 'Early Morning (05:00 - 09:00)',
        morning: 'Morning (09:00 - 12:00)',
        noon: 'Noon (12:00 - 14:00)',
        afternoon: 'Afternoon (14:00 - 18:00)',
        evening: 'Evening (18:00 - 24:00)',
    },
    previousDay: 'Previous Eventful Day',
    nextDay: 'Next Eventful Day',
  }
};

type LanguageKey = keyof typeof translations;

// Data storage keys (consistent with main page)
const LOCAL_STORAGE_KEY_ALL_DAILY_NOTES = 'allWeekDailyNotes_v2';
const LOCAL_STORAGE_KEY_ALL_TODOS = 'allWeekTodos_v2';
const LOCAL_STORAGE_KEY_ALL_MEETING_NOTES = 'allWeekMeetingNotes_v2';
const LOCAL_STORAGE_KEY_ALL_SHARE_LINKS = 'allWeekShareLinks_v2';
const LOCAL_STORAGE_KEY_ALL_REFLECTIONS = 'allWeekReflections_v2';
const LOCAL_STORAGE_KEY_RATINGS = 'weekGlanceRatings_v2';
const LOCAL_STORAGE_KEY_TODO_MIGRATION_DATE = 'lastTodoMigrationDate_v1';

const URL_REGEX = /(https?:\/\/[^\s$.?#].[^\s]*)/i;

export interface SlotDetails {
  dateKey: string; // YYYY-MM-DD
  hourSlot: string;
}

export const CategoryIcons: Record<CategoryType, React.ElementType> = {
  work: Briefcase,
  study: BookOpen,
  shopping: ShoppingCart,
  organizing: Archive,
  relaxing: Coffee,
  cooking: ChefHat,
  childcare: Baby,
  dating: CalendarClock,
};

export const DeadlineIcons: Record<NonNullable<TodoItem['deadline']>, React.ElementType> = {
  hour: Hourglass,
  today: CalendarCheck,
  tomorrow: Sunrise,
  thisWeek: CalendarRange,
  nextWeek: ArrowRightToLine,
  nextMonth: CalendarPlus,
};

export const RATING_ICONS: Record<string, React.ElementType> = {
  excellent: Smile,
  average: Meh,
  terrible: Frown,
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
        
        return { success: true, slotName: targetIntervalLabel.split(' ')[0] };
    } catch(e) {
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


export default function DayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dayNameForDisplay = typeof params.dayName === 'string' ? decodeURIComponent(params.dayName) : "无效日期";
  const dateKey = searchParams.get('date') || ''; // YYYY-MM-DD
  const eventfulDaysParam = searchParams.get('eventfulDays');
  const eventfulDays = useMemo(() => eventfulDaysParam ? eventfulDaysParam.split(',') : [], [eventfulDaysParam]);

  const { toast } = useToast();

  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [clientPageLoadTime, setClientPageLoadTime] = useState<Date | null>(null);

  const [allDailyNotes, setAllDailyNotes] = useState<Record<string, string>>({}); // Keyed by YYYY-MM-DD
  const [allRatings, setAllRatings] = useState<Record<string, RatingType>>({});
  const [allTodos, setAllTodos] = useState<Record<string, Record<string, TodoItem[]>>>({}); // Outer key: YYYY-MM-DD
  const [allMeetingNotes, setAllMeetingNotes] = useState<Record<string, Record<string, MeetingNoteItem[]>>>({});
  const [allShareLinks, setAllShareLinks] = useState<Record<string, Record<string, ShareLinkItem[]>>>({});
  const [allReflections, setAllReflections] = useState<Record<string, Record<string, ReflectionItem[]>>>({});
  
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [selectedSlotForTodo, setSelectedSlotForTodo] = useState<SlotDetails | null>(null);
  const [editingTodoItem, setEditingTodoItem] = useState<TodoItem | null>(null);

  const [isMeetingNoteModalOpen, setIsMeetingNoteModalOpen] = useState(false);
  const [selectedSlotForMeetingNote, setSelectedSlotForMeetingNote] = useState<SlotDetails | null>(null);
  const [editingMeetingNoteItem, setEditingMeetingNoteItem] = useState<MeetingNoteItem | null>(null);

  const [isShareLinkModalOpen, setIsShareLinkModalOpen] = useState(false);
  const [selectedSlotForShareLink, setSelectedSlotForShareLink] = useState<SlotDetails | null>(null);
  const [editingShareLinkItem, setEditingShareLinkItem] = useState<ShareLinkItem | null>(null);

  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [selectedSlotForReflection, setSelectedSlotForReflection] = useState<SlotDetails | null>(null);
  const [editingReflectionItem, setEditingReflectionItem] = useState<ReflectionItem | null>(null);

  const intervalRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeIntervalKey, setActiveIntervalKey] = useState<string | null>(null);
  const [hasScrolledInitially, setHasScrolledInitially] = useState(false);

  const [isClipboardModalOpen, setIsClipboardModalOpen] = useState(false);
  const [clipboardContent, setClipboardContent] = useState('');
  const [lastProcessedClipboardText, setLastProcessedClipboardText] = useState('');

  const t = translations[currentLanguage];
  const dateLocale = currentLanguage === 'zh-CN' ? zhCN : enUS;
  
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
           // Silently fail in production
        }
    }
  }, [lastProcessedClipboardText, allShareLinks]);
  
  useEffect(() => {
        window.addEventListener('focus', checkClipboard);
        return () => {
            window.removeEventListener('focus', checkClipboard);
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
        // Silently fail.
      }
    }
    setLastProcessedClipboardText(clipboardContent);
    setIsClipboardModalOpen(false);
  };
  
  const handleCloseClipboardModal = () => {
    setLastProcessedClipboardText(clipboardContent); // Mark as handled even if closed
    setIsClipboardModalOpen(false);
  };


  useEffect(() => {
    const now = new Date();
    setClientPageLoadTime(now);

    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }

    const loadData = () => {
        try {
            const loadedTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_TODOS) || '{}');
            const lastMigrationDate = localStorage.getItem(LOCAL_STORAGE_KEY_TODO_MIGRATION_DATE);
            const todayStr = format(now, 'yyyy-MM-dd');

            if (dateKey === todayStr && lastMigrationDate !== todayStr) {
                const yesterdayStr = format(subDays(now, 1), 'yyyy-MM-dd');
                const yesterdayTodos = loadedTodos[yesterdayStr] || {};
                
                const unfinishedTodos: TodoItem[] = [];
                Object.values(yesterdayTodos).forEach((slot: any) => {
                    if (Array.isArray(slot)) {
                        slot.forEach((todo: TodoItem) => {
                            if (!todo.completed) {
                                // Create a copy of the todo item for migration
                                unfinishedTodos.push({ ...todo, id: `${todo.id}-migrated-${Date.now()}` });
                            }
                        });
                    }
                });

                if (unfinishedTodos.length > 0) {
                    const targetSlot = '08:00 - 09:00';
                    const todayDayTodos = loadedTodos[todayStr] || {};
                    const todayTargetSlotTodos = todayDayTodos[targetSlot] || [];
                    
                    // Add unfinished todos to the beginning of the target slot's array
                    todayDayTodos[targetSlot] = [...unfinishedTodos, ...todayTargetSlotTodos];
                    loadedTodos[todayStr] = todayDayTodos;
                    
                    localStorage.setItem(LOCAL_STORAGE_KEY_ALL_TODOS, JSON.stringify(loadedTodos));
                    localStorage.setItem(LOCAL_STORAGE_KEY_TODO_MIGRATION_DATE, todayStr);
                    toast({ title: `已将昨天 ${unfinishedTodos.length} 个未完成事项同步到今天` });
                } else {
                   localStorage.setItem(LOCAL_STORAGE_KEY_TODO_MIGRATION_DATE, todayStr);
                }
            }

            setAllTodos(loadedTodos);
            setAllDailyNotes(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_DAILY_NOTES) || '{}'));
            setAllRatings(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RATINGS) || '{}'));
            setAllMeetingNotes(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_MEETING_NOTES) || '{}'));
            setAllShareLinks(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_SHARE_LINKS) || '{}'));
            setAllReflections(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_REFLECTIONS) || '{}'));
        } catch (e) {
            // Silently fail in production
        }
    };
    loadData();
  }, [dateKey, toast]);

  const saveAllData = useCallback((dataKey: string, data: any) => {
    try {
        localStorage.setItem(dataKey, JSON.stringify(data));
    } catch(e) {
        toast({title: 'Error saving data', variant: 'destructive'});
    }
  }, [toast]);


  const tTodoModal = translations[currentLanguage].todoModal;
  const tMeetingNoteModal = translations[currentLanguage].meetingNoteModal;
  const tShareLinkModal = translations[currentLanguage].shareLinkModal;
  const tReflectionModal = translations[currentLanguage].reflectionModal;

  const timeIntervals = useMemo(() => [
    { key: 'midnight', label: t.midnight }, { key: 'earlyMorning', label: t.earlyMorning },
    { key: 'morning', label: t.morning }, { key: 'noon', label: t.noon },
    { key: 'afternoon', label: t.afternoon }, { key: 'evening', label: t.evening }
  ], [t]);

  const handleDailyNoteChange = (newNote: string) => {
    if (!dateKey) return;
    setAllDailyNotes(prev => {
        const updated = {...prev, [dateKey]: newNote };
        saveAllData(LOCAL_STORAGE_KEY_ALL_DAILY_NOTES, updated);
        return updated;
    });
  };
  
  const handleRatingChange = (newRating: RatingType | null) => {
    if (!dateKey) return;
    setAllRatings(prev => {
      const updated = { ...prev, [dateKey]: newRating };
      saveAllData(LOCAL_STORAGE_KEY_RATINGS, updated);
      return updated;
    });
  };

  const dayProperties = useMemo(() => {
    if (!dateKey) return { isValid: false, dateObject: null };
    try {
        const parsedDate = parseISO(dateKey); // YYYY-MM-DD should be parsable
        return { isValid: true, dateObject: parsedDate };
    } catch (e) {
        return { isValid: false, dateObject: null };
    }
  }, [dateKey]);


  const isViewingCurrentDay = useMemo(() => {
    if (!clientPageLoadTime || !dayProperties.isValid || !dayProperties.dateObject) return false;
    return format(dayProperties.dateObject, 'yyyy-MM-dd') === format(clientPageLoadTime, 'yyyy-MM-dd');
  }, [dayProperties, clientPageLoadTime]);

  const isFutureDay = useMemo(() => {
    if (!clientPageLoadTime || !dayProperties.isValid || !dayProperties.dateObject) return false;
    const today = new Date(clientPageLoadTime.getTime());
    today.setHours(0,0,0,0); 
    return dayProperties.dateObject > today;
  }, [dayProperties, clientPageLoadTime]);

  const isPastDay = useMemo(() => {
    if (!clientPageLoadTime || !dayProperties.isValid || !dayProperties.dateObject) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(dayProperties.dateObject, today);
  }, [clientPageLoadTime, dayProperties]);


  useEffect(() => {
    if (hasScrolledInitially || !isViewingCurrentDay || !clientPageLoadTime || !dateKey) {
        return;
    }

    const now = clientPageLoadTime;
    const currentHour = now.getHours();
    const currentTimeTotalMinutes = currentHour * 60 + now.getMinutes();

    let newActiveKey: string | null = null;
    let firstVisibleIntervalKeyForScroll: string | null = null;
    let currentIntervalKeyForScroll: string | null = null;

    for (const interval of timeIntervals) {
        const hourlySlots = generateHourlySlots(interval.label);
        const hasContentInInterval = hourlySlots.some(slot =>
            (allTodos[dateKey]?.[slot]?.length || 0) > 0 ||
            (allMeetingNotes[dateKey]?.[slot]?.length || 0) > 0 ||
            (allShareLinks[dateKey]?.[slot]?.length || 0) > 0 ||
            (allReflections[dateKey]?.[slot]?.length || 0) > 0
        );

        const match = interval.label.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
        if (!match) continue;

        const [, startTimeStr, endTimeStr] = match;
        const [startH, startM] = startTimeStr.split(':').map(Number);
        let [endH, endM] = endTimeStr.split(':').map(Number);
        if (endTimeStr === "24:00" || (endTimeStr === "00:00" && startH > 0 && endH === 0)) endH = 24;

        const intervalEndTotalMinutes = endH * 60 + endM;
        const pageLoadTotalMinutesForIntervalCheck = now.getHours() * 60 + now.getMinutes();

        if (intervalEndTotalMinutes <= pageLoadTotalMinutesForIntervalCheck && !hasContentInInterval) {
            continue;
        }

        if (!firstVisibleIntervalKeyForScroll) {
            firstVisibleIntervalKeyForScroll = interval.key;
        }
        
        const intervalStartTotalMinutes = startH * 60 + startM;
        if (currentTimeTotalMinutes >= intervalStartTotalMinutes && currentTimeTotalMinutes < intervalEndTotalMinutes) {
            newActiveKey = interval.key;
            currentIntervalKeyForScroll = interval.key;
        }
    }
    
    setActiveIntervalKey(newActiveKey);

    const targetKeyForScroll = currentIntervalKeyForScroll || firstVisibleIntervalKeyForScroll;
    if (targetKeyForScroll && intervalRefs.current[targetKeyForScroll]) {
        const scrollTimerId = setTimeout(() => {
            intervalRefs.current[targetKeyForScroll]?.scrollIntoView({ behavior: 'auto', block: 'start' });
            setHasScrolledInitially(true);
        }, 100);
        
        return () => clearTimeout(scrollTimerId);
    } else {
        setHasScrolledInitially(true);
    }
  }, [dateKey, clientPageLoadTime, isViewingCurrentDay, hasScrolledInitially, timeIntervals, allTodos, allMeetingNotes, allShareLinks, allReflections]);


  const handleOpenTodoModal = (hourSlot: string) => {
    if (!dateKey) return;
    setSelectedSlotForTodo({ dateKey, hourSlot });
    setEditingTodoItem(null);
    setIsTodoModalOpen(true);
  };

  const handleSaveTodosFromModal = (currentDateKey: string, hourSlot: string, updatedTodosInSlot: TodoItem[]) => {
    setAllTodos(prev => {
      const newAll = { ...prev, [currentDateKey]: { ...(prev[currentDateKey] || {}), [hourSlot]: updatedTodosInSlot } };
      saveAllData(LOCAL_STORAGE_KEY_ALL_TODOS, newAll); return newAll;
    });
  };

  const handleToggleTodoCompletionInPage = (targetDateKey: string, targetHourSlot: string, todoId: string) => {
    setAllTodos(prev => {
      const slotTodos = prev[targetDateKey]?.[targetHourSlot] || [];
      const updatedSlot = slotTodos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t);
      const newAll = { ...prev, [targetDateKey]: { ...(prev[targetDateKey] || {}), [targetHourSlot]: updatedSlot } };
      saveAllData(LOCAL_STORAGE_KEY_ALL_TODOS, newAll); return newAll;
    });
  };
  const handleDeleteTodoInPage = (targetDateKey: string, targetHourSlot: string, todoId: string) => {
    setAllTodos(prev => {
      const slotTodos = prev[targetDateKey]?.[targetHourSlot] || [];
      const updatedSlot = slotTodos.filter(t => t.id !== todoId);
      const newAll = { ...prev, [targetDateKey]: { ...(prev[targetDateKey] || {}), [targetHourSlot]: updatedSlot } };
      saveAllData(LOCAL_STORAGE_KEY_ALL_TODOS, newAll); return newAll;
    });
  };
  const handleOpenEditModalInPage = (targetDateKey: string, targetHourSlot: string, todoToEdit: TodoItem) => {
    setEditingTodoItem(todoToEdit);
    setSelectedSlotForTodo({ dateKey: targetDateKey, hourSlot: targetHourSlot });
    setIsTodoModalOpen(true);
  };
  
  const handleOpenMeetingNoteModal = (hourSlot: string, noteToEdit?: MeetingNoteItem) => {
    if (!dateKey) return;
    setSelectedSlotForMeetingNote({ dateKey, hourSlot });
    setEditingMeetingNoteItem(noteToEdit || null);
    setIsMeetingNoteModalOpen(true);
  };
  const handleSaveMeetingNoteFromModal = (currentDateKey: string, hourSlot: string, savedNote: MeetingNoteItem) => {
    setAllMeetingNotes(prev => {
      const slotNotes = prev[currentDateKey]?.[hourSlot] || [];
      const idx = slotNotes.findIndex(n => n.id === savedNote.id);
      const updatedSlot = idx > -1 ? slotNotes.map((n, i) => i === idx ? savedNote : n) : [...slotNotes, savedNote];
      const newAll = { ...prev, [currentDateKey]: { ...(prev[currentDateKey] || {}), [hourSlot]: updatedSlot } };
      saveAllData(LOCAL_STORAGE_KEY_ALL_MEETING_NOTES, newAll); return newAll;
    });
  };
  const handleDeleteMeetingNoteInPage = (targetDateKey: string, targetHourSlot: string, noteId: string) => {
    setAllMeetingNotes(prev => {
      const slotNotes = prev[targetDateKey]?.[targetHourSlot] || [];
      const updatedSlot = slotNotes.filter(n => n.id !== noteId);
      const newAll = { ...prev, [targetDateKey]: { ...(prev[targetDateKey] || {}), [targetHourSlot]: updatedSlot } };
      saveAllData(LOCAL_STORAGE_KEY_ALL_MEETING_NOTES, newAll); return newAll;
    });
  };

  const handleOpenShareLinkModal = (hourSlot: string, linkToEdit?: ShareLinkItem) => {
    if (!dateKey) return;
    setSelectedSlotForShareLink({ dateKey, hourSlot });
    setEditingShareLinkItem(linkToEdit || null);
    setIsShareLinkModalOpen(true);
  };
  const handleSaveShareLinkFromModal = (currentDateKey: string, hourSlot: string, savedLink: ShareLinkItem) => {
    setAllShareLinks(prev => {
        const slotLinks = prev[currentDateKey]?.[hourSlot] || [];
        const idx = slotLinks.findIndex(l => l.id === savedLink.id);
        const updatedSlot = idx > -1 ? slotLinks.map((l, i) => i === idx ? savedLink : l) : [...slotLinks, savedLink];
        const newAll = { ...prev, [currentDateKey]: { ...(prev[currentDateKey] || {}), [hourSlot]: updatedSlot } };
        saveAllData(LOCAL_STORAGE_KEY_ALL_SHARE_LINKS, newAll); return newAll;
    });
  };
  const handleDeleteShareLinkInPage = (targetDateKey: string, targetHourSlot: string, linkId: string) => {
    setAllShareLinks(prev => {
        const slotLinks = prev[targetDateKey]?.[hourSlot] || [];
        const updatedSlot = slotLinks.filter(l => l.id !== linkId);
        const newAll = { ...prev, [targetDateKey]: { ...(prev[targetDateKey] || {}), [targetHourSlot]: updatedSlot } };
        saveAllData(LOCAL_STORAGE_KEY_ALL_SHARE_LINKS, newAll); return newAll;
    });
  };
  
  const handleOpenReflectionModal = (hourSlot: string, reflectionToEdit?: ReflectionItem) => {
    if (!dateKey) return;
    setSelectedSlotForReflection({ dateKey, hourSlot });
    setEditingReflectionItem(reflectionToEdit || null);
    setIsReflectionModalOpen(true);
  };
  const handleSaveReflectionFromModal = (currentDateKey: string, hourSlot: string, savedReflection: ReflectionItem) => {
    setAllReflections(prev => {
        const slotReflections = prev[currentDateKey]?.[hourSlot] || [];
        const idx = slotReflections.findIndex(r => r.id === savedReflection.id);
        const updatedSlot = idx > -1 ? slotReflections.map((r, i) => i === idx ? savedReflection : r) : [...slotReflections, savedReflection];
        const newAll = { ...prev, [currentDateKey]: { ...(prev[currentDateKey] || {}), [hourSlot]: updatedSlot } };
        saveAllData(LOCAL_STORAGE_KEY_ALL_REFLECTIONS, newAll); return newAll;
    });
  };
  const handleDeleteReflectionInPage = (targetDateKey: string, targetHourSlot: string, reflectionId: string) => {
     setAllReflections(prev => {
        const slotReflections = prev[currentDateKey]?.[targetHourSlot] || [];
        const updatedSlot = slotReflections.filter(r => r.id !== reflectionId);
        const newAll = { ...prev, [targetDateKey]: { ...(prev[targetDateKey] || {}), [targetHourSlot]: updatedSlot } };
        saveAllData(LOCAL_STORAGE_KEY_ALL_REFLECTIONS, newAll); return newAll;
    });
  };

  const navigateToDay = (direction: 'next' | 'prev') => {
    const currentIndex = eventfulDays.indexOf(dateKey);
    if (currentIndex === -1) return;

    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (nextIndex >= 0 && nextIndex < eventfulDays.length) {
      const newDateKey = eventfulDays[nextIndex];
      const newDate = parseISO(newDateKey);
      const newDayName = format(newDate, 'EEEE', { locale: dateLocale });
      router.push(`/day/${encodeURIComponent(newDayName)}?date=${newDateKey}&eventfulDays=${eventfulDaysParam}`);
    }
  };
  
  const { isPrevDisabled, isNextDisabled } = useMemo(() => {
    const currentIndex = eventfulDays.indexOf(dateKey);
    const isPrevDisabled = currentIndex <= 0;
    const isNextDisabled = currentIndex >= eventfulDays.length - 1;
    return { isPrevDisabled, isNextDisabled };
  }, [dateKey, eventfulDays]);


  if (!dateKey || !clientPageLoadTime) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 sm:p-8">
            <Link href="/" passHref>
                <Button variant="outline" size="sm" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToWeek}
                </Button>
            </Link>
        </div>
      );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-8">
        <header className="w-full max-w-4xl mb-8 flex justify-between items-center">
            <Link href="/" passHref>
                <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToWeek}
                </Button>
            </Link>
             {!isFutureDay && (
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigateToDay('prev')} aria-label={t.previousDay} disabled={isPrevDisabled}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigateToDay('next')} aria-label={t.nextDay} disabled={isNextDisabled}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </header>

        <main className="w-full max-w-4xl">
          <DailySummaryCard
            translations={t}
            dateKey={dateKey}
            dayNameForDisplay={dayNameForDisplay}
            dailyNote={allDailyNotes[dateKey] || ""}
            rating={allRatings[dateKey] || null}
            isPastDay={isPastDay}
            isViewingCurrentDay={isViewingCurrentDay}
            isClientAfter6PM={clientPageLoadTime.getHours() >= 18}
            onDailyNoteChange={handleDailyNoteChange}
            onRatingChange={handleRatingChange}
          />
          
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">
              {t.timeIntervalsTitle(dayNameForDisplay)}
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {timeIntervals.map(interval => (
                  <TimeIntervalSection
                    key={interval.key}
                    interval={interval}
                    dateKey={dateKey}
                    isPastDay={isPastDay}
                    isViewingCurrentDay={isViewingCurrentDay}
                    clientPageLoadTime={clientPageLoadTime}
                    isCurrentActiveInterval={isViewingCurrentDay && activeIntervalKey === interval.key}
                    intervalRef={el => { if (el) intervalRefs.current[interval.key] = el; }}
                    allTodos={allTodos}
                    allMeetingNotes={allMeetingNotes}
                    allShareLinks={allShareLinks}
                    allReflections={allReflections}
                    onToggleTodoCompletion={handleToggleTodoCompletionInPage}
                    onDeleteTodo={handleDeleteTodoInPage}
                    onOpenEditTodoModal={handleOpenEditModalInPage}
                    onOpenMeetingNoteModal={handleOpenMeetingNoteModal}
                    onOpenShareLinkModal={handleOpenShareLinkModal}
                    onOpenReflectionModal={handleOpenReflectionModal}
                    onDeleteMeetingNote={handleDeleteMeetingNoteInPage}
                    onDeleteShareLink={handleDeleteShareLinkInPage}
                    onDeleteReflection={handleDeleteReflectionInPage}
                    translations={t}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {isTodoModalOpen && selectedSlotForTodo && (
        <TodoModal
          isOpen={isTodoModalOpen}
          onClose={() => setIsTodoModalOpen(false)}
          onSaveTodos={handleSaveTodosFromModal}
          dateKey={selectedSlotForTodo.dateKey}
          hourSlot={selectedSlotForTodo.hourSlot}
          initialTodos={allTodos[selectedSlotForTodo.dateKey]?.[selectedSlotForTodo.hourSlot] || []}
          translations={tTodoModal}
          defaultEditingTodoId={editingTodoItem?.id}
        />
      )}
      {isMeetingNoteModalOpen && selectedSlotForMeetingNote && (
        <MeetingNoteModal
            isOpen={isMeetingNoteModalOpen}
            onClose={() => setIsMeetingNoteModalOpen(false)}
            onSave={handleSaveMeetingNoteFromModal}
            onDelete={handleDeleteMeetingNoteInPage.bind(null, selectedSlotForMeetingNote.dateKey, selectedSlotForMeetingNote.hourSlot)}
            dateKey={selectedSlotForMeetingNote.dateKey}
            hourSlot={selectedSlotForMeetingNote.hourSlot}
            initialData={editingMeetingNoteItem}
            translations={tMeetingNoteModal}
        />
      )}
      {isShareLinkModalOpen && selectedSlotForShareLink && (
        <ShareLinkModal
            isOpen={isShareLinkModalOpen}
            onClose={() => setIsShareLinkModalOpen(false)}
            onSave={handleSaveShareLinkFromModal}
            onDelete={handleDeleteShareLinkInPage.bind(null, selectedSlotForShareLink.dateKey, selectedSlotForShareLink.hourSlot)}
            dateKey={selectedSlotForShareLink.dateKey}
            hourSlot={selectedSlotForShareLink.hourSlot}
            initialData={editingShareLinkItem}
            translations={tShareLinkModal}
        />
      )}
      {isReflectionModalOpen && selectedSlotForReflection && (
        <ReflectionModal
            isOpen={isReflectionModalOpen}
            onClose={() => setIsReflectionModalOpen(false)}
            onSave={handleSaveReflectionFromModal}
            onDelete={handleDeleteReflectionInPage.bind(null, selectedSlotForReflection.dateKey, selectedSlotForReflection.hourSlot)}
            dateKey={selectedSlotForReflection.dateKey}
            hourSlot={selectedSlotForReflection.hourSlot}
            initialData={editingReflectionItem}
            translations={tReflectionModal}
        />
      )}
      <ClipboardModal
        isOpen={isClipboardModalOpen}
        onClose={handleCloseClipboardModal}
        onSave={handleSaveFromClipboard}
        content={clipboardContent}
        translations={t.clipboard}
      />
    </TooltipProvider>
  );
}
