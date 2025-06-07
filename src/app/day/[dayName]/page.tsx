
// src/app/day/[dayName]/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { ParsedUrlQuery } from 'querystring';
import { useParams } from 'next/navigation';
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

  // If interval is 18:00-00:00, 00:00 means 24:00 for loop end
  if (endTimeStr === "00:00" && startHour !== 0 && endHour === 0) {
      endHour = 24;
  }

  const slots: string[] = [];
  if (startHour > endHour && !(endHour === 0 && startHour > 0) ) {
     // This case should ideally not happen if 00:00 is correctly handled as 24 for intervals like 18:00-00:00
     if (!(startHour < 24 && endHour === 0)) { // Allow 23:00 to 00:00 by making endHour 24
        console.warn(`Start hour ${startHour} is not before end hour ${endHour} for ${intervalLabelWithTime}`);
        return [];
     }
  }

  for (let h = startHour; h < endHour; h++) {
    const currentSlotStart = `${String(h).padStart(2, '0')}:00`;
    const nextHour = h + 1;
    // For the slot 23:00, nextHour will be 24, so slot will be "23:00 - 24:00"
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
    timeIntervalsTitle: '当日规划',
    midnight: '凌晨 (00:00 - 05:00)',
    earlyMorning: '清晨 (05:00 - 09:00)',
    morning: '上午 (09:00 - 12:00)',
    noon: '中午 (12:00 - 14:00)',
    afternoon: '下午 (14:00 - 18:00)',
    evening: '晚上 (18:00 - 24:00)', // Note: 24:00 is used for internal logic
    activitiesPlaceholder: (intervalName: string) => `记录${intervalName.split(' ')[0]}的活动...`,
    addTodo: '添加待办事项',
    addMeetingNote: '添加会议记录',
    addLink: '添加分享链接',
    addReflection: '添加个人感悟',
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
        modalTitleNew: '新个人感悟',
        modalTitleEdit: '编辑感悟',
        modalDescription: '在此处记录您的个人感悟。',
        textLabel: '感悟内容:',
        textPlaceholder: '输入您的感悟...',
        saveButton: '保存感悟',
        updateButton: '更新感悟',
        cancelButton: '取消',
        deleteButton: '删除感悟',
    } as ReflectionModalTranslations,
    reflectionsSectionTitle: '个人感悟',
    noReflectionsForHour: '此时间段暂无个人感悟。',
    editReflection: '编辑感悟',
    deleteReflection: '删除感悟',
    daysOfWeek: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
  },
  'en': {
    dayDetailsTitle: (dayName: string) => `${dayName} - Details`,
    backToWeek: 'Back to Week View',
    notesLabel: 'Daily Summary:',
    ratingLabel: 'Daily Rating:',
    noData: 'No data available',
    notesPlaceholder: 'Write your summary for the day...',
    summaryAvailableLater: 'Summary can be written after 6 PM.',
    timeIntervalsTitle: 'Daily Schedule',
    midnight: 'Midnight (00:00 - 05:00)',
    earlyMorning: 'Early Morning (05:00 - 09:00)',
    morning: 'Morning (09:00 - 12:00)',
    noon: 'Noon (12:00 - 14:00)',
    afternoon: 'Afternoon (14:00 - 18:00)',
    evening: 'Evening (18:00 - 24:00)', // Note: 24:00 is used for internal logic
    activitiesPlaceholder: (intervalName: string) => `Log activities for ${intervalName.split(' (')[0]}...`,
    addTodo: 'Add To-do',
    addMeetingNote: 'Add Meeting Note',
    addLink: 'Add Link',
    addReflection: 'Add Reflection',
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
        modalTitleNew: 'New Personal Reflection',
        modalTitleEdit: 'Edit Reflection',
        modalDescription: 'Record your personal reflections here.',
        textLabel: 'Reflection:',
        textPlaceholder: 'Enter your reflection...',
        saveButton: 'Save Reflection',
        updateButton: 'Update Reflection',
        cancelButton: 'Cancel',
        deleteButton: 'Delete Reflection',
    } as ReflectionModalTranslations,
    reflectionsSectionTitle: 'Personal Reflections',
    noReflectionsForHour: 'No reflections recorded for this hour.',
    editReflection: 'Edit Reflection',
    deleteReflection: 'Delete Reflection',
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  }
};

type LanguageKey = keyof typeof translations;

interface SlotDetails {
  dayName: string;
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


export default function DayDetailPage() {
  const params = useParams();
  const dayName = typeof params.dayName === 'string' ? decodeURIComponent(params.dayName) : "无效日期";

  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [isAfter6PMToday, setIsAfter6PMToday] = useState<boolean>(false);

  // Daily Notes state
  const [allDailyNotes, setAllDailyNotes] = useState<Record<string, string>>({});

  // To-do states
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [selectedSlotForTodo, setSelectedSlotForTodo] = useState<SlotDetails | null>(null);
  const [allTodos, setAllTodos] = useState<Record<string, Record<string, TodoItem[]>>>({});
  const [editingTodoItem, setEditingTodoItem] = useState<TodoItem | null>(null);
  const [editingTodoSlotDetails, setEditingTodoSlotDetails] = useState<SlotDetails | null>(null);

  // Meeting Note states
  const [isMeetingNoteModalOpen, setIsMeetingNoteModalOpen] = useState(false);
  const [selectedSlotForMeetingNote, setSelectedSlotForMeetingNote] = useState<SlotDetails | null>(null);
  const [allMeetingNotes, setAllMeetingNotes] = useState<Record<string, Record<string, MeetingNoteItem[]>>>({});
  const [editingMeetingNoteItem, setEditingMeetingNoteItem] = useState<MeetingNoteItem | null>(null);
  const [editingMeetingNoteSlotDetails, setEditingMeetingNoteSlotDetails] = useState<SlotDetails | null>(null);

  // Share Link states
  const [isShareLinkModalOpen, setIsShareLinkModalOpen] = useState(false);
  const [selectedSlotForShareLink, setSelectedSlotForShareLink] = useState<SlotDetails | null>(null);
  const [allShareLinks, setAllShareLinks] = useState<Record<string, Record<string, ShareLinkItem[]>>>({});
  const [editingShareLinkItem, setEditingShareLinkItem] = useState<ShareLinkItem | null>(null);
  const [editingShareLinkSlotDetails, setEditingShareLinkSlotDetails] = useState<SlotDetails | null>(null);

  // Reflection states
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [selectedSlotForReflection, setSelectedSlotForReflection] = useState<SlotDetails | null>(null);
  const [allReflections, setAllReflections] = useState<Record<string, Record<string, ReflectionItem[]>>>({});
  const [editingReflectionItem, setEditingReflectionItem] = useState<ReflectionItem | null>(null);
  const [editingReflectionSlotDetails, setEditingReflectionSlotDetails] = useState<SlotDetails | null>(null);

  const intervalRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeIntervalKey, setActiveIntervalKey] = useState<string | null>(null);


  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
    
    const today = new Date();
    setIsAfter6PMToday(today.getHours() >= 18);

    const storedDailyNotes = localStorage.getItem('allWeekDailyNotes');
    if (storedDailyNotes) {
        try {
            setAllDailyNotes(JSON.parse(storedDailyNotes));
        } catch (e) {
            console.error("Failed to parse daily notes from localStorage", e);
        }
    }
    const storedTodos = localStorage.getItem('allWeekTodos');
    if (storedTodos) {
        try {
            setAllTodos(JSON.parse(storedTodos));
        } catch (e) {
            console.error("Failed to parse todos from localStorage", e);
        }
    }
    const storedMeetingNotes = localStorage.getItem('allWeekMeetingNotes');
    if (storedMeetingNotes) {
        try {
            setAllMeetingNotes(JSON.parse(storedMeetingNotes));
        } catch (e) {
            console.error("Failed to parse meeting notes from localStorage", e);
        }
    }
    const storedShareLinks = localStorage.getItem('allWeekShareLinks');
    if (storedShareLinks) {
        try {
            setAllShareLinks(JSON.parse(storedShareLinks));
        } catch (e) {
            console.error("Failed to parse share links from localStorage", e);
        }
    }
    const storedReflections = localStorage.getItem('allWeekReflections');
    if (storedReflections) {
        try {
            setAllReflections(JSON.parse(storedReflections));
        } catch (e) {
            console.error("Failed to parse reflections from localStorage", e);
        }
    }
  }, []);

  const saveAllDailyNotesToLocalStorage = (updatedNotes: Record<string, string>) => {
    try {
        localStorage.setItem('allWeekDailyNotes', JSON.stringify(updatedNotes));
    } catch (e) {
        console.error("Failed to save daily notes to localStorage", e);
    }
  };

  const saveAllTodosToLocalStorage = (updatedTodos: Record<string, Record<string, TodoItem[]>>) => {
    try {
        localStorage.setItem('allWeekTodos', JSON.stringify(updatedTodos));
    } catch (e) {
        console.error("Failed to save todos to localStorage", e);
    }
  };

  const saveAllMeetingNotesToLocalStorage = (updatedNotes: Record<string, Record<string, MeetingNoteItem[]>>) => {
    try {
        localStorage.setItem('allWeekMeetingNotes', JSON.stringify(updatedNotes));
    } catch (e) {
        console.error("Failed to save meeting notes to localStorage", e);
    }
  };

  const saveAllShareLinksToLocalStorage = (updatedLinks: Record<string, Record<string, ShareLinkItem[]>>) => {
    try {
        localStorage.setItem('allWeekShareLinks', JSON.stringify(updatedLinks));
    } catch (e) {
        console.error("Failed to save share links to localStorage", e);
    }
  };

  const saveAllReflectionsToLocalStorage = (updatedReflections: Record<string, Record<string, ReflectionItem[]>>) => {
    try {
        localStorage.setItem('allWeekReflections', JSON.stringify(updatedReflections));
    } catch (e) {
        console.error("Failed to save reflections to localStorage", e);
    }
  };


  const t = translations[currentLanguage];
  const tTodoModal = translations[currentLanguage].todoModal;
  const tMeetingNoteModal = translations[currentLanguage].meetingNoteModal;
  const tShareLinkModal = translations[currentLanguage].shareLinkModal;
  const tReflectionModal = translations[currentLanguage].reflectionModal;

  const dailyNote = allDailyNotes[dayName] || "";
  const rating = ""; // Placeholder for daily rating, if implemented later

  const timeIntervals = useMemo(() => [
    { key: 'midnight', label: t.midnight },
    { key: 'earlyMorning', label: t.earlyMorning },
    { key: 'morning', label: t.morning },
    { key: 'noon', label: t.noon },
    { key: 'afternoon', label: t.afternoon },
    { key: 'evening', label: t.evening }
  ], [t]);

  const handleDailyNoteChange = (newNote: string) => {
    setAllDailyNotes(prev => {
        const updated = {...prev, [dayName]: newNote.substring(0, MAX_DAILY_NOTE_LENGTH) };
        saveAllDailyNotesToLocalStorage(updated);
        return updated;
    });
  };

  const isViewingCurrentDay = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const todayDate = new Date();
    const systemDayIndex = (todayDate.getDay() + 6) % 7; // Monday is 0, Sunday is 6
    const currentLangDays = translations[currentLanguage].daysOfWeek;
    if (!currentLangDays) return false;
    const viewingDayIndex = currentLangDays.findIndex(d => d === dayName);
    return viewingDayIndex === systemDayIndex;
  }, [dayName, currentLanguage]);

  const isFutureDay = useMemo(() => {
    if (typeof window === 'undefined' || !dayName ) return false;
    const daysOfWeekForLang = translations[currentLanguage]?.daysOfWeek;
    if (!daysOfWeekForLang) return false; 
    
    const today = new Date();
    const systemDayIndex = (today.getDay() + 6) % 7; 
    const viewingDayIndex = daysOfWeekForLang.findIndex(d => d === dayName);

    if (viewingDayIndex === -1) return false; 
    return viewingDayIndex > systemDayIndex;
  }, [dayName, currentLanguage]);

  const dailyNoteDisplayMode: DailyNoteDisplayMode = useMemo(() => {
    if (!isViewingCurrentDay) { 
        const todaySystemIndex = (new Date().getDay() + 6) % 7;
        const daysOfWeekForLang = translations[currentLanguage]?.daysOfWeek;
        if (!daysOfWeekForLang) return 'edit'; // Fallback
        const viewingDaySystemIndex = daysOfWeekForLang.findIndex(d => d === dayName);
        return (viewingDaySystemIndex < todaySystemIndex) ? 'read' : 'edit';
    }
    return isAfter6PMToday ? 'edit' : 'pending';
  }, [dayName, currentLanguage, isAfter6PMToday, isViewingCurrentDay]);


  const pageLoadTime = useMemo(() => {
    if (typeof window !== 'undefined') {
        return new Date();
    }
    return new Date(0); 
  }, [dayName, currentLanguage]); 


  useEffect(() => {
    if (!isViewingCurrentDay || typeof window === 'undefined') {
      setActiveIntervalKey(null);
      return;
    }

    const now = new Date(); 
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeTotalMinutes = currentHour * 60 + currentMinute;

    let newActiveKey: string | null = null;
    let firstVisibleIntervalKeyForScroll: string | null = null;
    let currentIntervalKeyForScroll: string | null = null;

    for (const interval of timeIntervals) {
      const hourlySlots = generateHourlySlots(interval.label);
      const hasContentInInterval = hourlySlots.some(slot => 
          (allTodos[dayName]?.[slot]?.length || 0) > 0 ||
          (allMeetingNotes[dayName]?.[slot]?.length || 0) > 0 ||
          (allShareLinks[dayName]?.[slot]?.length || 0) > 0 ||
          (allReflections[dayName]?.[slot]?.length || 0) > 0
      );

      const match = interval.label.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
      if (!match) continue;

      const [, startTimeStr, endTimeStr] = match;
      const [startH, startM] = startTimeStr.split(':').map(Number);
      let [endH, endM] = endTimeStr.split(':').map(Number);
      if (endTimeStr === "24:00" || (endTimeStr === "00:00" && startH > 0 && endH === 0)) endH = 24;


      const intervalStartTotalMinutes = startH * 60 + startM;
      const intervalEndTotalMinutes = endH * 60 + endM;
      
      const pageLoadHourForIntervalCheck = pageLoadTime.getHours();
      const pageLoadMinuteForIntervalCheck = pageLoadTime.getMinutes();
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
    
    setActiveIntervalKey(newActiveKey);

    const targetKeyForScroll = currentIntervalKeyForScroll || firstVisibleIntervalKeyForScroll;

    if (targetKeyForScroll && intervalRefs.current[targetKeyForScroll]) {
      setTimeout(() => {
        intervalRefs.current[targetKeyForScroll]?.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
      }, 100); 
    }
  }, [dayName, currentLanguage, timeIntervals, isViewingCurrentDay, pageLoadTime, allTodos, allMeetingNotes, allShareLinks, allReflections]);


  // --- To-do Modal and Item Handlers ---
  const handleOpenTodoModal = (hourSlot: string) => {
    setSelectedSlotForTodo({ dayName, hourSlot });
    setEditingTodoItem(null);
    setEditingTodoSlotDetails(null);
    setIsTodoModalOpen(true);
  };

  const handleCloseTodoModal = () => {
    setIsTodoModalOpen(false);
    setSelectedSlotForTodo(null);
    setEditingTodoItem(null);
    setEditingTodoSlotDetails(null);
  };

  const handleSaveTodosFromModal = (day: string, hourSlot: string, updatedTodosInSlot: TodoItem[]) => {
    setAllTodos(prevAllTodos => {
      const newAllTodos = {
        ...prevAllTodos,
        [day]: {
          ...(prevAllTodos[day] || {}),
          [hourSlot]: updatedTodosInSlot,
        },
      };
      saveAllTodosToLocalStorage(newAllTodos);
      return newAllTodos;
    });
  };

  const handleToggleTodoCompletionInPage = (targetDay: string, targetHourSlot: string, todoId: string) => {
    setAllTodos(prevAllTodos => {
      const daySlots = prevAllTodos[targetDay] || {};
      const slotTodos = daySlots[targetHourSlot] || [];
      const updatedSlotTodos = slotTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      );
      const newAllTodos = {
        ...prevAllTodos,
        [targetDay]: {
          ...daySlots,
          [targetHourSlot]: updatedSlotTodos,
        },
      };
      saveAllTodosToLocalStorage(newAllTodos);
      return newAllTodos;
    });
  };

  const handleDeleteTodoInPage = (targetDay: string, targetHourSlot: string, todoId: string) => {
    setAllTodos(prevAllTodos => {
      const daySlots = prevAllTodos[targetDay] || {};
      const slotTodos = daySlots[targetHourSlot] || [];
      const updatedSlotTodos = slotTodos.filter(todo => todo.id !== todoId);
      const newAllTodos = {
        ...prevAllTodos,
        [targetDay]: {
          ...daySlots,
          [targetHourSlot]: updatedSlotTodos,
        },
      };
      saveAllTodosToLocalStorage(newAllTodos);
      return newAllTodos;
    });
  };

  const handleOpenEditModalInPage = (targetDay: string, targetHourSlot: string, todoToEdit: TodoItem) => {
    setEditingTodoItem(todoToEdit);
    setEditingTodoSlotDetails({ dayName: targetDay, hourSlot: targetHourSlot });
    setSelectedSlotForTodo({ dayName: targetDay, hourSlot: targetHourSlot });
    setIsTodoModalOpen(true);
  };

  const getTodosForSlot = (targetDayName: string, targetHourSlot: string): TodoItem[] => {
    return allTodos[targetDayName]?.[targetHourSlot] || [];
  };

  // --- Meeting Note Modal and Item Handlers ---
  const handleOpenMeetingNoteModal = (hourSlot: string, noteToEdit?: MeetingNoteItem) => {
    setSelectedSlotForMeetingNote({ dayName, hourSlot });
    setEditingMeetingNoteItem(noteToEdit || null);
    setEditingMeetingNoteSlotDetails(noteToEdit ? { dayName, hourSlot } : null);
    setIsMeetingNoteModalOpen(true);
  };

  const handleCloseMeetingNoteModal = () => {
    setIsMeetingNoteModalOpen(false);
    setSelectedSlotForMeetingNote(null);
    setEditingMeetingNoteItem(null);
    setEditingMeetingNoteSlotDetails(null);
  };

  const handleSaveMeetingNoteFromModal = (day: string, hourSlot: string, savedNote: MeetingNoteItem) => {
    setAllMeetingNotes(prevAllNotes => {
      const dayNotes = prevAllNotes[day] || {};
      const slotNotes = dayNotes[hourSlot] || [];

      const existingNoteIndex = slotNotes.findIndex(n => n.id === savedNote.id);
      let updatedSlotNotes;
      if (existingNoteIndex > -1) {
        updatedSlotNotes = slotNotes.map((n, index) => index === existingNoteIndex ? savedNote : n);
      } else {
        updatedSlotNotes = [...slotNotes, savedNote];
      }

      const newAllNotes = {
        ...prevAllNotes,
        [day]: {
          ...dayNotes,
          [hourSlot]: updatedSlotNotes,
        },
      };
      saveAllMeetingNotesToLocalStorage(newAllNotes);
      return newAllNotes;
    });
  };

  const handleDeleteMeetingNoteInPage = (targetDay: string, targetHourSlot: string, noteId: string) => {
    setAllMeetingNotes(prevAllNotes => {
      const dayNotes = prevAllNotes[targetDay] || {};
      const slotNotes = dayNotes[targetHourSlot] || [];
      const updatedSlotNotes = slotNotes.filter(note => note.id !== noteId);
      const newAllNotes = {
        ...prevAllNotes,
        [targetDay]: {
          ...dayNotes,
          [targetHourSlot]: updatedSlotNotes,
        },
      };
      saveAllMeetingNotesToLocalStorage(newAllNotes);
      return newAllNotes;
    });
  };

  const handleDeleteNoteFromModal = (noteId: string) => {
    if (selectedSlotForMeetingNote) {
        handleDeleteMeetingNoteInPage(selectedSlotForMeetingNote.dayName, selectedSlotForMeetingNote.hourSlot, noteId);
    }
  };

  const handleOpenEditMeetingNoteModalInPage = (targetDay: string, targetHourSlot: string, noteToEdit: MeetingNoteItem) => {
    handleOpenMeetingNoteModal(targetHourSlot, noteToEdit);
  };

  const getMeetingNotesForSlot = (targetDayName: string, targetHourSlot: string): MeetingNoteItem[] => {
    return allMeetingNotes[targetDayName]?.[targetHourSlot] || [];
  };

  // --- Share Link Modal and Item Handlers ---
  const handleOpenShareLinkModal = (hourSlot: string, linkToEdit?: ShareLinkItem) => {
    setSelectedSlotForShareLink({ dayName, hourSlot });
    setEditingShareLinkItem(linkToEdit || null);
    setEditingShareLinkSlotDetails(linkToEdit ? { dayName, hourSlot } : null);
    setIsShareLinkModalOpen(true);
  };

  const handleCloseShareLinkModal = () => {
    setIsShareLinkModalOpen(false);
    setSelectedSlotForShareLink(null);
    setEditingShareLinkItem(null);
    setEditingShareLinkSlotDetails(null);
  };

  const handleSaveShareLinkFromModal = (day: string, hourSlot: string, savedLink: ShareLinkItem) => {
    setAllShareLinks(prevAllLinks => {
      const dayLinks = prevAllLinks[day] || {};
      const slotLinks = dayLinks[hourSlot] || [];

      const existingLinkIndex = slotLinks.findIndex(l => l.id === savedLink.id);
      let updatedSlotLinks;
      if (existingLinkIndex > -1) {
        updatedSlotLinks = slotLinks.map((l, index) => index === existingLinkIndex ? savedLink : l);
      } else {
        updatedSlotLinks = [...slotLinks, savedLink];
      }

      const newAllLinks = {
        ...prevAllLinks,
        [day]: {
          ...dayLinks,
          [hourSlot]: updatedSlotLinks,
        },
      };
      saveAllShareLinksToLocalStorage(newAllLinks);
      return newAllLinks;
    });
  };

  const handleDeleteShareLinkInPage = (targetDay: string, targetHourSlot: string, linkId: string) => {
    setAllShareLinks(prevAllLinks => {
      const dayLinks = prevAllLinks[targetDay] || {};
      const slotLinks = dayLinks[targetHourSlot] || [];
      const updatedSlotLinks = slotLinks.filter(link => link.id !== linkId);
      const newAllLinks = {
        ...prevAllLinks,
        [targetDay]: {
          ...dayLinks,
          [targetHourSlot]: updatedSlotLinks,
        },
      };
      saveAllShareLinksToLocalStorage(newAllLinks);
      return newAllLinks;
    });
  };

  const handleDeleteLinkFromModal = (linkId: string) => {
    if (selectedSlotForShareLink) {
      handleDeleteShareLinkInPage(selectedSlotForShareLink.dayName, selectedSlotForShareLink.hourSlot, linkId);
    }
  };

  const handleOpenEditShareLinkModalInPage = (targetDay: string, targetHourSlot: string, linkToEdit: ShareLinkItem) => {
    handleOpenShareLinkModal(targetHourSlot, linkToEdit);
  };

  const getShareLinksForSlot = (targetDayName: string, targetHourSlot: string): ShareLinkItem[] => {
    return allShareLinks[targetDayName]?.[targetHourSlot] || [];
  };

  // --- Reflection Modal and Item Handlers ---
  const handleOpenReflectionModal = (hourSlot: string, reflectionToEdit?: ReflectionItem) => {
    setSelectedSlotForReflection({ dayName, hourSlot });
    setEditingReflectionItem(reflectionToEdit || null);
    setEditingReflectionSlotDetails(reflectionToEdit ? { dayName, hourSlot } : null);
    setIsReflectionModalOpen(true);
  };

  const handleCloseReflectionModal = () => {
    setIsReflectionModalOpen(false);
    setSelectedSlotForReflection(null);
    setEditingReflectionItem(null);
    setEditingReflectionSlotDetails(null);
  };

  const handleSaveReflectionFromModal = (day: string, hourSlot: string, savedReflection: ReflectionItem) => {
    setAllReflections(prevAllReflections => {
      const dayReflections = prevAllReflections[day] || {};
      const slotReflections = dayReflections[hourSlot] || [];

      const existingReflectionIndex = slotReflections.findIndex(r => r.id === savedReflection.id);
      let updatedSlotReflections;
      if (existingReflectionIndex > -1) {
        updatedSlotReflections = slotReflections.map((r, index) => index === existingReflectionIndex ? savedReflection : r);
      } else {
        updatedSlotReflections = [...slotReflections, savedReflection];
      }

      const newAllReflections = {
        ...prevAllReflections,
        [day]: {
          ...dayReflections,
          [hourSlot]: updatedSlotReflections,
        },
      };
      saveAllReflectionsToLocalStorage(newAllReflections);
      return newAllReflections;
    });
  };

  const handleDeleteReflectionInPage = (targetDay: string, targetHourSlot: string, reflectionId: string) => {
    setAllReflections(prevAllReflections => {
      const dayReflections = prevAllReflections[targetDay] || {};
      const slotReflections = dayReflections[targetHourSlot] || [];
      const updatedSlotReflections = slotReflections.filter(reflection => reflection.id !== reflectionId);
      const newAllReflections = {
        ...prevAllReflections,
        [targetDay]: {
          ...dayReflections,
          [targetHourSlot]: updatedSlotReflections,
        },
      };
      saveAllReflectionsToLocalStorage(newAllReflections);
      return newAllReflections;
    });
  };

  const handleDeleteReflectionFromModal = (reflectionId: string) => {
    if (selectedSlotForReflection) {
      handleDeleteReflectionInPage(selectedSlotForReflection.dayName, selectedSlotForReflection.hourSlot, reflectionId);
    }
  };

  const handleOpenEditReflectionModalInPage = (targetDay: string, targetHourSlot: string, reflectionToEdit: ReflectionItem) => {
    handleOpenReflectionModal(targetHourSlot, reflectionToEdit);
  };

  const getReflectionsForSlot = (targetDayName: string, targetHourSlot: string): ReflectionItem[] => {
    return allReflections[targetDayName]?.[targetHourSlot] || [];
  };


  // --- Tooltip Text Helpers ---
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
                {t.dayDetailsTitle(dayName)}
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
            <h2 className="text-2xl font-semibold text-primary mb-4">{t.timeIntervalsTitle}</h2>
            <div className="grid grid-cols-1 gap-6">
              {timeIntervals.map(interval => {
                const hourlySlotsForInterval = generateHourlySlots(interval.label);
                const hasContentInAnySlotOfInterval = hourlySlotsForInterval.some(slot => 
                  (getTodosForSlot(dayName, slot).length > 0) ||
                  (getMeetingNotesForSlot(dayName, slot).length > 0) ||
                  (getShareLinksForSlot(dayName, slot).length > 0) ||
                  (getReflectionsForSlot(dayName, slot).length > 0)
                );

                if (isViewingCurrentDay && typeof window !== 'undefined') {
                  const pageLoadHour = pageLoadTime.getHours();
                  const pageLoadMinute = pageLoadTime.getMinutes();
                  const pageLoadTotalMinutes = pageLoadHour * 60 + pageLoadMinute;

                  const match = interval.label.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
                  if (match) {
                    const [, startTimeStr, endTimeStr] = match;
                    const [startH,] = startTimeStr.split(':').map(Number);
                    let [endH, endM] = endTimeStr.split(':').map(Number);
                    if (endTimeStr === "24:00" || (endTimeStr === "00:00" && startH > 0 && endH === 0)) endH = 24;
                    
                    const intervalEndTotalMinutes = endH * 60 + endM;
                    if (intervalEndTotalMinutes <= pageLoadTotalMinutes && !hasContentInAnySlotOfInterval) {
                      return null; 
                    }
                  }
                }

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
                          const todosForSlot = getTodosForSlot(dayName, slot);
                          const meetingNotesForSlot = getMeetingNotesForSlot(dayName, slot);
                          const shareLinksForSlot = getShareLinksForSlot(dayName, slot);
                          const reflectionsForSlot = getReflectionsForSlot(dayName, slot);
                          const hasAnyContentForThisSlot = todosForSlot.length > 0 || meetingNotesForSlot.length > 0 || shareLinksForSlot.length > 0 || reflectionsForSlot.length > 0;

                          if (isViewingCurrentDay && typeof window !== 'undefined') {
                            const slotTimeMatch = slot.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
                            if (slotTimeMatch) {
                              const slotEndTimeStr = slotTimeMatch[2]; 
                              const slotEndHour = parseInt(slotEndTimeStr.split(':')[0]);
                              const slotEndMinute = parseInt(slotEndTimeStr.split(':')[1]);
                              
                              const slotEndTotalMinutes = slotEndHour * 60 + slotEndMinute;
                              
                              const pageLoadHour = pageLoadTime.getHours();
                              const pageLoadMinute = pageLoadTime.getMinutes();
                              const pageLoadTotalMinutes = pageLoadHour * 60 + pageLoadMinute;

                              if (slotEndTotalMinutes <= pageLoadTotalMinutes && !hasAnyContentForThisSlot) {
                                return null; 
                              }
                            }
                          }
                          
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
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleOpenTodoModal(slot)}>
                                        <ListChecks className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{t.addTodo}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleOpenMeetingNoteModal(slot)}>
                                        <ClipboardList className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{t.addMeetingNote}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleOpenShareLinkModal(slot)}>
                                        <LinkIconLucide className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{t.addLink}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleOpenReflectionModal(slot)}>
                                        <MessageSquareText className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{t.addReflection}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                              
                              {todosForSlot.length > 0 && (
                                <div className="p-2 border rounded-md bg-background/50 group/todolist mb-3">
                                    <ul className="space-y-2 p-px">
                                      {todosForSlot.map((todo) => {
                                        const CategoryIcon = todo.category ? CategoryIcons[todo.category] : null;
                                        const DeadlineIcon = todo.deadline ? DeadlineIcons[todo.deadline] : null;
                                        return (
                                          <li key={todo.id} className="flex items-center justify-between group/todoitem hover:bg-muted/30 p-1.5 rounded-md transition-colors">
                                            <div className="flex items-center space-x-2 flex-grow min-w-0">
                                              <Checkbox
                                                id={`daypage-todo-${dayName}-${slot}-${todo.id}`}
                                                checked={todo.completed}
                                                onCheckedChange={() => handleToggleTodoCompletionInPage(dayName, slot, todo.id)}
                                                aria-label={todo.completed ? t.markIncomplete : t.markComplete}
                                                className="border-primary/50 shrink-0"
                                              />
                                              <div className="flex items-center space-x-1 shrink-0">
                                                {CategoryIcon && todo.category && (
                                                  <Tooltip>
                                                    <TooltipTrigger asChild><CategoryIcon className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                                                    <TooltipContent><p>{getCategoryTooltipText(todo.category)}</p></TooltipContent>
                                                  </Tooltip>
                                                )}
                                                {DeadlineIcon && todo.deadline && (
                                                  <Tooltip>
                                                    <TooltipTrigger asChild><DeadlineIcon className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                                                    <TooltipContent><p>{getDeadlineTooltipText(todo.deadline)}</p></TooltipContent>
                                                  </Tooltip>
                                                )}
                                                {todo.importance === 'important' && (
                                                  <Tooltip>
                                                    <TooltipTrigger asChild><StarIcon className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /></TooltipTrigger>
                                                    <TooltipContent><p>{getImportanceTooltipText(todo.importance)}</p></TooltipContent>
                                                  </Tooltip>
                                                )}
                                              </div>
                                              <label
                                                htmlFor={`daypage-todo-${dayName}-${slot}-${todo.id}`}
                                                className={cn(
                                                  "text-xs cursor-pointer flex-1 min-w-0 truncate",
                                                  todo.completed ? 'line-through text-muted-foreground/80' : 'text-foreground/90'
                                                )}
                                                title={todo.text}
                                              >
                                                {todo.text}
                                              </label>
                                            </div>
                                            <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/todoitem:opacity-100 transition-opacity">
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => handleOpenEditModalInPage(dayName, slot, todo)}>
                                                    <FileEdit className="h-3.5 w-3.5" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>{t.editItem}</p></TooltipContent>
                                              </Tooltip>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteTodoInPage(dayName, slot, todo.id)}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>{t.deleteItem}</p></TooltipContent>
                                              </Tooltip>
                                            </div>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                </div>
                              )}
                              
                              {meetingNotesForSlot.length > 0 && (
                                <div className="p-2 border rounded-md bg-background/50 group/meetingnotelist mb-3">
                                 <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 pl-1">{t.meetingNotesSectionTitle}</h4>
                                    <ul className="space-y-2 p-px">
                                      {meetingNotesForSlot.map((note) => (
                                          <li key={note.id} className="flex items-center justify-between group/noteitem hover:bg-muted/30 p-1.5 rounded-md transition-colors">
                                            <span className="text-xs text-foreground/90 flex-1 min-w-0 truncate" title={note.title}>
                                              {note.title || t.noData}
                                            </span>
                                            <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/noteitem:opacity-100 transition-opacity">
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => handleOpenEditMeetingNoteModalInPage(dayName, slot, note)}>
                                                    <FileEdit className="h-3.5 w-3.5" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>{t.editMeetingNote}</p></TooltipContent>
                                              </Tooltip>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteMeetingNoteInPage(dayName, slot, note.id)}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>{t.deleteMeetingNote}</p></TooltipContent>
                                              </Tooltip>
                                            </div>
                                          </li>
                                        ))}
                                    </ul>
                                </div>
                              )}

                              {shareLinksForSlot.length > 0 && (
                                <div className="p-2 border rounded-md bg-background/50 group/linklist mb-3">
                                  <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 pl-1">{t.linksSectionTitle}</h4>
                                    <ul className="space-y-2 p-px">
                                      {shareLinksForSlot.map((link) => (
                                        <li key={link.id} className="flex items-center justify-between group/linkitem hover:bg-muted/30 p-1.5 rounded-md transition-colors">
                                          <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline flex-1 min-w-0 truncate"
                                            title={link.title || link.url}
                                          >
                                            {link.title || link.url}
                                          </a>
                                          <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/linkitem:opacity-100 transition-opacity">
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => handleOpenEditShareLinkModalInPage(dayName, slot, link)}>
                                                  <FileEdit className="h-3.5 w-3.5" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent><p>{t.editLink}</p></TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteShareLinkInPage(dayName, slot, link.id)}>
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent><p>{t.deleteLink}</p></TooltipContent>
                                            </Tooltip>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                </div>
                              )}
                              
                              {reflectionsForSlot.length > 0 && (
                                <div className="p-2 border rounded-md bg-background/50 group/reflectionlist">
                                  <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 pl-1">{t.reflectionsSectionTitle}</h4>
                                    <ul className="space-y-2 p-px">
                                      {reflectionsForSlot.map((reflection) => (
                                        <li key={reflection.id} className="flex items-start justify-between group/reflectionitem hover:bg-muted/30 p-1.5 rounded-md transition-colors">
                                          <ScrollArea className="max-h-20 w-full mr-2">
                                            <p className="text-xs text-foreground/90 whitespace-pre-wrap break-words" title={reflection.text}>
                                              {reflection.text}
                                            </p>
                                          </ScrollArea>
                                          <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/reflectionitem:opacity-100 transition-opacity">
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => handleOpenEditReflectionModalInPage(dayName, slot, reflection)}>
                                                  <FileEdit className="h-3.5 w-3.5" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent><p>{t.editReflection}</p></TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteReflectionInPage(dayName, slot, reflection.id)}>
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent><p>{t.deleteReflection}</p></TooltipContent>
                                            </Tooltip>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                </div>
                              )}
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
          dayName={selectedSlotForTodo.dayName}
          hourSlot={selectedSlotForTodo.hourSlot}
          initialTodos={getTodosForSlot(selectedSlotForTodo.dayName, selectedSlotForTodo.hourSlot)}
          translations={tTodoModal}
          defaultEditingTodoId={editingTodoItem && editingTodoSlotDetails?.dayName === selectedSlotForTodo.dayName && editingTodoSlotDetails?.hourSlot === selectedSlotForTodo.hourSlot ? editingTodoItem.id : undefined}
        />
      )}
      {isMeetingNoteModalOpen && selectedSlotForMeetingNote && (
        <MeetingNoteModal
            isOpen={isMeetingNoteModalOpen}
            onClose={handleCloseMeetingNoteModal}
            onSave={handleSaveMeetingNoteFromModal}
            onDelete={editingMeetingNoteItem ? handleDeleteNoteFromModal : undefined}
            dayName={selectedSlotForMeetingNote.dayName}
            hourSlot={selectedSlotForMeetingNote.hourSlot}
            initialData={editingMeetingNoteItem && editingMeetingNoteSlotDetails?.dayName === selectedSlotForMeetingNote.dayName && editingMeetingNoteSlotDetails?.hourSlot === selectedSlotForMeetingNote.hourSlot ? editingMeetingNoteItem : null}
            translations={tMeetingNoteModal}
        />
      )}
      {isShareLinkModalOpen && selectedSlotForShareLink && (
        <ShareLinkModal
            isOpen={isShareLinkModalOpen}
            onClose={handleCloseShareLinkModal}
            onSave={handleSaveShareLinkFromModal}
            onDelete={editingShareLinkItem ? handleDeleteLinkFromModal : undefined}
            dayName={selectedSlotForShareLink.dayName}
            hourSlot={selectedSlotForShareLink.hourSlot}
            initialData={editingShareLinkItem && editingShareLinkSlotDetails?.dayName === selectedSlotForShareLink.dayName && editingShareLinkSlotDetails?.hourSlot === selectedSlotForShareLink.hourSlot ? editingShareLinkItem : null}
            translations={tShareLinkModal}
        />
      )}
      {isReflectionModalOpen && selectedSlotForReflection && (
        <ReflectionModal
            isOpen={isReflectionModalOpen}
            onClose={handleCloseReflectionModal}
            onSave={handleSaveReflectionFromModal}
            onDelete={editingReflectionItem ? handleDeleteReflectionFromModal : undefined}
            dayName={selectedSlotForReflection.dayName}
            hourSlot={selectedSlotForReflection.hourSlot}
            initialData={editingReflectionItem && editingReflectionSlotDetails?.dayName === selectedSlotForReflection.dayName && editingReflectionSlotDetails?.hourSlot === selectedSlotForReflection.hourSlot ? editingReflectionItem : null}
            translations={tReflectionModal}
        />
      )}
    </TooltipProvider>
  );
}

