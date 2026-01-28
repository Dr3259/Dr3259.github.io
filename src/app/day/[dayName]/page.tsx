
// src/app/day/[dayName]/page.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback, Suspense, lazy } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    ArrowLeft, ListChecks, ClipboardList, Link2 as LinkIconLucide, MessageSquareText,
    Briefcase, BookOpen, ShoppingCart, Archive, Coffee, ChefHat, Baby, CalendarClock,
    Hourglass, CalendarCheck, Sunrise, CalendarRange, ArrowRightToLine, CalendarPlus,
    Star as StarIcon, FileEdit, Trash2, Calendar as CalendarIcon, Smile, Meh, Frown,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { TooltipProvider } from "@/components/ui/tooltip";
// 懒加载模态框组件以减少初始包大小
const TodoModal = lazy(() => import('@/components/TodoModal').then(module => ({ default: module.TodoModal })));
const MeetingNoteModal = lazy(() => import('@/components/MeetingNoteModal').then(module => ({ default: module.MeetingNoteModal })));
const ShareLinkModal = lazy(() => import('@/components/ShareLinkModal').then(module => ({ default: module.ShareLinkModal })));
const ReflectionModal = lazy(() => import('@/components/ReflectionModal').then(module => ({ default: module.ReflectionModal })));
const DraftModal = lazy(() => import('@/components/DraftModal').then(module => ({ default: module.DraftModal })));
const EventRecordModal = lazy(() => import('@/components/EventRecordModal').then(module => ({ default: module.EventRecordModal })));
import type { TodoItem, CategoryType } from '@/components/TodoModal';
import type { MeetingNoteItem } from '@/components/MeetingNoteModal';
import type { ShareLinkItem } from '@/components/ShareLinkModal';
import type { ReflectionItem } from '@/components/ReflectionModal';
import type { DraftItem } from '@/components/DraftModal';
import { format, parseISO, isAfter as dateIsAfter, isBefore, addDays, subDays, isToday, isSameWeek } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { ClipboardModal } from '@/components/ClipboardModal';
import copy from 'copy-to-clipboard';
import { DailySummaryCard } from '@/components/page/day-view/DailySummaryCard';
import { TimeIntervalSection } from '@/components/page/day-view/TimeIntervalSection';
import { usePlannerStore } from '@/hooks/usePlannerStore';
import { translations, type LanguageKey } from '@/lib/translations';
import { useAuth } from '@/context/AuthContext';

type RatingType = 'excellent' | 'terrible' | 'average' | null;

import { generateHourlySlots } from '@/lib/day-utils';

const URL_REGEX = /(https?:\/\/[^\s$.?#].[^\s]*)/i;

interface SlotDetails {
  dateKey: string; // YYYY-MM-DD
  hourSlot: string;
}

const CategoryIcons: Record<CategoryType, React.ElementType> = { work: Briefcase, study: BookOpen, shopping: ShoppingCart, organizing: Archive, relaxing: Coffee, cooking: ChefHat, childcare: Baby, dating: CalendarClock };
const DeadlineIcons: Record<NonNullable<TodoItem['deadline']>, React.ElementType> = { hour: Hourglass, today: CalendarCheck, tomorrow: Sunrise, thisWeek: CalendarRange, nextWeek: ArrowRightToLine, nextMonth: CalendarPlus };
const RATING_ICONS: Record<string, React.ElementType> = { excellent: Smile, average: Meh, terrible: Frown };

const getDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

function DayDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dayNameForDisplay = typeof params.dayName === 'string' ? decodeURIComponent(params.dayName) : "无效日期";
  const dateKey = searchParams.get('date') || '';
  const eventfulDaysParam = searchParams.get('eventfulDays');
  const eventfulDays = useMemo(() => eventfulDaysParam ? eventfulDaysParam.split(',') : [], [eventfulDaysParam]);

  const { toast } = useToast();
  const { user } = useAuth();

  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [clientPageLoadTime, setClientPageLoadTime] = useState<Date | null>(null);
  const [isLoginPromptDismissed, setIsLoginPromptDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('loginPromptDismissed') === 'true';
    }
    return false;
  });

  // 优化：仅获取当前日期相关的数据，避免加载全部数据
  const plannerStore = usePlannerStore();
  const { setDailyNote, setRating, setTodosForSlot, setMeetingNotesForSlot, setShareLinksForSlot, setReflectionsForSlot, setDraftsForSlot, addShareLink, setEventRecordsForSlot } = plannerStore;
  
  // 仅获取当前日期的数据
  const currentDayData = useMemo(() => {
    if (!dateKey) return { dailyNote: '', rating: null, todos: {}, meetingNotes: {}, shareLinks: {}, reflections: {}, drafts: {}, eventRecords: {} };
    return {
      dailyNote: plannerStore.allDailyNotes[dateKey] || '',
      rating: plannerStore.allRatings[dateKey] || null,
      todos: plannerStore.allTodos[dateKey] || {},
      meetingNotes: plannerStore.allMeetingNotes[dateKey] || {},
      shareLinks: plannerStore.allShareLinks[dateKey] || {},
      reflections: plannerStore.allReflections[dateKey] || {},
      drafts: plannerStore.allDrafts[dateKey] || {},
      eventRecords: plannerStore.allEventRecords[dateKey] || {}
    };
  }, [dateKey, plannerStore.allDailyNotes, plannerStore.allRatings, plannerStore.allTodos, plannerStore.allMeetingNotes, plannerStore.allShareLinks, plannerStore.allReflections, plannerStore.allDrafts, plannerStore.allEventRecords]);

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

  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [selectedSlotForDraft, setSelectedSlotForDraft] = useState<SlotDetails | null>(null);
  const [editingDraftItem, setEditingDraftItem] = useState<any | null>(null);
  const [isEventRecordModalOpen, setIsEventRecordModalOpen] = useState(false);
  const [selectedSlotForEventRecord, setSelectedSlotForEventRecord] = useState<SlotDetails | null>(null);
  const [editingEventRecordItem, setEditingEventRecordItem] = useState<any | null>(null);

  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [todoToMove, setTodoToMove] = useState<{todo: TodoItem, fromSlot: string} | null>(null);

  const intervalRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeIntervalKey, setActiveIntervalKey] = useState<string | null>(null);
  const [hasScrolledInitially, setHasScrolledInitially] = useState(false);

  const [isClipboardModalOpen, setIsClipboardModalOpen] = useState(false);
  const [clipboardContent, setClipboardContent] = useState('');
  const [lastProcessedClipboardText, setLastProcessedClipboardText] = useState('');

  // 优化：使用静态翻译对象避免重复创建
  const t = useMemo(() => {
    return {
      ...translations[currentLanguage],
      // 仅添加必要的扩展翻译
      addTodo: currentLanguage === 'zh-CN' ? '添加待办事项' : 'Add Todo',
      addMeetingNote: currentLanguage === 'zh-CN' ? '添加会议记录' : 'Add Meeting Note',
      addLink: currentLanguage === 'zh-CN' ? '添加链接' : 'Add Link',
      addReflection: currentLanguage === 'zh-CN' ? '记录思维灵感' : 'Record Inspiration',
      editItem: currentLanguage === 'zh-CN' ? '编辑' : 'Edit',
      deleteItem: currentLanguage === 'zh-CN' ? '删除' : 'Delete',
      moveTodo: currentLanguage === 'zh-CN' ? '移动到其他时间段' : 'Move to another time slot',
      noItemsForHour: currentLanguage === 'zh-CN' ? '暂无内容' : 'No items for this hour',
      markComplete: currentLanguage === 'zh-CN' ? '标记为完成' : 'Mark as complete',
      markIncomplete: currentLanguage === 'zh-CN' ? '标记为未完成' : 'Mark as incomplete',
      backToWeek: currentLanguage === 'zh-CN' ? '返回周视图' : 'Back to Week',
      previousDay: currentLanguage === 'zh-CN' ? '上一天' : 'Previous Day',
      nextDay: currentLanguage === 'zh-CN' ? '下一天' : 'Next Day',
      // 添加缺失的翻译键
      editMeetingNote: currentLanguage === 'zh-CN' ? '编辑会议记录' : 'Edit Meeting Note',
      deleteMeetingNote: currentLanguage === 'zh-CN' ? '删除会议记录' : 'Delete Meeting Note',
      editLink: currentLanguage === 'zh-CN' ? '编辑链接' : 'Edit Link',
      deleteLink: currentLanguage === 'zh-CN' ? '删除链接' : 'Delete Link',
      editReflection: currentLanguage === 'zh-CN' ? '编辑思维灵感' : 'Edit Reflection',
      deleteReflection: currentLanguage === 'zh-CN' ? '删除思维灵感' : 'Delete Reflection',
      addDraft: currentLanguage === 'zh-CN' ? '草稿本' : 'Draft',
      editDraft: currentLanguage === 'zh-CN' ? '编辑草稿' : 'Edit Draft',
      deleteDraft: currentLanguage === 'zh-CN' ? '删除草稿' : 'Delete Draft'
    };
  }, [currentLanguage]);
  
  const tEventRecordModal = useMemo(() => {
    const isZh = currentLanguage === 'zh-CN';
    return {
      modalTitleNew: isZh ? '事件记录' : 'Event Record',
      modalTitleEdit: isZh ? '编辑事件记录' : 'Edit Event Record',
      modalDescription: isZh ? '记录事件的关键步骤与时间点。' : 'Record key steps and timestamps of an event.',
      titleLabel: isZh ? '事件标题' : 'Event Title',
      titlePlaceholder: isZh ? '例如：项目部署' : 'e.g., Project Deployment',
      stepTitleLabel: isZh ? '步骤标题' : 'Step Title',
      stepTitlePlaceholder: isZh ? '输入步骤标题...' : 'Enter step title...',
      stepDetailLabel: isZh ? '步骤详情' : 'Step Detail',
      stepDetailPlaceholder: isZh ? '补充说明（可选）...' : 'Additional notes (optional)...',
      stepStatusLabel: isZh ? '步骤状态' : 'Step Status',
      addStepButton: isZh ? '添加步骤' : 'Add Step',
      saveButton: isZh ? '保存' : 'Save',
      updateButton: isZh ? '更新' : 'Update',
      deleteButton: isZh ? '删除' : 'Delete',
      cancelButton: isZh ? '取消' : 'Cancel',
    };
  }, [currentLanguage]);
  
  const dateLocale = currentLanguage === 'zh-CN' ? zhCN : enUS;

  const isUrlAlreadySaved = useCallback((url: string): boolean => {
    if (!url) return false;
    for (const dateKey in plannerStore.allShareLinks) {
        for (const hourSlot in plannerStore.allShareLinks[dateKey]) {
            if (plannerStore.allShareLinks[dateKey][hourSlot].some(item => item.url === url)) {
                return true;
            }
        }
    }
    return false;
  }, [plannerStore.allShareLinks]);

  const saveUrlToCurrentTimeSlot = useCallback((item: { title: string; url: string; category: string | null }): { success: boolean; slotName: string } => {
    const newLink: ShareLinkItem = { id: Date.now().toString(), url: item.url, title: item.title, category: item.category };
    const now = new Date(), currentHour = now.getHours(), currentDateKey = getDateKey(now);
    
    // 定义时间段标签（带时间范围）
    const intervalLabels = {
        midnight: `${t.timeIntervals.midnight} (00:00 - 05:00)`,
        earlyMorning: `${t.timeIntervals.earlyMorning} (05:00 - 09:00)`,
        morning: `${t.timeIntervals.morning} (09:00 - 12:00)`,
        noon: `${t.timeIntervals.noon} (12:00 - 14:00)`,
        afternoon: `${t.timeIntervals.afternoon} (14:00 - 18:00)`,
        evening: `${t.timeIntervals.evening} (18:00 - 24:00)`,
    };
    
    let targetIntervalKey: keyof typeof intervalLabels = 'evening';
    if (currentHour < 5) targetIntervalKey = 'midnight';
    else if (currentHour < 9) targetIntervalKey = 'earlyMorning';
    else if (currentHour < 12) targetIntervalKey = 'morning';
    else if (currentHour < 14) targetIntervalKey = 'noon';
    else if (currentHour < 18) targetIntervalKey = 'afternoon';
    
    const targetIntervalLabel = intervalLabels[targetIntervalKey];
    const hourlySlots = generateHourlySlots(targetIntervalLabel);
    if (hourlySlots.length === 0) return { success: false, slotName: '' };
    
    const targetSlot = hourlySlots.find(slot => {
        const match = slot.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
        if (match) { 
            const startH = parseInt(match[1].split(':')[0]), endH = parseInt(match[2].split(':')[0]); 
            return currentHour >= startH && currentHour < (endH || 24); 
        }
        return false;
    }) || hourlySlots[0];
    
    addShareLink(currentDateKey, targetSlot, newLink);
    return { success: true, slotName: t.timeIntervals[targetIntervalKey] };
  }, [t.timeIntervals, addShareLink]);

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
        if (isUrlAlreadySaved(urlMatches[0])) { setLastProcessedClipboardText(text); return; }
        setClipboardContent(text);
        setIsClipboardModalOpen(true);
    } catch (err: any) { /* Silently fail */ }
  }, [lastProcessedClipboardText, isUrlAlreadySaved]);
  
  useEffect(() => {
    window.addEventListener('focus', checkClipboard);
    return () => window.removeEventListener('focus', checkClipboard);
  }, [checkClipboard]);

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

  useEffect(() => {
    setClientPageLoadTime(new Date());
    const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    setCurrentLanguage(browserLang);
  }, []);
  
  useEffect(() => {
    import('@/components/DraftModal');
  }, []);

  // 临时翻译对象，直到翻译文件完善
  const tTodoModal = useMemo(() => {
    const isZh = currentLanguage === 'zh-CN';
    return {
      modalTitle: (hourSlot: string) => isZh ? `为 ${hourSlot} 添加任务` : `Add Tasks for ${hourSlot}`,
      modalDescription: isZh ? '为这个时间段添加和管理任务。' : 'Add and manage your tasks for this time slot.',
      addItemPlaceholder: isZh ? '输入新任务...' : 'Enter a new task...',
      categoryInputPlaceholder: isZh ? '分类' : 'Category',
      addButton: isZh ? '添加任务' : 'Add Task',
      updateButton: isZh ? '更新任务' : 'Update Task',
      saveButton: isZh ? '保存所有任务' : 'Save All Tasks',
      noTodos: isZh ? '暂无任务' : 'No tasks yet',
      markComplete: isZh ? '标记为完成' : 'Mark as complete',
      markIncomplete: isZh ? '标记为未完成' : 'Mark as incomplete',
      editTodo: isZh ? '编辑任务' : 'Edit task',
      deleteTodo: isZh ? '删除任务' : 'Delete task',
      categoryLabel: isZh ? '分类：' : 'Category:',
      deadlineLabel: isZh ? '截止时间：' : 'Deadline:',
      importanceLabel: isZh ? '重要性：' : 'Importance:',
      selectPlaceholder: isZh ? '选择...' : 'Select...',
      categories: {
        work: isZh ? '工作' : 'Work',
        study: isZh ? '学习' : 'Study',
        shopping: isZh ? '购物' : 'Shopping',
        organizing: isZh ? '整理' : 'Organizing',
        relaxing: isZh ? '休闲' : 'Relaxing',
        cooking: isZh ? '烹饪' : 'Cooking',
        childcare: isZh ? '育儿' : 'Childcare',
        dating: isZh ? '约会' : 'Dating'
      },
      deadlines: {
        hour: isZh ? '本小时' : 'This hour',
        today: isZh ? '今天' : 'Today',
        tomorrow: isZh ? '明天' : 'Tomorrow',
        thisWeek: isZh ? '本周' : 'This week',
        nextWeek: isZh ? '下周' : 'Next week',
        nextMonth: isZh ? '下个月' : 'Next month'
      },
      importances: {
        important: isZh ? '重要' : 'Important',
        notImportant: isZh ? '不重要' : 'Not important'
      }
    };
  }, [currentLanguage]);

  const tMeetingNoteModal = useMemo(() => {
    const isZh = currentLanguage === 'zh-CN';
    return {
      modalTitleNew: isZh ? '新建会议记录' : 'New Meeting Note',
      modalTitleEdit: (title: string) => isZh ? `编辑: ${title}` : `Edit: ${title}`,
      modalDescription: isZh ? '为这个时间段添加和管理会议记录。' : 'Add and manage meeting notes for this time slot.',
      titleLabel: isZh ? '会议标题' : 'Meeting Title',
      titlePlaceholder: isZh ? '会议标题...' : 'Meeting title...',
      notesLabel: isZh ? '会议记录' : 'Meeting Notes',
      notesPlaceholder: isZh ? '会议记录和详情...' : 'Meeting notes and details...',
      attendeesLabel: isZh ? '参会人员' : 'Attendees',
      attendeesPlaceholder: isZh ? '参会人员...' : 'Attendees...',
      actionItemsLabel: isZh ? '行动项' : 'Action Items',
      actionItemsPlaceholder: isZh ? '行动项和待办事项...' : 'Action items and follow-ups...',
      saveButton: isZh ? '保存记录' : 'Save Note',
      updateButton: isZh ? '更新记录' : 'Update Note',
      deleteButton: isZh ? '删除记录' : 'Delete Note',
      cancelButton: isZh ? '取消' : 'Cancel'
    };
  }, [currentLanguage]);

  const tShareLinkModal = useMemo(() => {
    const isZh = currentLanguage === 'zh-CN';
    return {
      modalTitleNew: isZh ? '新建链接' : 'New Link',
      modalTitleEdit: (titleOrUrl: string) => isZh ? `编辑: ${titleOrUrl}` : `Edit: ${titleOrUrl}`,
      modalDescription: isZh ? '为这个时间段添加和管理链接。' : 'Add and manage links for this time slot.',
      urlLabel: isZh ? '网址' : 'URL',
      urlPlaceholder: isZh ? '输入网址...' : 'Enter URL...',
      titleLabel: isZh ? '链接标题' : 'Link Title',
      titlePlaceholder: isZh ? '链接标题（可选）...' : 'Link title (optional)...',
      categoryLabel: isZh ? '分类' : 'Category',
      categoryPlaceholder: isZh ? '分类（可选）...' : 'Category (optional)...',
      saveButton: isZh ? '保存链接' : 'Save Link',
      updateButton: isZh ? '更新链接' : 'Update Link',
      deleteButton: isZh ? '删除链接' : 'Delete Link',
      cancelButton: isZh ? '取消' : 'Cancel'
    };
  }, [currentLanguage]);

  const tReflectionModal = useMemo(() => {
    const isZh = currentLanguage === 'zh-CN';
    return {
      modalTitleNew: isZh ? '记录思维灵感' : 'Record Inspiration',
      modalTitleEdit: isZh ? '编辑思维灵感' : 'Edit Inspiration',
      modalDescription: isZh ? '为这个时间段记录你的思维火花和创意灵感。' : 'Record your thoughts and creative inspirations for this time slot.',
      textLabel: isZh ? '灵感内容' : 'Inspiration Content',
      textPlaceholder: isZh ? '记录下你的思维灵感、创意想法或深度思考...（按 / 打开块菜单）' : 'Record your inspirations, creative ideas or deep thoughts... (Press / for block menu)',
      categoryLabel: isZh ? '分类' : 'Category',
      saveButton: isZh ? '保存灵感' : 'Save Inspiration',
      updateButton: isZh ? '更新灵感' : 'Update Inspiration',
      deleteButton: isZh ? '删除灵感' : 'Delete Inspiration',
      cancelButton: isZh ? '取消' : 'Cancel'
    };
  }, [currentLanguage]);

  const tDraftModal = useMemo(() => {
    const isZh = currentLanguage === 'zh-CN';
    return {
      modalTitleNew: isZh ? '新建草稿' : 'New Draft',
      modalTitleEdit: isZh ? '编辑草稿' : 'Edit Draft',
      modalDescription: isZh ? '在这里记录你的草稿、临时想法或待整理的内容。' : 'Record your drafts, temporary ideas or content to be organized.',
      contentLabel: isZh ? '草稿内容' : 'Draft Content',
      contentPlaceholder: isZh ? '记录你的草稿内容...' : 'Record your draft content...',
      saveButton: isZh ? '保存草稿' : 'Save Draft',
      updateButton: isZh ? '更新草稿' : 'Update Draft',
      deleteButton: isZh ? '删除草稿' : 'Delete Draft',
      cancelButton: isZh ? '取消' : 'Cancel'
    };
  }, [currentLanguage]);
  const timeIntervals = useMemo(() => [
    { key: 'midnight', label: `${t.timeIntervals.midnight} (00:00 - 05:00)` }, 
    { key: 'earlyMorning', label: `${t.timeIntervals.earlyMorning} (05:00 - 09:00)` }, 
    { key: 'morning', label: `${t.timeIntervals.morning} (09:00 - 12:00)` }, 
    { key: 'noon', label: `${t.timeIntervals.noon} (12:00 - 14:00)` }, 
    { key: 'afternoon', label: `${t.timeIntervals.afternoon} (14:00 - 18:00)` }, 
    { key: 'evening', label: `${t.timeIntervals.evening} (18:00 - 24:00)` }
  ], [t]);

  const dayProperties = useMemo(() => {
    if (!dateKey) return { isValid: false, dateObject: null };
    try { return { isValid: true, dateObject: parseISO(dateKey) }; } 
    catch (e) { return { isValid: false, dateObject: null }; }
  }, [dateKey]);

  const isViewingCurrentDay = useMemo(() => clientPageLoadTime && dayProperties.dateObject ? format(dayProperties.dateObject, 'yyyy-MM-dd') === format(clientPageLoadTime, 'yyyy-MM-dd') : false, [dayProperties, clientPageLoadTime]);
  const isPastDay = useMemo(() => {
    if (!clientPageLoadTime || !dayProperties.dateObject) return false;
    return isBefore(dayProperties.dateObject, new Date(clientPageLoadTime.getFullYear(), clientPageLoadTime.getMonth(), clientPageLoadTime.getDate()));
  }, [clientPageLoadTime, dayProperties]);

  // Handlers for modals and data manipulation, now calling Zustand actions
  const handleOpenTodoModal = (hourSlot: string) => { 
    if (dateKey) { 
      setSelectedSlotForTodo({ dateKey, hourSlot }); 
      setEditingTodoItem(null); 
      setIsTodoModalOpen(true); 
    } 
  };
  const handleOpenEditTodoModal = (targetDateKey: string, targetHourSlot: string, todoToEdit: TodoItem) => { setEditingTodoItem(todoToEdit); setSelectedSlotForTodo({ dateKey: targetDateKey, hourSlot: targetHourSlot }); setIsTodoModalOpen(true); };
  const handleToggleTodoCompletion = useCallback((dateKey: string, hourSlot: string, todoId: string) => { 
    const todos = currentDayData.todos[hourSlot] || []; 
    setTodosForSlot(dateKey, hourSlot, todos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)); 
  }, [currentDayData.todos, setTodosForSlot]);
  
  const handleDeleteTodo = useCallback((dateKey: string, hourSlot: string, todoId: string) => { 
    const todos = currentDayData.todos[hourSlot] || []; 
    setTodosForSlot(dateKey, hourSlot, todos.filter(t => t.id !== todoId)); 
  }, [currentDayData.todos, setTodosForSlot]);

  const handleOpenMeetingNoteModal = (hourSlot: string, noteToEdit?: MeetingNoteItem) => { 
    if (dateKey) { 
      setSelectedSlotForMeetingNote({ dateKey, hourSlot }); 
      setEditingMeetingNoteItem(noteToEdit || null); 
      setIsMeetingNoteModalOpen(true); 
    } 
  };
  const handleSaveMeetingNote = useCallback((dateKey: string, hourSlot: string, savedNote: MeetingNoteItem) => { 
    const notes = currentDayData.meetingNotes[hourSlot] || []; 
    const idx = notes.findIndex(n => n.id === savedNote.id); 
    const updated = idx > -1 ? notes.map((n, i) => i === idx ? savedNote : n) : [...notes, savedNote]; 
    setMeetingNotesForSlot(dateKey, hourSlot, updated); 
  }, [currentDayData.meetingNotes, setMeetingNotesForSlot]);
  
  const handleDeleteMeetingNote = useCallback((dateKey: string, hourSlot: string, noteId: string) => { 
    const notes = currentDayData.meetingNotes[hourSlot] || []; 
    setMeetingNotesForSlot(dateKey, hourSlot, notes.filter(n => n.id !== noteId)); 
  }, [currentDayData.meetingNotes, setMeetingNotesForSlot]);

  const handleOpenShareLinkModal = (hourSlot: string, linkToEdit?: ShareLinkItem) => { if (dateKey) { setSelectedSlotForShareLink({ dateKey, hourSlot }); setEditingShareLinkItem(linkToEdit || null); setIsShareLinkModalOpen(true); } };
  const handleSaveShareLink = useCallback((dateKey: string, hourSlot: string, savedLink: ShareLinkItem) => { 
    const links = currentDayData.shareLinks[hourSlot] || []; 
    const idx = links.findIndex(l => l.id === savedLink.id); 
    const updated = idx > -1 ? links.map((l, i) => i === idx ? savedLink : l) : [...links, savedLink]; 
    setShareLinksForSlot(dateKey, hourSlot, updated); 
  }, [currentDayData.shareLinks, setShareLinksForSlot]);
  
  const handleDeleteShareLink = useCallback((dateKey: string, hourSlot: string, linkId: string) => { 
    const links = currentDayData.shareLinks[hourSlot] || []; 
    setShareLinksForSlot(dateKey, hourSlot, links.filter(l => l.id !== linkId)); 
  }, [currentDayData.shareLinks, setShareLinksForSlot]);

  const handleOpenReflectionModal = (hourSlot: string, reflectionToEdit?: ReflectionItem) => { if (dateKey) { setSelectedSlotForReflection({ dateKey, hourSlot }); setEditingReflectionItem(reflectionToEdit || null); setIsReflectionModalOpen(true); } };
  const handleSaveReflection = useCallback((dateKey: string, hourSlot: string, savedReflection: ReflectionItem) => { 
    const reflections = currentDayData.reflections[hourSlot] || []; 
    const idx = reflections.findIndex(r => r.id === savedReflection.id); 
    const updated = idx > -1 ? reflections.map((r, i) => i === idx ? savedReflection : r) : [...reflections, savedReflection]; 
    setReflectionsForSlot(dateKey, hourSlot, updated); 
  }, [currentDayData.reflections, setReflectionsForSlot]);
  
  const handleDeleteReflection = useCallback((dateKey: string, hourSlot: string, reflectionId: string) => { 
    const reflections = currentDayData.reflections[hourSlot] || []; 
    setReflectionsForSlot(dateKey, hourSlot, reflections.filter(r => r.id !== reflectionId)); 
  }, [currentDayData.reflections, setReflectionsForSlot]);

  const handleOpenDraftModal = (hourSlot: string, draftToEdit?: DraftItem) => { if (dateKey) { setSelectedSlotForDraft({ dateKey, hourSlot }); setEditingDraftItem(draftToEdit || null); setIsDraftModalOpen(true); } };
  const handleOpenEventRecordModal = (hourSlot: string, item?: any) => { if (dateKey) { setSelectedSlotForEventRecord({ dateKey, hourSlot }); setEditingEventRecordItem(item || null); setIsEventRecordModalOpen(true); } };
  const handleSaveDraft = useCallback((dateKey: string, hourSlot: string, savedDraft: DraftItem) => { 
    const drafts = currentDayData.drafts[hourSlot] || []; 
    const idx = drafts.findIndex(d => d.id === savedDraft.id); 
    const updated = idx > -1 ? drafts.map((d, i) => i === idx ? savedDraft : d) : [...drafts, savedDraft]; 
    setDraftsForSlot(dateKey, hourSlot, updated); 
  }, [currentDayData.drafts, setDraftsForSlot]);
  
  const handleDeleteDraft = useCallback((dateKey: string, hourSlot: string, draftId: string) => { 
    const drafts = currentDayData.drafts[hourSlot] || []; 
    setDraftsForSlot(dateKey, hourSlot, drafts.filter(d => d.id !== draftId)); 
  }, [currentDayData.drafts, setDraftsForSlot]);
  const handleSaveEventRecord = useCallback((dateKey: string, hourSlot: string, saved: any) => { 
    const items = currentDayData.eventRecords[hourSlot] || []; 
    const idx = items.findIndex((x: any) => x.id === saved.id); 
    const updated = idx > -1 ? items.map((x: any, i: number) => i === idx ? saved : x) : [...items, saved]; 
    setEventRecordsForSlot(dateKey, hourSlot, updated); 
  }, [currentDayData.eventRecords, setEventRecordsForSlot]);
  const handleDeleteEventRecord = useCallback((dateKey: string, hourSlot: string, id: string) => { 
    const items = currentDayData.eventRecords[hourSlot] || []; 
    setEventRecordsForSlot(dateKey, hourSlot, items.filter((x: any) => x.id !== id)); 
  }, [currentDayData.eventRecords, setEventRecordsForSlot]);

  const handleMoveTodoModal = (dateKey: string, hourSlot: string, todo: TodoItem) => {
    setTodoToMove({ todo, fromSlot: hourSlot });
    setIsMoveModalOpen(true);
  };

  const handleMoveTodo = useCallback((toSlot: string) => {
    if (todoToMove && dateKey) {
      // 从原时间段删除
      handleDeleteTodo(dateKey, todoToMove.fromSlot, todoToMove.todo.id);
      // 添加到新时间段
      const todos = currentDayData.todos[toSlot] || [];
      const newTodo = { ...todoToMove.todo, id: Date.now().toString() }; // 生成新ID避免冲突
      setTodosForSlot(dateKey, toSlot, [...todos, newTodo]);
      // 关闭模态框
      setIsMoveModalOpen(false);
      setTodoToMove(null);
    }
  }, [todoToMove, dateKey, handleDeleteTodo, currentDayData.todos, setTodosForSlot]);

  const navigateToDay = (direction: 'next' | 'prev') => {
    const currentIndex = eventfulDays.indexOf(dateKey);
    if (currentIndex === -1) return;
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < eventfulDays.length) {
      const newDateKey = eventfulDays[nextIndex];
      const newDayName = format(parseISO(newDateKey), 'EEEE', { locale: dateLocale });
      router.push(`/day/${encodeURIComponent(newDayName)}?date=${newDateKey}&eventfulDays=${eventfulDaysParam}`);
    }
  };
  const { isPrevDisabled, isNextDisabled } = useMemo(() => ({ isPrevDisabled: eventfulDays.indexOf(dateKey) <= 0, isNextDisabled: eventfulDays.indexOf(dateKey) >= eventfulDays.length - 1 }), [dateKey, eventfulDays]);

  useEffect(() => { /* ... Scroll logic remains the same ... */ }, [/* ... dependencies ... */]);

  if (!dateKey || !clientPageLoadTime) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 sm:p-8">
            <Link href="/" passHref><Button variant="outline" size="sm" className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" />{t.backToWeek}</Button></Link>
        </div>
      );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-8">
        <header className="w-full max-w-4xl mb-8 flex justify-between items-center">
            <Link href="/" passHref><Button variant="outline" size="sm"><ArrowLeft className="mr-2 h-4 w-4" />{t.backToWeek}</Button></Link>
            {!dayProperties.isValid || (dayProperties.dateObject && isBefore(dayProperties.dateObject, new Date())) && <div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => navigateToDay('prev')} aria-label={t.previousDay} disabled={isPrevDisabled}><ChevronLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" onClick={() => navigateToDay('next')} aria-label={t.nextDay} disabled={isNextDisabled}><ChevronRight className="h-4 w-4" /></Button></div>}
        </header>

        <main className="w-full max-w-4xl">
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
          <DailySummaryCard translations={t} dateKey={dateKey} dayNameForDisplay={dayNameForDisplay} dailyNote={currentDayData.dailyNote} rating={currentDayData.rating} isPastDay={isPastDay} isViewingCurrentDay={isViewingCurrentDay} isClientAfter6PM={clientPageLoadTime.getHours() >= 18} onDailyNoteChange={(note) => setDailyNote(dateKey, note)} onRatingChange={(rating) => setRating(dateKey, rating)} />
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">{t.timeIntervalsTitle(dayNameForDisplay)}</h2>
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
                  allTodos={{[dateKey]: currentDayData.todos}} 
                  allMeetingNotes={{[dateKey]: currentDayData.meetingNotes}} 
                  allShareLinks={{[dateKey]: currentDayData.shareLinks}} 
                  allReflections={{[dateKey]: currentDayData.reflections}} 
                  allDrafts={{[dateKey]: currentDayData.drafts}} 
                  allEventRecords={{[dateKey]: currentDayData.eventRecords}}
                  onToggleTodoCompletion={handleToggleTodoCompletion} 
                  onDeleteTodo={handleDeleteTodo} 
                  onOpenTodoModal={handleOpenTodoModal} 
                  onOpenEditTodoModal={handleOpenEditTodoModal} 
                  onMoveTodoModal={handleMoveTodoModal} 
                  onOpenMeetingNoteModal={handleOpenMeetingNoteModal} 
                  onOpenShareLinkModal={handleOpenShareLinkModal} 
                  onOpenReflectionModal={handleOpenReflectionModal} 
                  onOpenDraftModal={handleOpenDraftModal} 
                  onOpenEventRecordModal={handleOpenEventRecordModal}
                  onDeleteMeetingNote={handleDeleteMeetingNote} 
                  onDeleteShareLink={handleDeleteShareLink} 
                  onDeleteReflection={handleDeleteReflection} 
                  onDeleteDraft={handleDeleteDraft} 
                  onDeleteEventRecord={handleDeleteEventRecord}
                  translations={t} 
                /> 
              ))}
            </div>
          </div>
        </main>
      </div>

      {isTodoModalOpen && selectedSlotForTodo && ( 
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-background p-4 rounded-lg">加载中...</div></div>}>
          <TodoModal isOpen={isTodoModalOpen} onClose={() => setIsTodoModalOpen(false)} onSaveTodos={setTodosForSlot} dateKey={selectedSlotForTodo.dateKey} hourSlot={selectedSlotForTodo.hourSlot} initialTodos={currentDayData.todos[selectedSlotForTodo.hourSlot] || []} translations={tTodoModal} defaultEditingTodoId={editingTodoItem?.id} /> 
        </Suspense>
      )}
      {isMeetingNoteModalOpen && selectedSlotForMeetingNote && ( 
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-background p-4 rounded-lg">加载中...</div></div>}>
          <MeetingNoteModal isOpen={isMeetingNoteModalOpen} onClose={() => setIsMeetingNoteModalOpen(false)} onSave={handleSaveMeetingNote} onDelete={(noteId) => handleDeleteMeetingNote(selectedSlotForMeetingNote.dateKey, selectedSlotForMeetingNote.hourSlot, noteId)} dateKey={selectedSlotForMeetingNote.dateKey} hourSlot={selectedSlotForMeetingNote.hourSlot} initialData={editingMeetingNoteItem} translations={tMeetingNoteModal} /> 
        </Suspense>
      )}
      {isShareLinkModalOpen && selectedSlotForShareLink && ( 
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-background p-4 rounded-lg">加载中...</div></div>}>
          <ShareLinkModal isOpen={isShareLinkModalOpen} onClose={() => setIsShareLinkModalOpen(false)} onSave={handleSaveShareLink} onDelete={(linkId) => handleDeleteShareLink(selectedSlotForShareLink.dateKey, selectedSlotForShareLink.hourSlot, linkId)} dateKey={selectedSlotForShareLink.dateKey} hourSlot={selectedSlotForShareLink.hourSlot} initialData={editingShareLinkItem} translations={tShareLinkModal} /> 
        </Suspense>
      )}
      {isReflectionModalOpen && selectedSlotForReflection && ( 
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-background p-4 rounded-lg">加载中...</div></div>}>
          <ReflectionModal isOpen={isReflectionModalOpen} onClose={() => setIsReflectionModalOpen(false)} onSave={handleSaveReflection} onDelete={(reflectionId) => handleDeleteReflection(selectedSlotForReflection.dateKey, selectedSlotForReflection.hourSlot, reflectionId)} dateKey={selectedSlotForReflection.dateKey} hourSlot={selectedSlotForReflection.hourSlot} initialData={editingReflectionItem} translations={tReflectionModal} /> 
        </Suspense>
      )}
      {isDraftModalOpen && selectedSlotForDraft && ( 
        <Suspense fallback={<div className="fixed inset-0 bg黑/50 flex items-center justify-center"><div className="bg-background p-4 rounded-lg">加载中...</div></div>}>
          <DraftModal isOpen={isDraftModalOpen} onClose={() => setIsDraftModalOpen(false)} onSave={handleSaveDraft} onDelete={(draftId) => handleDeleteDraft(selectedSlotForDraft.dateKey, selectedSlotForDraft.hourSlot, draftId)} dateKey={selectedSlotForDraft.dateKey} hourSlot={selectedSlotForDraft.hourSlot} initialData={editingDraftItem} translations={tDraftModal} /> 
        </Suspense>
      )}
      {isEventRecordModalOpen && selectedSlotForEventRecord && ( 
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center"><div className="bg-background p-4 rounded-lg">加载中...</div></div>}>
          <EventRecordModal isOpen={isEventRecordModalOpen} onClose={() => setIsEventRecordModalOpen(false)} onSave={handleSaveEventRecord} onDelete={(id) => handleDeleteEventRecord(selectedSlotForEventRecord.dateKey, selectedSlotForEventRecord.hourSlot, id)} dateKey={selectedSlotForEventRecord.dateKey} hourSlot={selectedSlotForEventRecord.hourSlot} initialData={editingEventRecordItem} translations={tEventRecordModal} /> 
        </Suspense>
      )}

      {/* 移动待办事项模态框 */}
      {isMoveModalOpen && todoToMove && (
        <Dialog open={isMoveModalOpen} onOpenChange={setIsMoveModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{currentLanguage === 'zh-CN' ? '移动待办事项' : 'Move Todo Item'}</DialogTitle>
              <DialogDescription>
                {currentLanguage === 'zh-CN' 
                  ? `将 "${todoToMove.todo.text}" 移动到其他时间段` 
                  : `Move "${todoToMove.todo.text}" to another time slot`
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 max-h-60 overflow-y-auto">
              {timeIntervals.map(interval => {
                const slots = interval.key === 'midnight' ? ['00:00 - 01:00', '01:00 - 02:00', '02:00 - 03:00', '03:00 - 04:00', '04:00 - 05:00'] :
                             interval.key === 'earlyMorning' ? ['05:00 - 06:00', '06:00 - 07:00', '07:00 - 08:00', '08:00 - 09:00'] :
                             interval.key === 'morning' ? ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00'] :
                             interval.key === 'noon' ? ['12:00 - 13:00', '13:00 - 14:00'] :
                             interval.key === 'afternoon' ? ['14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'] :
                             ['18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00', '22:00 - 23:00', '23:00 - 00:00'];
                
                return slots.map(slot => {
                  if (slot === todoToMove.fromSlot) return null; // 不显示原时间段
                  
                  // 检查是否是过去的时间段
                  const slotTimeMatch = slot.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
                  let isSlotPast = false;
                  if (isViewingCurrentDay && slotTimeMatch) {
                    const slotEndTimeStr = slotTimeMatch[2];
                    let slotEndHour = parseInt(slotEndTimeStr.split(':')[0]);
                    const slotEndMinute = parseInt(slotEndTimeStr.split(':')[1]);
                    if (slotEndHour === 0 && slotEndMinute === 0) slotEndHour = 24;
                    const slotEndTotalMinutes = slotEndHour * 60 + slotEndMinute;
                    const currentTotalMinutes = clientPageLoadTime.getHours() * 60 + clientPageLoadTime.getMinutes();
                    isSlotPast = slotEndTotalMinutes <= currentTotalMinutes;
                  }
                  
                  // 过去的时间段直接不显示
                  if (isSlotPast) return null;
                  
                  return (
                    <Button
                      key={slot}
                      variant="outline"
                      className="justify-start h-auto p-3"
                      onClick={() => handleMoveTodo(slot)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{slot}</div>
                        <div className="text-xs text-muted-foreground">
                          {interval.label} • {currentLanguage === 'zh-CN' ? '可用' : 'Available'}
                        </div>
                      </div>
                    </Button>
                  );
                });
              }).flat().filter(Boolean)}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <ClipboardModal isOpen={isClipboardModalOpen} onClose={handleCloseClipboardModal} onSave={handleSaveFromClipboard} content={clipboardContent} translations={t.clipboard} />
    </TooltipProvider>
  );
}

export default function DayDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 sm:p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    }>
      <DayDetailPageContent />
    </Suspense>
  );
}
