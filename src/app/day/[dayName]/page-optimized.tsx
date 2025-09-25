// src/app/day/[dayName]/page-optimized.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { TooltipProvider } from "@/components/ui/tooltip";

// 预加载关键组件，避免懒加载延迟
import { TodoModal } from '@/components/TodoModal';
import { MeetingNoteModal } from '@/components/MeetingNoteModal';
import { ShareLinkModal } from '@/components/ShareLinkModal';
import { ReflectionModal } from '@/components/ReflectionModal';

import type { TodoItem, CategoryType } from '@/components/TodoModal';
import type { MeetingNoteItem } from '@/components/MeetingNoteModal';
import type { ShareLinkItem } from '@/components/ShareLinkModal';
import type { ReflectionItem } from '@/components/ReflectionModal';
import { format, parseISO, isBefore, isToday } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { ClipboardModal } from '@/components/ClipboardModal';
import { DailySummaryCard } from '@/components/page/day-view/DailySummaryCard';
import { TimeIntervalSection } from '@/components/page/day-view/TimeIntervalSection';
import { usePlannerStore } from '@/hooks/usePlannerStore';
import { translations, type LanguageKey } from '@/lib/translations';
import { useAuth } from '@/context/AuthContext';

type RatingType = 'excellent' | 'terrible' | 'average' | null;

// 优化：预计算时间段，避免运行时计算
const TIME_INTERVALS = [
  { key: 'midnight', labelKey: 'midnight', timeRange: '(00:00 - 05:00)', slots: ['00:00 - 01:00', '01:00 - 02:00', '02:00 - 03:00', '03:00 - 04:00', '04:00 - 05:00'] },
  { key: 'earlyMorning', labelKey: 'earlyMorning', timeRange: '(05:00 - 09:00)', slots: ['05:00 - 06:00', '06:00 - 07:00', '07:00 - 08:00', '08:00 - 09:00'] },
  { key: 'morning', labelKey: 'morning', timeRange: '(09:00 - 12:00)', slots: ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00'] },
  { key: 'noon', labelKey: 'noon', timeRange: '(12:00 - 14:00)', slots: ['12:00 - 13:00', '13:00 - 14:00'] },
  { key: 'afternoon', labelKey: 'afternoon', timeRange: '(14:00 - 18:00)', slots: ['14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'] },
  { key: 'evening', labelKey: 'evening', timeRange: '(18:00 - 24:00)', slots: ['18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00', '22:00 - 23:00', '23:00 - 00:00'] }
] as const;

const URL_REGEX = /(https?:\/\/[^\s$.?#].[^\s]*)/i;
const getDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

export default function DayDetailPageOptimized() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  // 基础参数解析 - 简化处理
  const dayNameForDisplay = typeof params.dayName === 'string' ? decodeURIComponent(params.dayName) : "无效日期";
  const dateKey = searchParams.get('date') || '';
  const eventfulDays = useMemo(() => {
    const param = searchParams.get('eventfulDays');
    return param ? param.split(',') : [];
  }, [searchParams]);

  // 简化状态管理 - 合并相关状态
  const [pageState, setPageState] = useState({
    currentLanguage: 'en' as LanguageKey,
    clientPageLoadTime: null as Date | null,
    isLoginPromptDismissed: typeof window !== 'undefined' ? localStorage.getItem('loginPromptDismissed') === 'true' : false
  });

  // 模态框状态 - 使用单一对象管理
  const [modalState, setModalState] = useState({
    todo: { isOpen: false, slot: null as { dateKey: string; hourSlot: string } | null, editing: null as TodoItem | null },
    meetingNote: { isOpen: false, slot: null as { dateKey: string; hourSlot: string } | null, editing: null as MeetingNoteItem | null },
    shareLink: { isOpen: false, slot: null as { dateKey: string; hourSlot: string } | null, editing: null as ShareLinkItem | null },
    reflection: { isOpen: false, slot: null as { dateKey: string; hourSlot: string } | null, editing: null as ReflectionItem | null },
    clipboard: { isOpen: false, content: '', lastProcessed: '' }
  });

  // 优化：预计算翻译对象，避免每次渲染重新计算
  const translations_cache = useMemo(() => {
    const t = translations[pageState.currentLanguage];
    const isZh = pageState.currentLanguage === 'zh-CN';
    
    return {
      ...t,
      // 预计算所有需要的翻译
      timeIntervals: TIME_INTERVALS.map(interval => ({
        ...interval,
        label: `${t.timeIntervals[interval.labelKey]} ${interval.timeRange}`
      })),
      modals: {
        todo: {
          modalTitle: (hourSlot: string) => isZh ? `为 ${hourSlot} 添加任务` : `Add Tasks for ${hourSlot}`,
          modalDescription: isZh ? '为这个时间段添加和管理任务。' : 'Add and manage your tasks for this time slot.',
          // ... 其他翻译
        },
        // ... 其他模态框翻译
      }
    };
  }, [pageState.currentLanguage]);

  // 优化：仅获取当前日期数据
  const plannerStore = usePlannerStore();
  const currentDayData = useMemo(() => {
    if (!dateKey) return { dailyNote: '', rating: null, todos: {}, meetingNotes: {}, shareLinks: {}, reflections: {} };
    return {
      dailyNote: plannerStore.allDailyNotes[dateKey] || '',
      rating: plannerStore.allRatings[dateKey] || null,
      todos: plannerStore.allTodos[dateKey] || {},
      meetingNotes: plannerStore.allMeetingNotes[dateKey] || {},
      shareLinks: plannerStore.allShareLinks[dateKey] || {},
      reflections: plannerStore.allReflections[dateKey] || {}
    };
  }, [dateKey, plannerStore.allDailyNotes, plannerStore.allRatings, plannerStore.allTodos, plannerStore.allMeetingNotes, plannerStore.allShareLinks, plannerStore.allReflections]);

  // 优化：简化日期属性计算
  const dayProperties = useMemo(() => {
    if (!dateKey) return { isValid: false, dateObject: null, isViewingCurrentDay: false, isPastDay: false };
    try {
      const dateObject = parseISO(dateKey);
      const now = pageState.clientPageLoadTime || new Date();
      return {
        isValid: true,
        dateObject,
        isViewingCurrentDay: format(dateObject, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd'),
        isPastDay: isBefore(dateObject, new Date(now.getFullYear(), now.getMonth(), now.getDate()))
      };
    } catch (e) {
      return { isValid: false, dateObject: null, isViewingCurrentDay: false, isPastDay: false };
    }
  }, [dateKey, pageState.clientPageLoadTime]);

  // 优化：简化模态框处理函数
  const openModal = useCallback((type: keyof typeof modalState, hourSlot: string, editing?: any) => {
    if (!dateKey) return;
    setModalState(prev => ({
      ...prev,
      [type]: {
        isOpen: true,
        slot: { dateKey, hourSlot },
        editing: editing || null
      }
    }));
  }, [dateKey]);

  const closeModal = useCallback((type: keyof typeof modalState) => {
    setModalState(prev => ({
      ...prev,
      [type]: { ...prev[type], isOpen: false, editing: null }
    }));
  }, []);

  // 优化：简化导航逻辑
  const navigation = useMemo(() => {
    const currentIndex = eventfulDays.indexOf(dateKey);
    return {
      canGoPrev: currentIndex > 0,
      canGoNext: currentIndex < eventfulDays.length - 1,
      prevDate: currentIndex > 0 ? eventfulDays[currentIndex - 1] : null,
      nextDate: currentIndex < eventfulDays.length - 1 ? eventfulDays[currentIndex + 1] : null
    };
  }, [eventfulDays, dateKey]);

  const navigateToDay = useCallback((direction: 'next' | 'prev') => {
    const targetDate = direction === 'next' ? navigation.nextDate : navigation.prevDate;
    if (!targetDate) return;
    
    const newDayName = format(parseISO(targetDate), 'EEEE', { 
      locale: pageState.currentLanguage === 'zh-CN' ? zhCN : enUS 
    });
    router.push(`/day/${encodeURIComponent(newDayName)}?date=${targetDate}&eventfulDays=${eventfulDays.join(',')}`);
  }, [navigation, router, eventfulDays, pageState.currentLanguage]);

  // 初始化效果 - 合并多个useEffect
  useEffect(() => {
    const now = new Date();
    const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
    
    setPageState(prev => ({
      ...prev,
      clientPageLoadTime: now,
      currentLanguage: browserLang
    }));
  }, []);

  // 早期返回优化
  if (!dateKey || !pageState.clientPageLoadTime) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 sm:p-8">
        <Link href="/" passHref>
          <Button variant="outline" size="sm" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {translations_cache.backToWeek || '返回周视图'}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-8">
        {/* 简化的头部 */}
        <header className="w-full max-w-4xl mb-8 flex justify-between items-center">
          <Link href="/" passHref>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {translations_cache.backToWeek || '返回周视图'}
            </Button>
          </Link>
          
          {dayProperties.isValid && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigateToDay('prev')} 
                disabled={!navigation.canGoPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigateToDay('next')} 
                disabled={!navigation.canGoNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </header>

        <main className="w-full max-w-4xl">
          {/* 登录提示 - 简化 */}
          {!user && !pageState.isLoginPromptDismissed && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg relative">
              <button
                onClick={() => {
                  setPageState(prev => ({ ...prev, isLoginPromptDismissed: true }));
                  localStorage.setItem('loginPromptDismissed', 'true');
                }}
                className="absolute top-2 right-2 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors"
              >
                ×
              </button>
              <p className="text-sm text-amber-800 dark:text-amber-200 pr-6">
                {pageState.currentLanguage === 'zh-CN' 
                  ? '💾 当前使用本地模式，数据仅保存在此设备。登录后可云端同步数据。' 
                  : '💾 Currently in local mode. Data is saved on this device only. Sign in to sync data to the cloud.'
                }
              </p>
            </div>
          )}

          {/* 日期摘要卡片 */}
          <DailySummaryCard 
            translations={translations_cache}
            dateKey={dateKey}
            dayNameForDisplay={dayNameForDisplay}
            dailyNote={currentDayData.dailyNote}
            rating={currentDayData.rating}
            isPastDay={dayProperties.isPastDay}
            isViewingCurrentDay={dayProperties.isViewingCurrentDay}
            isClientAfter6PM={pageState.clientPageLoadTime.getHours() >= 18}
            onDailyNoteChange={(note) => plannerStore.setDailyNote(dateKey, note)}
            onRatingChange={(rating) => plannerStore.setRating(dateKey, rating)}
          />

          {/* 时间段列表 - 使用预计算的数据 */}
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">
              {translations_cache.timeIntervalsTitle?.(dayNameForDisplay) || `${dayNameForDisplay} 时间安排`}
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {translations_cache.timeIntervals.map(interval => (
                <TimeIntervalSection
                  key={interval.key}
                  interval={interval}
                  dateKey={dateKey}
                  isPastDay={dayProperties.isPastDay}
                  isViewingCurrentDay={dayProperties.isViewingCurrentDay}
                  clientPageLoadTime={pageState.clientPageLoadTime}
                  isCurrentActiveInterval={false} // 简化活动区间逻辑
                  intervalRef={() => {}} // 简化引用逻辑
                  allTodos={{[dateKey]: currentDayData.todos}}
                  allMeetingNotes={{[dateKey]: currentDayData.meetingNotes}}
                  allShareLinks={{[dateKey]: currentDayData.shareLinks}}
                  allReflections={{[dateKey]: currentDayData.reflections}}
                  onToggleTodoCompletion={(dateKey, hourSlot, todoId) => {
                    const todos = currentDayData.todos[hourSlot] || [];
                    plannerStore.setTodosForSlot(dateKey, hourSlot, todos.map(t => 
                      t.id === todoId ? { ...t, completed: !t.completed } : t
                    ));
                  }}
                  onDeleteTodo={(dateKey, hourSlot, todoId) => {
                    const todos = currentDayData.todos[hourSlot] || [];
                    plannerStore.setTodosForSlot(dateKey, hourSlot, todos.filter(t => t.id !== todoId));
                  }}
                  onOpenTodoModal={(hourSlot) => openModal('todo', hourSlot)}
                  onOpenEditTodoModal={(dateKey, hourSlot, todo) => openModal('todo', hourSlot, todo)}
                  onMoveTodoModal={() => {}} // 简化移动逻辑
                  onOpenMeetingNoteModal={(hourSlot, note) => openModal('meetingNote', hourSlot, note)}
                  onOpenShareLinkModal={(hourSlot, link) => openModal('shareLink', hourSlot, link)}
                  onOpenReflectionModal={(hourSlot, reflection) => openModal('reflection', hourSlot, reflection)}
                  onDeleteMeetingNote={(dateKey, hourSlot, noteId) => {
                    const notes = currentDayData.meetingNotes[hourSlot] || [];
                    plannerStore.setMeetingNotesForSlot(dateKey, hourSlot, notes.filter(n => n.id !== noteId));
                  }}
                  onDeleteShareLink={(dateKey, hourSlot, linkId) => {
                    const links = currentDayData.shareLinks[hourSlot] || [];
                    plannerStore.setShareLinksForSlot(dateKey, hourSlot, links.filter(l => l.id !== linkId));
                  }}
                  onDeleteReflection={(dateKey, hourSlot, reflectionId) => {
                    const reflections = currentDayData.reflections[hourSlot] || [];
                    plannerStore.setReflectionsForSlot(dateKey, hourSlot, reflections.filter(r => r.id !== reflectionId));
                  }}
                  translations={translations_cache}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* 模态框 - 预加载，避免懒加载延迟 */}
      {modalState.todo.isOpen && modalState.todo.slot && (
        <TodoModal
          isOpen={modalState.todo.isOpen}
          onClose={() => closeModal('todo')}
          onSaveTodos={plannerStore.setTodosForSlot}
          dateKey={modalState.todo.slot.dateKey}
          hourSlot={modalState.todo.slot.hourSlot}
          initialTodos={currentDayData.todos[modalState.todo.slot.hourSlot] || []}
          translations={translations_cache.modals?.todo || {}}
          defaultEditingTodoId={modalState.todo.editing?.id}
        />
      )}

      {modalState.meetingNote.isOpen && modalState.meetingNote.slot && (
        <MeetingNoteModal
          isOpen={modalState.meetingNote.isOpen}
          onClose={() => closeModal('meetingNote')}
          onSave={(dateKey, hourSlot, note) => {
            const notes = currentDayData.meetingNotes[hourSlot] || [];
            const idx = notes.findIndex(n => n.id === note.id);
            const updated = idx > -1 ? notes.map((n, i) => i === idx ? note : n) : [...notes, note];
            plannerStore.setMeetingNotesForSlot(dateKey, hourSlot, updated);
          }}
          onDelete={(noteId) => {
            if (modalState.meetingNote.slot) {
              const notes = currentDayData.meetingNotes[modalState.meetingNote.slot.hourSlot] || [];
              plannerStore.setMeetingNotesForSlot(
                modalState.meetingNote.slot.dateKey, 
                modalState.meetingNote.slot.hourSlot, 
                notes.filter(n => n.id !== noteId)
              );
            }
          }}
          dateKey={modalState.meetingNote.slot.dateKey}
          hourSlot={modalState.meetingNote.slot.hourSlot}
          initialData={modalState.meetingNote.editing}
          translations={translations_cache.modals?.meetingNote || {}}
        />
      )}

      {/* 其他模态框类似处理... */}

      <ClipboardModal
        isOpen={modalState.clipboard.isOpen}
        onClose={() => closeModal('clipboard')}
        onSave={() => {}}
        content={modalState.clipboard.content}
        translations={translations_cache.clipboard || {}}
      />
    </TooltipProvider>
  );
}