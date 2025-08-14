
// src/app/day/[dayName]/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft, ListChecks, ClipboardList, Link2 as LinkIconLucide, MessageSquareText,
    Briefcase, BookOpen, ShoppingCart, Archive, Coffee, ChefHat, Baby, CalendarClock,
    Hourglass, CalendarCheck, Sunrise, CalendarRange, ArrowRightToLine, CalendarPlus,
    Star as StarIcon, FileEdit, Trash2
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TodoModal, type TodoItem, type CategoryType } from '@/components/TodoModal';
import { MeetingNoteModal, type MeetingNoteItem, type MeetingNoteModalTranslations } from '@/components/MeetingNoteModal';
import { ShareLinkModal, type ShareLinkItem, type ShareLinkModalTranslations } from '@/components/ShareLinkModal';
import { ReflectionModal, type ReflectionItem, type ReflectionModalTranslations } from '@/components/ReflectionModal';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO, isAfter as dateIsAfter } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ClipboardModal } from '@/components/ClipboardModal';
import copy from 'copy-to-clipboard';


// Helper function to extract time range and generate hourly slots
const generateHourlySlots = (intervalLabelWithTime: string): string[] => {
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
    noItemsForHour: '此时间段暂无记录事项。',
    editItem: '编辑事项',
    deleteItem: '删除事项',
    markComplete: '标记为已完成',
    markIncomplete: '标记为未完成',
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
  },
  'en': {
    dayDetailsTitle: (dayName: string) => `${dayName} - Details`,
    backToWeek: 'Back to Week View',
    notesLabel: 'Daily Summary:',
    ratingLabel: 'Daily Rating:',
    noData: 'No data available',
    notesPlaceholder: 'Write your summary for the day...',
    summaryAvailableLater: 'Summary can be written after 6 PM.',
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
    noItemsForHour: 'No items recorded for this hour.',
    editItem: 'Edit item',
    deleteItem: 'Delete item',
    markComplete: 'Mark as complete',
    markIncomplete: 'Mark as incomplete',
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
  }
};

type LanguageKey = keyof typeof translations;

// Data storage keys (consistent with main page)
const LOCAL_STORAGE_KEY_ALL_DAILY_NOTES = 'allWeekDailyNotes_v2';
const LOCAL_STORAGE_KEY_ALL_TODOS = 'allWeekTodos_v2';
const LOCAL_STORAGE_KEY_ALL_MEETING_NOTES = 'allWeekMeetingNotes_v2';
const LOCAL_STORAGE_KEY_ALL_SHARE_LINKS = 'allWeekShareLinks_v2';
const LOCAL_STORAGE_KEY_ALL_REFLECTIONS = 'allWeekReflections_v2';
const URL_REGEX = /(https?:\/\/[^\s$.?#].[^\s]*)/i;

interface SlotDetails {
  dateKey: string; // YYYY-MM-DD
  hourSlot: string;
}

const CategoryIcons: Record<CategoryType, React.ElementType> = {
  work: Briefcase,
  study: BookOpen,
  shopping: ShoppingCart,
  organizing: Archive,
  relaxing: Coffee,
  cooking: ChefHat,
  childcare: Baby,
  dating: CalendarClock,
};

const DeadlineIcons: Record<NonNullable<TodoItem['deadline']>, React.ElementType> = {
  hour: Hourglass,
  today: CalendarCheck,
  tomorrow: Sunrise,
  thisWeek: CalendarRange,
  nextWeek: ArrowRightToLine,
  nextMonth: CalendarPlus,
};

const MAX_DAILY_NOTE_LENGTH = 1000;
type DailyNoteDisplayMode = 'read' | 'edit' | 'pending';

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
        
        return { success: true, slotName: targetIntervalLabel.split(' ')[0] };
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

// Helper function to get a color for a category tag based on its name
const getTagColor = (tagName: string | null): string => {
    if (!tagName) return 'bg-gray-200 text-gray-800';
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
        hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 70%, 85%)`; // Using HSL for a wide range of soft colors
};


export default function DayDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const dayNameForDisplay = typeof params.dayName === 'string' ? decodeURIComponent(params.dayName) : "无效日期";
  const dateKey = searchParams.get('date') || ''; // YYYY-MM-DD
  const { toast } = useToast();

  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [clientPageLoadTime, setClientPageLoadTime] = useState<Date | null>(null);
  const [isClientAfter6PMToday, setIsClientAfter6PMToday] = useState<boolean>(false);


  const [allDailyNotes, setAllDailyNotes] = useState<Record<string, string>>({}); // Keyed by YYYY-MM-DD
  const [allTodos, setAllTodos] = useState<Record<string, Record<string, TodoItem[]>>>({}); // Outer key: YYYY-MM-DD
  const [allMeetingNotes, setAllMeetingNotes] = useState<Record<string, Record<string, MeetingNoteItem[]>>>({});
  const [allShareLinks, setAllShareLinks] = useState<Record<string, Record<string, ShareLinkItem[]>>>({});
  const [allReflections, setAllReflections] = useState<Record<string, Record<string, ReflectionItem[]>>>({});

  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [selectedSlotForTodo, setSelectedSlotForTodo] = useState<SlotDetails | null>(null);
  const [editingTodoItem, setEditingTodoItem] = useState<TodoItem | null>(null);
  const [editingTodoSlotDetails, setEditingTodoSlotDetails] = useState<SlotDetails | null>(null);

  const [isMeetingNoteModalOpen, setIsMeetingNoteModalOpen] = useState(false);
  const [selectedSlotForMeetingNote, setSelectedSlotForMeetingNote] = useState<SlotDetails | null>(null);
  const [editingMeetingNoteItem, setEditingMeetingNoteItem] = useState<MeetingNoteItem | null>(null);
  const [editingMeetingNoteSlotDetails, setEditingMeetingNoteSlotDetails] = useState<SlotDetails | null>(null);

  const [isShareLinkModalOpen, setIsShareLinkModalOpen] = useState(false);
  const [selectedSlotForShareLink, setSelectedSlotForShareLink] = useState<SlotDetails | null>(null);
  const [editingShareLinkItem, setEditingShareLinkItem] = useState<ShareLinkItem | null>(null);
  const [editingShareLinkSlotDetails, setEditingShareLinkSlotDetails] = useState<SlotDetails | null>(null);

  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [selectedSlotForReflection, setSelectedSlotForReflection] = useState<SlotDetails | null>(null);
  const [editingReflectionItem, setEditingReflectionItem] = useState<ReflectionItem | null>(null);
  const [editingReflectionSlotDetails, setEditingReflectionSlotDetails] = useState<SlotDetails | null>(null);

  const intervalRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeIntervalKey, setActiveIntervalKey] = useState<string | null>(null);

  const [isClipboardModalOpen, setIsClipboardModalOpen] = useState(false);
  const [clipboardContent, setClipboardContent] = useState('');
  const [lastProcessedClipboardText, setLastProcessedClipboardText] = useState('');

  const t = translations[currentLanguage];

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
  }, [lastProcessedClipboardText, t.clipboard.checkClipboardError, allShareLinks]);
  
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


  useEffect(() => {
    const now = new Date();
    setClientPageLoadTime(now);
    setIsClientAfter6PMToday(now.getHours() >= 18);

    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }

    const loadData = () => {
        try {
            setAllDailyNotes(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_DAILY_NOTES) || '{}'));
            setAllTodos(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_TODOS) || '{}'));
            setAllMeetingNotes(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_MEETING_NOTES) || '{}'));
            setAllShareLinks(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_SHARE_LINKS) || '{}'));
            setAllReflections(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_REFLECTIONS) || '{}'));
        } catch (e) {
            console.error("Failed to parse data from localStorage", e);
        }
    };
    loadData();
  }, []);

  const saveAllDailyNotesToLocalStorage = (updatedNotes: Record<string, string>) => {
    try { localStorage.setItem(LOCAL_STORAGE_KEY_ALL_DAILY_NOTES, JSON.stringify(updatedNotes)); } 
    catch (e) { console.error("Failed to save daily notes", e); }
  };
  const saveAllTodosToLocalStorage = (updatedTodos: Record<string, Record<string, TodoItem[]>>) => {
    try { localStorage.setItem(LOCAL_STORAGE_KEY_ALL_TODOS, JSON.stringify(updatedTodos)); }
    catch (e) { console.error("Failed to save todos", e); }
  };
  const saveAllMeetingNotesToLocalStorage = (updatedNotes: Record<string, Record<string, MeetingNoteItem[]>>) => {
    try { localStorage.setItem(LOCAL_STORAGE_KEY_ALL_MEETING_NOTES, JSON.stringify(updatedNotes)); }
    catch (e) { console.error("Failed to save meeting notes", e); }
  };
  const saveAllShareLinksToLocalStorage = (updatedLinks: Record<string, Record<string, ShareLinkItem[]>>) => {
    try { localStorage.setItem(LOCAL_STORAGE_KEY_ALL_SHARE_LINKS, JSON.stringify(updatedLinks)); }
    catch (e) { console.error("Failed to save share links", e); }
  };
  const saveAllReflectionsToLocalStorage = (updatedReflections: Record<string, Record<string, ReflectionItem[]>>) => {
    try { localStorage.setItem(LOCAL_STORAGE_KEY_ALL_REFLECTIONS, JSON.stringify(updatedReflections)); }
    catch (e) { console.error("Failed to save reflections", e); }
  };


  
  const tTodoModal = translations[currentLanguage].todoModal;
  const tMeetingNoteModal = translations[currentLanguage].meetingNoteModal;
  const tShareLinkModal = translations[currentLanguage].shareLinkModal;
  const tReflectionModal = translations[currentLanguage].reflectionModal;

  const dailyNote = dateKey ? allDailyNotes[dateKey] || "" : "";
  const rating = ""; // Placeholder

  const timeIntervals = useMemo(() => [
    { key: 'midnight', label: t.midnight }, { key: 'earlyMorning', label: t.earlyMorning },
    { key: 'morning', label: t.morning }, { key: 'noon', label: t.noon },
    { key: 'afternoon', label: t.afternoon }, { key: 'evening', label: t.evening }
  ], [t]);

  const handleDailyNoteChange = (newNote: string) => {
    if (!dateKey) return;
    setAllDailyNotes(prev => {
        const updated = {...prev, [dateKey]: newNote.substring(0, MAX_DAILY_NOTE_LENGTH) };
        saveAllDailyNotesToLocalStorage(updated);
        return updated;
    });
  };

  const dayProperties = useMemo(() => {
    if (!dateKey) return { numericalIndex: -1, sourceLanguage: currentLanguage, isValid: false, dateObject: null };
    try {
        const parsedDate = parseISO(dateKey); // YYYY-MM-DD should be parsable
        const dayIndex = (parsedDate.getDay() + 6) % 7; // Monday is 0
        return { numericalIndex: dayIndex, sourceLanguage: currentLanguage, isValid: true, dateObject: parsedDate };
    } catch (e) {
        console.error("Invalid dateKey format:", dateKey);
        return { numericalIndex: -1, sourceLanguage: currentLanguage, isValid: false, dateObject: null };
    }
  }, [dateKey, currentLanguage]);


  const isViewingCurrentDay = useMemo(() => {
    if (!clientPageLoadTime || !dayProperties || !dayProperties.isValid || !dayProperties.dateObject) return false;
    return format(dayProperties.dateObject, 'yyyy-MM-dd') === format(clientPageLoadTime, 'yyyy-MM-dd');
  }, [dayProperties, clientPageLoadTime]);

  const isFutureDay = useMemo(() => {
    if (!clientPageLoadTime || !dayProperties || !dayProperties.isValid || !dayProperties.dateObject) return false;
    const today = new Date(clientPageLoadTime.getTime());
    today.setHours(0,0,0,0); 
    return dayProperties.dateObject > today;
  }, [dayProperties, clientPageLoadTime]);


  const dailyNoteDisplayMode: DailyNoteDisplayMode = useMemo(() => {
    if (!clientPageLoadTime) return 'pending'; // Default before client hydration
    if (!dayProperties || !dayProperties.isValid || !dayProperties.dateObject) return 'edit';

    if (!isViewingCurrentDay) {
        const today = new Date(clientPageLoadTime.getTime());
        today.setHours(0,0,0,0);
        return (dayProperties.dateObject < today) ? 'read' : 'edit';
    }
    return isClientAfter6PMToday ? 'edit' : 'pending';
  }, [dayProperties, isViewingCurrentDay, isClientAfter6PMToday, clientPageLoadTime]);


  useEffect(() => {
    let scrollTimerId: NodeJS.Timeout | null = null;
    if (!isViewingCurrentDay || !clientPageLoadTime || !dateKey) {
      setActiveIntervalKey(null);
      return () => { if (scrollTimerId) clearTimeout(scrollTimerId); };
    }

    const now = clientPageLoadTime; // Use the client-side determined time
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeTotalMinutes = currentHour * 60 + currentMinute;

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


      const intervalStartTotalMinutes = startH * 60 + startM;
      const intervalEndTotalMinutes = endH * 60 + endM;

      // Use clientPageLoadTime for this check
      const pageLoadHourForIntervalCheck = clientPageLoadTime.getHours();
      const pageLoadMinuteForIntervalCheck = clientPageLoadTime.getMinutes();
      const pageLoadTotalMinutesForIntervalCheck = pageLoadHourForIntervalCheck * 60 + pageLoadMinuteForIntervalCheck;


      if (intervalEndTotalMinutes <= pageLoadTotalMinutesForIntervalCheck && !hasContentInInterval) {
        continue;
      }

      if (!firstVisibleIntervalKeyForScroll) {
        firstVisibleIntervalKeyForScroll = interval.key;
      }

      if (currentTimeTotalMinutes >= intervalStartTotalMinutes && currentTimeTotalMinutes < intervalEndTotalMinutes) {
        newActiveKey = interval.key;
        currentIntervalKeyForScroll = interval.key;
      }
    }

    if (newActiveKey !== activeIntervalKey) {
        setActiveIntervalKey(newActiveKey);
    }
    
    const targetKeyForScroll = currentIntervalKeyForScroll || firstVisibleIntervalKeyForScroll;
    if (targetKeyForScroll && intervalRefs.current[targetKeyForScroll]) {
      scrollTimerId = setTimeout(() => {
        intervalRefs.current[targetKeyForScroll]?.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
      }, 100);
    }
    
    return () => { if (scrollTimerId) clearTimeout(scrollTimerId); };
  }, [dateKey, currentLanguage, timeIntervals, isViewingCurrentDay, clientPageLoadTime, allTodos, allMeetingNotes, allShareLinks, allReflections, activeIntervalKey]);


  const handleOpenTodoModal = (hourSlot: string) => {
    if (!dateKey) return;
    setSelectedSlotForTodo({ dateKey, hourSlot });
    setEditingTodoItem(null);
    setEditingTodoSlotDetails(null);
    setIsTodoModalOpen(true);
  };
  const handleCloseTodoModal = () => {
    setIsTodoModalOpen(false); setSelectedSlotForTodo(null); setEditingTodoItem(null); setEditingTodoSlotDetails(null);
  };
  const handleSaveTodosFromModal = (currentDateKey: string, hourSlot: string, updatedTodosInSlot: TodoItem[]) => {
    setAllTodos(prev => {
      const newAll = { ...prev, [currentDateKey]: { ...(prev[currentDateKey] || {}), [hourSlot]: updatedTodosInSlot } };
      saveAllTodosToLocalStorage(newAll); return newAll;
    });
  };
  const handleToggleTodoCompletionInPage = (targetDateKey: string, targetHourSlot: string, todoId: string) => {
    setAllTodos(prev => {
      const slotTodos = prev[targetDateKey]?.[targetHourSlot] || [];
      const updatedSlot = slotTodos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t);
      const newAll = { ...prev, [targetDateKey]: { ...(prev[targetDateKey] || {}), [targetHourSlot]: updatedSlot } };
      saveAllTodosToLocalStorage(newAll); return newAll;
    });
  };
  const handleDeleteTodoInPage = (targetDateKey: string, targetHourSlot: string, todoId: string) => {
    setAllTodos(prev => {
      const slotTodos = prev[targetDateKey]?.[targetHourSlot] || [];
      const updatedSlot = slotTodos.filter(t => t.id !== todoId);
      const newAll = { ...prev, [targetDateKey]: { ...(prev[targetDateKey] || {}), [targetHourSlot]: updatedSlot } };
      saveAllTodosToLocalStorage(newAll); return newAll;
    });
  };
  const handleOpenEditModalInPage = (targetDateKey: string, targetHourSlot: string, todoToEdit: TodoItem) => {
    setEditingTodoItem(todoToEdit);
    setEditingTodoSlotDetails({ dateKey: targetDateKey, hourSlot: targetHourSlot });
    setSelectedSlotForTodo({ dateKey: targetDateKey, hourSlot: targetHourSlot });
    setIsTodoModalOpen(true);
  };
  const getTodosForSlot = (targetDateKey: string, targetHourSlot: string): TodoItem[] => {
    return allTodos[targetDateKey]?.[targetHourSlot] || [];
  };

  const handleOpenMeetingNoteModal = (hourSlot: string, noteToEdit?: MeetingNoteItem) => {
    if (!dateKey) return;
    setSelectedSlotForMeetingNote({ dateKey, hourSlot });
    setEditingMeetingNoteItem(noteToEdit || null);
    setEditingMeetingNoteSlotDetails(noteToEdit ? { dateKey, hourSlot } : null);
    setIsMeetingNoteModalOpen(true);
  };
  const handleCloseMeetingNoteModal = () => {
    setIsMeetingNoteModalOpen(false); setSelectedSlotForMeetingNote(null); setEditingMeetingNoteItem(null); setEditingMeetingNoteSlotDetails(null);
  };
  const handleSaveMeetingNoteFromModal = (currentDateKey: string, hourSlot: string, savedNote: MeetingNoteItem) => {
    setAllMeetingNotes(prev => {
      const slotNotes = prev[currentDateKey]?.[hourSlot] || [];
      const idx = slotNotes.findIndex(n => n.id === savedNote.id);
      const updatedSlot = idx > -1 ? slotNotes.map((n, i) => i === idx ? savedNote : n) : [...slotNotes, savedNote];
      const newAll = { ...prev, [currentDateKey]: { ...(prev[currentDateKey] || {}), [hourSlot]: updatedSlot } };
      saveAllMeetingNotesToLocalStorage(newAll); return newAll;
    });
  };
  const handleDeleteMeetingNoteInPage = (targetDateKey: string, targetHourSlot: string, noteId: string) => {
    setAllMeetingNotes(prev => {
      const slotNotes = prev[targetDateKey]?.[targetHourSlot] || [];
      const updatedSlot = slotNotes.filter(n => n.id !== noteId);
      const newAll = { ...prev, [targetDateKey]: { ...(prev[targetDateKey] || {}), [hourSlot]: updatedSlot } };
      saveAllMeetingNotesToLocalStorage(newAll); return newAll;
    });
  };
  const handleDeleteNoteFromModal = (noteId: string) => {
    if (selectedSlotForMeetingNote) handleDeleteMeetingNoteInPage(selectedSlotForMeetingNote.dateKey, selectedSlotForMeetingNote.hourSlot, noteId);
  };
  const handleOpenEditMeetingNoteModalInPage = (targetDateKey: string, targetHourSlot: string, noteToEdit: MeetingNoteItem) => {
    handleOpenMeetingNoteModal(hourSlot, noteToEdit);
  };
  const getMeetingNotesForSlot = (targetDateKey: string, targetHourSlot: string): MeetingNoteItem[] => {
    return allMeetingNotes[targetDateKey]?.[targetHourSlot] || [];
  };

  const handleOpenShareLinkModal = (hourSlot: string, linkToEdit?: ShareLinkItem) => {
    if (!dateKey) return;
    setSelectedSlotForShareLink({ dateKey, hourSlot });
    setEditingShareLinkItem(linkToEdit || null);
    setEditingShareLinkSlotDetails(linkToEdit ? { dateKey, hourSlot } : null);
    setIsShareLinkModalOpen(true);
  };
  const handleCloseShareLinkModal = () => {
    setIsShareLinkModalOpen(false); setSelectedSlotForShareLink(null); setEditingShareLinkItem(null); setEditingShareLinkSlotDetails(null);
  };
  const handleSaveShareLinkFromModal = (currentDateKey: string, hourSlot: string, savedLink: ShareLinkItem) => {
    setAllShareLinks(prev => {
        const slotLinks = prev[currentDateKey]?.[hourSlot] || [];
        const idx = slotLinks.findIndex(l => l.id === savedLink.id);
        const updatedSlot = idx > -1 ? slotLinks.map((l, i) => i === idx ? savedLink : l) : [...slotLinks, savedLink];
        const newAll = { ...prev, [currentDateKey]: { ...(prev[currentDateKey] || {}), [hourSlot]: updatedSlot } };
        saveAllShareLinksToLocalStorage(newAll); return newAll;
    });
  };
  const handleDeleteShareLinkInPage = (targetDateKey: string, targetHourSlot: string, linkId: string) => {
    setAllShareLinks(prev => {
        const slotLinks = prev[targetDateKey]?.[targetHourSlot] || [];
        const updatedSlot = slotLinks.filter(l => l.id !== linkId);
        const newAll = { ...prev, [targetDateKey]: { ...(prev[targetDateKey] || {}), [hourSlot]: updatedSlot } };
        saveAllShareLinksToLocalStorage(newAll); return newAll;
    });
  };
  const handleDeleteLinkFromModal = (linkId: string) => {
    if (selectedSlotForShareLink) handleDeleteShareLinkInPage(selectedSlotForShareLink.dateKey, selectedSlotForShareLink.hourSlot, linkId);
  };
  const handleOpenEditShareLinkModalInPage = (targetDateKey: string, targetHourSlot: string, linkToEdit: ShareLinkItem) => {
    handleOpenShareLinkModal(hourSlot, linkToEdit);
  };
  const getShareLinksForSlot = (targetDateKey: string, targetHourSlot: string): ShareLinkItem[] => {
    return allShareLinks[targetDateKey]?.[targetHourSlot] || [];
  };

  const handleOpenReflectionModal = (hourSlot: string, reflectionToEdit?: ReflectionItem) => {
    if (!dateKey) return;
    setSelectedSlotForReflection({ dateKey, hourSlot });
    setEditingReflectionItem(reflectionToEdit || null);
    setEditingReflectionSlotDetails(reflectionToEdit ? { dateKey, hourSlot } : null);
    setIsReflectionModalOpen(true);
  };
  const handleCloseReflectionModal = () => {
    setIsReflectionModalOpen(false); setSelectedSlotForReflection(null); setEditingReflectionItem(null); setEditingReflectionSlotDetails(null);
  };
  const handleSaveReflectionFromModal = (currentDateKey: string, hourSlot: string, savedReflection: ReflectionItem) => {
    setAllReflections(prev => {
        const slotReflections = prev[currentDateKey]?.[hourSlot] || [];
        const idx = slotReflections.findIndex(r => r.id === savedReflection.id);
        const updatedSlot = idx > -1 ? slotReflections.map((r, i) => i === idx ? savedReflection : r) : [...slotReflections, savedReflection];
        const newAll = { ...prev, [currentDateKey]: { ...(prev[currentDateKey] || {}), [hourSlot]: updatedSlot } };
        saveAllReflectionsToLocalStorage(newAll); return newAll;
    });
  };
  const handleDeleteReflectionInPage = (targetDateKey: string, targetHourSlot: string, reflectionId: string) => {
     setAllReflections(prev => {
        const slotReflections = prev[currentDateKey]?.[targetHourSlot] || [];
        const updatedSlot = slotReflections.filter(r => r.id !== reflectionId);
        const newAll = { ...prev, [targetDateKey]: { ...(prev[targetDateKey] || {}), [targetHourSlot]: updatedSlot } };
        saveAllReflectionsToLocalStorage(newAll); return newAll;
    });
  };
  const handleDeleteReflectionFromModal = (reflectionId: string) => {
    if (selectedSlotForReflection) handleDeleteReflectionInPage(selectedSlotForReflection.dateKey, selectedSlotForReflection.hourSlot, reflectionId);
  };
  const handleOpenEditReflectionModalInPage = (targetDateKey: string, targetHourSlot: string, reflectionToEdit: ReflectionItem) => {
    handleOpenReflectionModal(hourSlot, reflectionToEdit);
  };
  const getReflectionsForSlot = (targetDateKey: string, targetHourSlot: string): ReflectionItem[] => {
    return allReflections[targetDateKey]?.[targetHourSlot] || [];
  };


  const getCategoryTooltipText = (category: CategoryType | null) => {
    if (!category || !tTodoModal.categories[category]) return '';
    return `${tTodoModal.categoryLabel} ${tTodoModal.categories[category]}`;
  };
  const getDeadlineTooltipText = (deadline: TodoItem['deadline']) => {
    if (!deadline || !tTodoModal.deadlines[deadline as keyof typeof tTodoModal.deadlines]) return '';
    return `${tTodoModal.deadlineLabel} ${tTodoModal.deadlines[deadline as keyof typeof tTodoModal.deadlines]}`;
  };
  const getImportanceTooltipText = (importance: TodoItem['importance']) => {
    if (importance === 'important') return `${tTodoModal.importanceLabel} ${tTodoModal.importances.important}`;
    return '';
  };


  if (!dateKey || !clientPageLoadTime) { // Wait for clientPageLoadTime to be set
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 sm:p-8">
            {/* Can show a loader here if preferred */}
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
        <header className="w-full max-w-4xl mb-8">
          <Link href="/" passHref>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backToWeek}
            </Button>
          </Link>
        </header>

        <main className="w-full max-w-4xl">
          {dailyNoteDisplayMode !== 'pending' && !isFutureDay && (
            <>
              <h1 className="text-3xl font-headline font-semibold text-primary mb-6">
                {t.dayDetailsTitle(dayNameForDisplay)}
              </h1>
              <div className="bg-card p-6 rounded-lg shadow-lg mb-8">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-medium text-foreground mb-2">{t.notesLabel}</h2>
                    {dailyNoteDisplayMode === 'read' ? (
                        <div className="p-3 border rounded-md min-h-[100px] bg-background/50">
                        {dailyNote ? (
                            <ScrollArea className="max-h-48">
                            <p className="text-sm text-foreground whitespace-pre-wrap">{dailyNote}</p>
                            </ScrollArea>
                        ) : (
                            <p className="text-muted-foreground italic">{t.noData}</p>
                        )}
                        </div>
                    ) : (
                        <div>
                        <Textarea
                            value={dailyNote}
                            onChange={(e) => handleDailyNoteChange(e.target.value)}
                            placeholder={t.notesPlaceholder}
                            className="min-h-[100px] bg-background/50 text-sm"
                            maxLength={MAX_DAILY_NOTE_LENGTH}
                        />
                        <div className="text-xs text-muted-foreground text-right mt-1 pr-1">
                            {dailyNote.length}/{MAX_DAILY_NOTE_LENGTH}
                        </div>
                        </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-foreground mb-2">{t.ratingLabel}</h2>
                    <div className="p-3 border rounded-md bg-background/50">
                      <p className="text-muted-foreground">{rating || t.noData}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">
              {t.timeIntervalsTitle(dayNameForDisplay)}
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {timeIntervals.map(interval => {
                const hourlySlotsForInterval = generateHourlySlots(interval.label);
                const hasContentInAnySlotOfInterval = hourlySlotsForInterval.some(slot =>
                  (getTodosForSlot(dateKey, slot).length > 0) ||
                  (getMeetingNotesForSlot(dateKey, slot).length > 0) ||
                  (getShareLinksForSlot(dateKey, slot).length > 0) ||
                  (getReflectionsForSlot(dateKey, slot).length > 0)
                );
                
                let shouldHideThisInterval = false;
                if (isViewingCurrentDay && clientPageLoadTime) {
                  const pageLoadHour = clientPageLoadTime.getHours();
                  const pageLoadMinute = clientPageLoadTime.getMinutes();
                  const pageLoadTotalMinutes = pageLoadHour * 60 + pageLoadMinute;

                  const match = interval.label.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
                  if (match) {
                    const [, startTimeStr, endTimeStr] = match;
                    const [startH,] = startTimeStr.split(':').map(Number);
                    let [endH, endM] = endTimeStr.split(':').map(Number);
                    if (endTimeStr === "24:00" || (endTimeStr === "00:00" && startH > 0 && endH === 0)) endH = 24;

                    const intervalEndTotalMinutes = endH * 60 + endM;
                    if (intervalEndTotalMinutes <= pageLoadTotalMinutes && !hasContentInAnySlotOfInterval) {
                      shouldHideThisInterval = true;
                    }
                  }
                }
                if (shouldHideThisInterval) return null;


                const hourlySlots = generateHourlySlots(interval.label);
                const mainTitle = interval.label.split(' (')[0];
                const timeRangeSubtext = interval.label.includes('(') ? `(${interval.label.split(' (')[1]}` : '';
                const isCurrentActiveInterval = isViewingCurrentDay && activeIntervalKey === interval.key;

                return (
                  <div
                    key={interval.key}
                    ref={el => { if (el) intervalRefs.current[interval.key] = el; }}
                    className={cn(
                        "bg-card p-4 rounded-lg shadow-lg transition-all duration-300",
                        isCurrentActiveInterval && "ring-2 ring-primary shadow-xl scale-[1.01]"
                    )}
                  >
                    <h3 className="text-lg font-medium text-foreground mb-1">{mainTitle}</h3>
                    {timeRangeSubtext && <p className="text-xs text-muted-foreground mb-2">{timeRangeSubtext}</p>}
                    <div className="h-1 w-full bg-primary/30 rounded-full mb-3"></div>

                    {hourlySlots.length > 0 ? (
                      <div className="space-y-3 mt-4">
                        {hourlySlots.map((slot, slotIndex) => {
                          const todosForSlot = getTodosForSlot(dateKey, slot);
                          const meetingNotesForSlot = getMeetingNotesForSlot(dateKey, slot);
                          const shareLinksForSlot = getShareLinksForSlot(dateKey, slot);
                          const reflectionsForSlot = getReflectionsForSlot(dateKey, slot);
                          const hasAnyContentForThisSlot = todosForSlot.length > 0 || meetingNotesForSlot.length > 0 || shareLinksForSlot.length > 0 || reflectionsForSlot.length > 0;

                          let isAddingDisabledForThisSlot = false;
                          if (isViewingCurrentDay && clientPageLoadTime && dateKey && dayProperties.dateObject) {
                            const dateKeyDate = dayProperties.dateObject;
                            const clientDatePart = new Date(clientPageLoadTime.getFullYear(), clientPageLoadTime.getMonth(), clientPageLoadTime.getDate());
                            
                            if (dateIsAfter(clientDatePart, dateKeyDate)) {
                              isAddingDisabledForThisSlot = true;
                            } else if (format(clientDatePart, 'yyyy-MM-dd') === format(dateKeyDate, 'yyyy-MM-dd')) {
                                const slotTimeMatch = slot.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
                                if (slotTimeMatch) {
                                    const slotStartTimeStr = slotTimeMatch[1];
                                    const slotEndTimeStr = slotTimeMatch[2];
                                    let slotEndHour = parseInt(slotEndTimeStr.split(':')[0]);
                                    const slotEndMinute = parseInt(slotEndTimeStr.split(':')[1]);

                                    if (slotEndHour === 0 && slotEndMinute === 0 && slotStartTimeStr.split(':')[0] !== "00") {
                                        slotEndHour = 24;
                                    }
                                    const slotEndTotalMinutes = slotEndHour * 60 + slotEndMinute;

                                    const pageLoadHour = clientPageLoadTime.getHours();
                                    const pageLoadMinute = clientPageLoadTime.getMinutes();
                                    const pageLoadTotalMinutes = pageLoadHour * 60 + pageLoadMinute;

                                    if (slotEndTotalMinutes <= pageLoadTotalMinutes) {
                                        isAddingDisabledForThisSlot = true;
                                    }
                                }
                            }
                          }


                          let shouldHideThisSlot = false;
                          if (isViewingCurrentDay && clientPageLoadTime) {
                            const slotTimeMatch = slot.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
                            if (slotTimeMatch) {
                              const slotEndTimeStr = slotTimeMatch[2];
                              let slotEndHour = parseInt(slotEndTimeStr.split(':')[0]);
                              const slotEndMinute = parseInt(slotEndTimeStr.split(':')[1]);
                              if (slotEndHour === 0 && slotEndMinute === 0 && slotTimeMatch[1].split(':')[0] !== "00") {
                                 slotEndHour = 24;
                              }
                              const slotEndTotalMinutes = slotEndHour * 60 + slotEndMinute;
                              
                              const pageLoadHour = clientPageLoadTime.getHours();
                              const pageLoadMinute = clientPageLoadTime.getMinutes();
                              const pageLoadTotalMinutes = pageLoadHour * 60 + pageLoadMinute;
                              if (slotEndTotalMinutes <= pageLoadTotalMinutes && !hasAnyContentForThisSlot) {
                                shouldHideThisSlot = true;
                              }
                            }
                          }
                          if (shouldHideThisSlot) return null;

                          let sectionsRenderedInSlotCount = 0;

                          return (
                            <div key={slotIndex} className="p-3 border rounded-md bg-muted/20 shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-baseline">
                                  <p className="text-sm font-semibold text-foreground/90">{slot}</p>
                                  {!hasAnyContentForThisSlot && (
                                    <p className="text-xs text-muted-foreground italic ml-2">
                                      {t.noItemsForHour}
                                    </p>
                                  )}
                                </div>
                                <div className="flex space-x-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleOpenTodoModal(slot)} disabled={isAddingDisabledForThisSlot}>
                                        <ListChecks className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>{t.addTodo}</p></TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleOpenMeetingNoteModal(slot)} disabled={isAddingDisabledForThisSlot}>
                                        <ClipboardList className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>{t.addMeetingNote}</p></TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleOpenShareLinkModal(slot)} disabled={isAddingDisabledForThisSlot}>
                                        <LinkIconLucide className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>{t.addLink}</p></TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleOpenReflectionModal(slot)} disabled={isAddingDisabledForThisSlot}>
                                        <MessageSquareText className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>{t.addReflection}</p></TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>

                              {todosForSlot.length > 0 && (() => {
                                sectionsRenderedInSlotCount++;
                                return (
                                <ul className="space-y-2 p-px mb-3 group/todolist">
                                  {todosForSlot.map((todo) => {
                                    const CategoryIcon = todo.category ? CategoryIcons[todo.category] : null;
                                    const DeadlineIcon = todo.deadline ? DeadlineIcons[todo.deadline] : null;
                                    return (
                                      <li key={todo.id} className="flex items-center justify-between group/todoitem hover:bg-muted/30 p-1.5 rounded-md transition-colors">
                                        <div className="flex items-center space-x-2 flex-grow min-w-0">
                                          <Checkbox
                                            id={`daypage-todo-${dateKey}-${slot}-${todo.id}`}
                                            checked={todo.completed}
                                            onCheckedChange={() => handleToggleTodoCompletionInPage(dateKey, slot, todo.id)}
                                            aria-label={todo.completed ? t.markIncomplete : t.markComplete}
                                            className="border-primary/50 shrink-0"
                                          />
                                          <div className="flex items-center space-x-1 shrink-0">
                                            {CategoryIcon && todo.category && (
                                              <Tooltip><TooltipTrigger asChild><CategoryIcon className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>{getCategoryTooltipText(todo.category)}</p></TooltipContent></Tooltip>
                                            )}
                                            {DeadlineIcon && todo.deadline && (
                                              <Tooltip><TooltipTrigger asChild><DeadlineIcon className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>{getDeadlineTooltipText(todo.deadline)}</p></TooltipContent></Tooltip>
                                            )}
                                            {todo.importance === 'important' && (
                                              <Tooltip><TooltipTrigger asChild><StarIcon className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /></TooltipTrigger><TooltipContent><p>{getImportanceTooltipText(todo.importance)}</p></TooltipContent></Tooltip>
                                            )}
                                          </div>
                                          <label
                                            htmlFor={`daypage-todo-${dateKey}-${slot}-${todo.id}`}
                                            className={cn("text-xs cursor-pointer flex-1 min-w-0 truncate", todo.completed ? 'line-through text-muted-foreground/80' : 'text-foreground/90')}
                                            title={todo.text}
                                          >
                                            {todo.text}
                                          </label>
                                        </div>
                                        <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/todoitem:opacity-100 transition-opacity">
                                          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => handleOpenEditModalInPage(dateKey, slot, todo)}><FileEdit className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.editItem}</p></TooltipContent></Tooltip>
                                          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteTodoInPage(dateKey, slot, todo.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.deleteItem}</p></TooltipContent></Tooltip>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>
                                );
                              })()}

                              {meetingNotesForSlot.length > 0 && (() => {
                                const isFirstInSectionGroup = sectionsRenderedInSlotCount === 0;
                                sectionsRenderedInSlotCount++;
                                return (
                                <>
                                 <h4 className={cn("text-xs font-semibold text-muted-foreground mb-2 pl-1 group/meetingnotelist", !isFirstInSectionGroup && "mt-4")}>{t.meetingNotesSectionTitle}</h4>
                                    <ul className="space-y-2 p-px mb-3">
                                      {meetingNotesForSlot.map((note) => (
                                          <li key={note.id} className="flex items-center justify-between group/noteitem hover:bg-muted/30 p-1.5 rounded-md transition-colors">
                                            <span className="text-xs text-foreground/90 flex-1 min-w-0 truncate" title={note.title}>{note.title || t.noData}</span>
                                            <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/noteitem:opacity-100 transition-opacity">
                                              <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => handleOpenEditMeetingNoteModalInPage(dateKey, slot, note)}><FileEdit className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.editMeetingNote}</p></TooltipContent></Tooltip>
                                              <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteMeetingNoteInPage(dateKey, slot, note.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.deleteMeetingNote}</p></TooltipContent></Tooltip>
                                            </div>
                                          </li>
                                        ))}
                                    </ul>
                                </>
                                );
                              })()}

                              {shareLinksForSlot.length > 0 && (() => {
                                const isFirstInSectionGroup = sectionsRenderedInSlotCount === 0;
                                sectionsRenderedInSlotCount++;
                                return (
                                <>
                                  <h4 className={cn("text-xs font-semibold text-muted-foreground mb-2 pl-1 group/linklist", !isFirstInSectionGroup && "mt-4")}>{t.linksSectionTitle}</h4>
                                    <ul className="space-y-2 p-px mb-3">
                                      {shareLinksForSlot.map((link) => (
                                        <li key={link.id} className="flex items-center justify-between group/linkitem hover:bg-muted/30 p-1.5 rounded-md transition-colors">
                                          <div className="flex-1 min-w-0 flex items-center">
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate" title={link.title || link.url}>{link.title || link.url}</a>
                                            {link.category && (
                                                <span 
                                                  className="text-xs rounded-full px-2 py-0.5 ml-2 shrink-0"
                                                  style={{ backgroundColor: getTagColor(link.category) }}
                                                >
                                                  {link.category}
                                                </span>
                                            )}
                                          </div>
                                          <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/linkitem:opacity-100 transition-opacity">
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => handleOpenEditShareLinkModalInPage(dateKey, slot, link)}><FileEdit className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.editLink}</p></TooltipContent></Tooltip>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteShareLinkInPage(dateKey, slot, link.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.deleteLink}</p></TooltipContent></Tooltip>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                </>
                                );
                              })()}

                              {reflectionsForSlot.length > 0 && (() => {
                                const isFirstInSectionGroup = sectionsRenderedInSlotCount === 0;
                                sectionsRenderedInSlotCount++;
                                return (
                                <>
                                  <h4 className={cn("text-xs font-semibold text-muted-foreground mb-2 pl-1 group/reflectionlist", !isFirstInSectionGroup && "mt-4")}>{t.reflectionsSectionTitle}</h4>
                                    <ul className="space-y-2 p-px"> {/* Removed mb-3 here as it's the last section */}
                                      {reflectionsForSlot.map((reflection) => (
                                        <li key={reflection.id} className="flex items-start justify-between group/reflectionitem hover:bg-muted/30 p-1.5 rounded-md transition-colors">
                                          <ScrollArea className="max-h-20 w-full mr-2"><p className="text-xs text-foreground/90 whitespace-pre-wrap break-words" title={reflection.text}>{reflection.text}</p></ScrollArea>
                                          <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/reflectionitem:opacity-100 transition-opacity">
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => handleOpenEditReflectionModalInPage(dateKey, slot, reflection)}><FileEdit className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.editReflection}</p></TooltipContent></Tooltip>
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteReflectionInPage(dateKey, slot, reflection.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.deleteReflection}</p></TooltipContent></Tooltip>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                </>
                                );
                              })()}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 border rounded-md bg-background/50 mt-4">
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
      {isTodoModalOpen && selectedSlotForTodo && (
        <TodoModal
          isOpen={isTodoModalOpen}
          onClose={handleCloseTodoModal}
          onSaveTodos={handleSaveTodosFromModal}
          dateKey={selectedSlotForTodo.dateKey}
          hourSlot={selectedSlotForTodo.hourSlot}
          initialTodos={getTodosForSlot(selectedSlotForTodo.dateKey, selectedSlotForTodo.hourSlot)}
          translations={tTodoModal}
          defaultEditingTodoId={editingTodoItem && editingTodoSlotDetails?.dateKey === selectedSlotForTodo.dateKey && editingTodoSlotDetails?.hourSlot === selectedSlotForTodo.hourSlot ? editingTodoItem.id : undefined}
        />
      )}
      {isMeetingNoteModalOpen && selectedSlotForMeetingNote && (
        <MeetingNoteModal
            isOpen={isMeetingNoteModalOpen}
            onClose={handleCloseMeetingNoteModal}
            onSave={handleSaveMeetingNoteFromModal}
            onDelete={editingMeetingNoteItem ? handleDeleteNoteFromModal : undefined}
            dateKey={selectedSlotForMeetingNote.dateKey}
            hourSlot={selectedSlotForMeetingNote.hourSlot}
            initialData={editingMeetingNoteItem && editingMeetingNoteSlotDetails?.dateKey === selectedSlotForMeetingNote.dateKey && editingMeetingNoteSlotDetails?.hourSlot === selectedSlotForMeetingNote.hourSlot ? editingMeetingNoteItem : null}
            translations={tMeetingNoteModal}
        />
      )}
      {isShareLinkModalOpen && selectedSlotForShareLink && (
        <ShareLinkModal
            isOpen={isShareLinkModalOpen}
            onClose={handleCloseShareLinkModal}
            onSave={handleSaveShareLinkFromModal}
            onDelete={editingShareLinkItem ? handleDeleteLinkFromModal : undefined}
            dateKey={selectedSlotForShareLink.dateKey}
            hourSlot={selectedSlotForShareLink.hourSlot}
            initialData={editingShareLinkItem && editingShareLinkSlotDetails?.dateKey === selectedSlotForShareLink.dateKey && editingShareLinkSlotDetails?.hourSlot === selectedSlotForShareLink.hourSlot ? editingShareLinkItem : null}
            translations={tShareLinkModal}
        />
      )}
      {isReflectionModalOpen && selectedSlotForReflection && (
        <ReflectionModal
            isOpen={isReflectionModalOpen}
            onClose={handleCloseReflectionModal}
            onSave={handleSaveReflectionFromModal}
            onDelete={editingReflectionItem ? handleDeleteReflectionFromModal : undefined}
            dateKey={selectedSlotForReflection.dateKey}
            hourSlot={selectedSlotForReflection.hourSlot}
            initialData={editingReflectionItem && editingReflectionSlotDetails?.dateKey === selectedSlotForReflection.dateKey && editingReflectionSlotDetails?.hourSlot === selectedSlotForReflection.hourSlot ? editingReflectionItem : null}
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
