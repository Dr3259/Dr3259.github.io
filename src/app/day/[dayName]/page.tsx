
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
import { usePlannerStore } from '@/hooks/usePlannerStore';

type RatingType = 'excellent' | 'terrible' | 'average' | null;

// Helper function to extract time range and generate hourly slots
export const generateHourlySlots = (intervalLabelWithTime: string): string[] => {
  const match = intervalLabelWithTime.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
  if (!match) return [];

  const startTimeStr = match[1];
  const endTimeStr = match[2];
  const startHour = parseInt(startTimeStr.split(':')[0]);
  let endHour = parseInt(endTimeStr.split(':')[0]);

  if (endTimeStr === "00:00" && startHour !== 0 && endHour === 0) endHour = 24;

  const slots: string[] = [];
  if (startHour > endHour && !(endHour === 0 && startHour > 0) ) {
     if (!(startHour < 24 && endHour === 0)) return [];
  }

  for (let h = startHour; h < endHour; h++) {
    const currentSlotStart = `${String(h).padStart(2, '0')}:00`;
    const nextHour = h + 1;
    const currentSlotEnd = `${String(nextHour).padStart(2, '0')}:00`;
    slots.push(`${currentSlotStart} - ${currentSlotEnd}`);
  }
  return slots;
};

// Translations and static data
const translations = { /* ... omitted for brevity ... */ };
type LanguageKey = keyof typeof translations;

const URL_REGEX = /(https?:\/\/[^\s$.?#].[^\s]*)/i;

export interface SlotDetails {
  dateKey: string; // YYYY-MM-DD
  hourSlot: string;
}

export const CategoryIcons: Record<CategoryType, React.ElementType> = { work: Briefcase, study: BookOpen, shopping: ShoppingCart, organizing: Archive, relaxing: Coffee, cooking: ChefHat, childcare: Baby, dating: CalendarClock };
export const DeadlineIcons: Record<NonNullable<TodoItem['deadline']>, React.ElementType> = { hour: Hourglass, today: CalendarCheck, tomorrow: Sunrise, thisWeek: CalendarRange, nextWeek: ArrowRightToLine, nextMonth: CalendarPlus };
export const RATING_ICONS: Record<string, React.ElementType> = { excellent: Smile, average: Meh, terrible: Frown };

const getDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

export default function DayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dayNameForDisplay = typeof params.dayName === 'string' ? decodeURIComponent(params.dayName) : "无效日期";
  const dateKey = searchParams.get('date') || '';
  const eventfulDaysParam = searchParams.get('eventfulDays');
  const eventfulDays = useMemo(() => eventfulDaysParam ? eventfulDaysParam.split(',') : [], [eventfulDaysParam]);

  const { toast } = useToast();

  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [clientPageLoadTime, setClientPageLoadTime] = useState<Date | null>(null);

  // Zustand Store Integration
  const { allDailyNotes, allRatings, allTodos, allMeetingNotes, allShareLinks, allReflections, setDailyNote, setRating, setTodosForSlot, setMeetingNotesForSlot, setShareLinksForSlot, setReflectionsForSlot, addShareLink } = usePlannerStore();

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
    const newLink: ShareLinkItem = { id: Date.now().toString(), url: item.url, title: item.title, category: item.category };
    const now = new Date(), currentHour = now.getHours(), currentDateKey = getDateKey(now);
    const timeIntervals = t.timeIntervals;
    let targetIntervalLabel = timeIntervals.evening;
    if (currentHour < 5) targetIntervalLabel = timeIntervals.midnight;
    else if (currentHour < 9) targetIntervalLabel = timeIntervals.earlyMorning;
    else if (currentHour < 12) targetIntervalLabel = timeIntervals.morning;
    else if (currentHour < 14) targetIntervalLabel = timeIntervals.noon;
    else if (currentHour < 18) targetIntervalLabel = timeIntervals.afternoon;
    const hourlySlots = generateHourlySlots(targetIntervalLabel);
    if (hourlySlots.length === 0) return { success: false, slotName: '' };
    const targetSlot = hourlySlots.find(slot => {
        const match = slot.match(/(\d{2}):\d{2}\s*-\s*(\d{2}):\d{2}/);
        if (match) { const startH = parseInt(match[1]), endH = parseInt(match[2]); return currentHour >= startH && currentHour < (endH || 24); }
        return false;
    }) || hourlySlots[0];
    addShareLink(currentDateKey, targetSlot, newLink);
    return { success: true, slotName: targetIntervalLabel.split(' ')[0] };
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

  const tTodoModal = translations[currentLanguage].todoModal;
  const tMeetingNoteModal = translations[currentLanguage].meetingNoteModal;
  const tShareLinkModal = translations[currentLanguage].shareLinkModal;
  const tReflectionModal = translations[currentLanguage].reflectionModal;
  const timeIntervals = useMemo(() => [{ key: 'midnight', label: t.midnight }, { key: 'earlyMorning', label: t.earlyMorning }, { key: 'morning', label: t.morning }, { key: 'noon', label: t.noon }, { key: 'afternoon', label: t.afternoon }, { key: 'evening', label: t.evening }], [t]);

  const dayProperties = useMemo(() => {
    if (!dateKey) return { isValid: false, dateObject: null };
    try { return { isValid: true, dateObject: parseISO(dateKey) }; } 
    catch (e) { return { isValid: false, dateObject: null }; }
  }, [dateKey]);

  const isViewingCurrentDay = useMemo(() => clientPageLoadTime && dayProperties.dateObject ? format(dayProperties.dateObject, 'yyyy-MM-dd') === format(clientPageLoadTime, 'yyyy-MM-dd') : false, [dayProperties, clientPageLoadTime]);
  const isPastDay = useMemo(() => clientPageLoadTime && dayProperties.dateObject ? isBefore(dayProperties.dateObject, new Date(clientPageLoadTime.getFullYear(), clientPageLoadTime.getMonth(), clientPageLoadTime.getDate())) : false, [clientPageLoadTime, dayProperties]);

  // Handlers for modals and data manipulation, now calling Zustand actions
  const handleOpenTodoModal = (hourSlot: string) => { if (dateKey) { setSelectedSlotForTodo({ dateKey, hourSlot }); setEditingTodoItem(null); setIsTodoModalOpen(true); } };
  const handleOpenEditTodoModal = (targetDateKey: string, targetHourSlot: string, todoToEdit: TodoItem) => { setEditingTodoItem(todoToEdit); setSelectedSlotForTodo({ dateKey: targetDateKey, hourSlot: targetHourSlot }); setIsTodoModalOpen(true); };
  const handleToggleTodoCompletion = (dateKey: string, hourSlot: string, todoId: string) => { const todos = allTodos[dateKey]?.[hourSlot] || []; setTodosForSlot(dateKey, hourSlot, todos.map(t => t.id === todoId ? { ...t, completed: !t.completed } : t)); };
  const handleDeleteTodo = (dateKey: string, hourSlot: string, todoId: string) => { const todos = allTodos[dateKey]?.[hourSlot] || []; setTodosForSlot(dateKey, hourSlot, todos.filter(t => t.id !== todoId)); };

  const handleOpenMeetingNoteModal = (hourSlot: string, noteToEdit?: MeetingNoteItem) => { if (dateKey) { setSelectedSlotForMeetingNote({ dateKey, hourSlot }); setEditingMeetingNoteItem(noteToEdit || null); setIsMeetingNoteModalOpen(true); } };
  const handleSaveMeetingNote = (dateKey: string, hourSlot: string, savedNote: MeetingNoteItem) => { const notes = allMeetingNotes[dateKey]?.[hourSlot] || []; const idx = notes.findIndex(n => n.id === savedNote.id); const updated = idx > -1 ? notes.map((n, i) => i === idx ? savedNote : n) : [...notes, savedNote]; setMeetingNotesForSlot(dateKey, hourSlot, updated); };
  const handleDeleteMeetingNote = (dateKey: string, hourSlot: string, noteId: string) => { const notes = allMeetingNotes[dateKey]?.[hourSlot] || []; setMeetingNotesForSlot(dateKey, hourSlot, notes.filter(n => n.id !== noteId)); };

  const handleOpenShareLinkModal = (hourSlot: string, linkToEdit?: ShareLinkItem) => { if (dateKey) { setSelectedSlotForShareLink({ dateKey, hourSlot }); setEditingShareLinkItem(linkToEdit || null); setIsShareLinkModalOpen(true); } };
  const handleSaveShareLink = (dateKey: string, hourSlot: string, savedLink: ShareLinkItem) => { const links = allShareLinks[dateKey]?.[hourSlot] || []; const idx = links.findIndex(l => l.id === savedLink.id); const updated = idx > -1 ? links.map((l, i) => i === idx ? savedLink : l) : [...links, savedLink]; setShareLinksForSlot(dateKey, hourSlot, updated); };
  const handleDeleteShareLink = (dateKey: string, hourSlot: string, linkId: string) => { const links = allShareLinks[dateKey]?.[hourSlot] || []; setShareLinksForSlot(dateKey, hourSlot, links.filter(l => l.id !== linkId)); };

  const handleOpenReflectionModal = (hourSlot: string, reflectionToEdit?: ReflectionItem) => { if (dateKey) { setSelectedSlotForReflection({ dateKey, hourSlot }); setEditingReflectionItem(reflectionToEdit || null); setIsReflectionModalOpen(true); } };
  const handleSaveReflection = (dateKey: string, hourSlot: string, savedReflection: ReflectionItem) => { const reflections = allReflections[dateKey]?.[hourSlot] || []; const idx = reflections.findIndex(r => r.id === savedReflection.id); const updated = idx > -1 ? reflections.map((r, i) => i === idx ? savedReflection : r) : [...reflections, savedReflection]; setReflectionsForSlot(dateKey, hourSlot, updated); };
  const handleDeleteReflection = (dateKey: string, hourSlot: string, reflectionId: string) => { const reflections = allReflections[dateKey]?.[hourSlot] || []; setReflectionsForSlot(dateKey, hourSlot, reflections.filter(r => r.id !== reflectionId)); };

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
            {!dayProperties.isValid || isBefore(dayProperties.dateObject, new Date()) && <div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => navigateToDay('prev')} aria-label={t.previousDay} disabled={isPrevDisabled}><ChevronLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" onClick={() => navigateToDay('next')} aria-label={t.nextDay} disabled={isNextDisabled}><ChevronRight className="h-4 w-4" /></Button></div>}
        </header>

        <main className="w-full max-w-4xl">
          <DailySummaryCard translations={t} dateKey={dateKey} dayNameForDisplay={dayNameForDisplay} dailyNote={allDailyNotes[dateKey] || ""} rating={allRatings[dateKey] || null} isPastDay={isPastDay} isViewingCurrentDay={isViewingCurrentDay} isClientAfter6PM={clientPageLoadTime.getHours() >= 18} onDailyNoteChange={(note) => setDailyNote(dateKey, note)} onRatingChange={(rating) => setRating(dateKey, rating)} />
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">{t.timeIntervalsTitle(dayNameForDisplay)}</h2>
            <div className="grid grid-cols-1 gap-6">
              {timeIntervals.map(interval => ( <TimeIntervalSection key={interval.key} interval={interval} dateKey={dateKey} isPastDay={isPastDay} isViewingCurrentDay={isViewingCurrentDay} clientPageLoadTime={clientPageLoadTime} isCurrentActiveInterval={isViewingCurrentDay && activeIntervalKey === interval.key} intervalRef={el => { if (el) intervalRefs.current[interval.key] = el; }} allTodos={allTodos} allMeetingNotes={allMeetingNotes} allShareLinks={allShareLinks} allReflections={allReflections} onToggleTodoCompletion={handleToggleTodoCompletion} onDeleteTodo={handleDeleteTodo} onOpenEditTodoModal={handleOpenEditTodoModal} onOpenMeetingNoteModal={handleOpenMeetingNoteModal} onOpenShareLinkModal={handleOpenShareLinkModal} onOpenReflectionModal={handleOpenReflectionModal} onDeleteMeetingNote={handleDeleteMeetingNote} onDeleteShareLink={handleDeleteShareLink} onDeleteReflection={handleDeleteReflection} translations={t} /> ))}
            </div>
          </div>
        </main>
      </div>

      {isTodoModalOpen && selectedSlotForTodo && ( <TodoModal isOpen={isTodoModalOpen} onClose={() => setIsTodoModalOpen(false)} onSaveTodos={setTodosForSlot} dateKey={selectedSlotForTodo.dateKey} hourSlot={selectedSlotForTodo.hourSlot} initialTodos={allTodos[selectedSlotForTodo.dateKey]?.[selectedSlotForTodo.hourSlot] || []} translations={tTodoModal} defaultEditingTodoId={editingTodoItem?.id} /> )}
      {isMeetingNoteModalOpen && selectedSlotForMeetingNote && ( <MeetingNoteModal isOpen={isMeetingNoteModalOpen} onClose={() => setIsMeetingNoteModalOpen(false)} onSave={handleSaveMeetingNote} onDelete={(noteId) => handleDeleteMeetingNote(selectedSlotForMeetingNote.dateKey, selectedSlotForMeetingNote.hourSlot, noteId)} dateKey={selectedSlotForMeetingNote.dateKey} hourSlot={selectedSlotForMeetingNote.hourSlot} initialData={editingMeetingNoteItem} translations={tMeetingNoteModal} /> )}
      {isShareLinkModalOpen && selectedSlotForShareLink && ( <ShareLinkModal isOpen={isShareLinkModalOpen} onClose={() => setIsShareLinkModalOpen(false)} onSave={handleSaveShareLink} onDelete={(linkId) => handleDeleteShareLink(selectedSlotForShareLink.dateKey, selectedSlotForShareLink.hourSlot, linkId)} dateKey={selectedSlotForShareLink.dateKey} hourSlot={selectedSlotForShareLink.hourSlot} initialData={editingShareLinkItem} translations={tShareLinkModal} /> )}
      {isReflectionModalOpen && selectedSlotForReflection && ( <ReflectionModal isOpen={isReflectionModalOpen} onClose={() => setIsReflectionModalOpen(false)} onSave={handleSaveReflection} onDelete={(reflectionId) => handleDeleteReflection(selectedSlotForReflection.dateKey, selectedSlotForReflection.hourSlot, reflectionId)} dateKey={selectedSlotForReflection.dateKey} hourSlot={selectedSlotForReflection.hourSlot} initialData={editingReflectionItem} translations={tReflectionModal} /> )}
      <ClipboardModal isOpen={isClipboardModalOpen} onClose={handleCloseClipboardModal} onSave={handleSaveFromClipboard} content={clipboardContent} translations={t.clipboard} />
    </TooltipProvider>
  );
}
