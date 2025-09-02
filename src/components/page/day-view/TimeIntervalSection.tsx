
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { generateHourlySlots } from '@/app/day/[dayName]/page';
import { ItemLists } from './ItemLists';
import type { TodoItem, MeetingNoteItem, ShareLinkItem, ReflectionItem } from '@/app/day/[dayName]/page';

interface TimeIntervalSectionProps {
    interval: { key: string; label: string };
    dateKey: string;
    isPastDay: boolean;
    isViewingCurrentDay: boolean;
    clientPageLoadTime: Date;
    isCurrentActiveInterval: boolean;
    intervalRef: (el: HTMLDivElement | null) => void;
    allTodos: Record<string, Record<string, TodoItem[]>>;
    allMeetingNotes: Record<string, Record<string, MeetingNoteItem[]>>;
    allShareLinks: Record<string, Record<string, ShareLinkItem[]>>;
    allReflections: Record<string, Record<string, ReflectionItem[]>>;
    translations: any;
    onToggleTodoCompletion: (dateKey: string, hourSlot: string, todoId: string) => void;
    onDeleteTodo: (dateKey: string, hourSlot: string, todoId: string) => void;
    onOpenEditTodoModal: (dateKey: string, hourSlot: string, todo: TodoItem) => void;
    onOpenMeetingNoteModal: (hourSlot: string, note?: MeetingNoteItem) => void;
    onDeleteMeetingNote: (dateKey: string, hourSlot: string, noteId: string) => void;
    onOpenShareLinkModal: (hourSlot: string, link?: ShareLinkItem) => void;
    onDeleteShareLink: (dateKey: string, hourSlot: string, linkId: string) => void;
    onOpenReflectionModal: (hourSlot: string, reflection?: ReflectionItem) => void;
    onDeleteReflection: (dateKey: string, hourSlot: string, reflectionId: string) => void;
}

export const TimeIntervalSection: React.FC<TimeIntervalSectionProps> = ({
    interval, dateKey, isPastDay, isViewingCurrentDay, clientPageLoadTime,
    isCurrentActiveInterval, intervalRef, allTodos, allMeetingNotes, allShareLinks,
    allReflections, translations: t,
    onToggleTodoCompletion, onDeleteTodo, onOpenEditTodoModal, onOpenMeetingNoteModal,
    onDeleteMeetingNote, onOpenShareLinkModal, onDeleteShareLink, onOpenReflectionModal, onDeleteReflection
}) => {

    const hourlySlotsForInterval = generateHourlySlots(interval.label);
    const hasContentInAnySlotOfInterval = hourlySlotsForInterval.some(slot =>
        (allTodos[dateKey]?.[slot]?.length > 0) ||
        (allMeetingNotes[dateKey]?.[slot]?.length > 0) ||
        (allShareLinks[dateKey]?.[slot]?.length > 0) ||
        (allReflections[dateKey]?.[slot]?.length > 0)
    );

    if (isPastDay && !hasContentInAnySlotOfInterval) {
        return null;
    }
    
    if (isViewingCurrentDay && !hasContentInAnySlotOfInterval) {
        const match = interval.label.match(/\((\d{2}):\d{2})\s*-\s*(\d{2}:\d{2})\)/);
        if (match) {
            const [, , endTimeStr] = match;
            let [endH, endM] = endTimeStr.split(':').map(Number);
            if (endH === 0 && endM === 0) endH = 24;

            const intervalEndTotalMinutes = endH * 60 + endM;
            const nowTotalMinutes = clientPageLoadTime.getHours() * 60 + clientPageLoadTime.getMinutes();

            if (intervalEndTotalMinutes <= nowTotalMinutes) {
                return null;
            }
        }
    }

    const mainTitle = interval.label.split(' (')[0];
    const timeRangeSubtext = interval.label.includes('(') ? `(${interval.label.split(' (')[1]}` : '';

    return (
        <div
            ref={intervalRef}
            className={cn(
                "bg-card p-4 rounded-lg shadow-lg transition-all duration-300",
                isCurrentActiveInterval && "ring-2 ring-primary shadow-xl scale-[1.01]"
            )}
        >
            <h3 className="text-lg font-medium text-foreground mb-1">{mainTitle}</h3>
            {timeRangeSubtext && <p className="text-xs text-muted-foreground mb-2">{timeRangeSubtext}</p>}
            <div className="h-1 w-full bg-primary/30 rounded-full mb-3"></div>

            {hourlySlotsForInterval.length > 0 ? (
                <div className="space-y-3 mt-4">
                    {hourlySlotsForInterval.map((slot, slotIndex) => {
                         const hasAnyContentForThisSlot = 
                            (allTodos[dateKey]?.[slot]?.length > 0) ||
                            (allMeetingNotes[dateKey]?.[slot]?.length > 0) ||
                            (allShareLinks[dateKey]?.[slot]?.length > 0) ||
                            (allReflections[dateKey]?.[slot]?.length > 0);

                        let isAddingDisabledForThisSlot = isPastDay;
                        let shouldHideSlot = false;
                        
                        if (!isPastDay && isViewingCurrentDay) {
                            const slotTimeMatch = slot.match(/(\d{2}):\d{2}\s*-\s*(\d{2}):\d{2}/);
                            if (slotTimeMatch) {
                                const slotEndTimeStr = slotTimeMatch[2];
                                let slotEndHour = parseInt(slotEndTimeStr.split(':')[0]);
                                const slotEndMinute = parseInt(slotEndTimeStr.split(':')[1]);

                                if (slotEndHour === 0 && slotEndMinute === 0 && slotTimeMatch[1].split(':')[0] !== "00") {
                                    slotEndHour = 24;
                                }
                                const slotEndTotalMinutes = slotEndHour * 60 + slotEndMinute;
                                const pageLoadTotalMinutes = clientPageLoadTime.getHours() * 60 + clientPageLoadTime.getMinutes();

                                if (slotEndTotalMinutes <= pageLoadTotalMinutes) {
                                    isAddingDisabledForThisSlot = true;
                                    if (!hasAnyContentForThisSlot) {
                                        shouldHideSlot = true;
                                    }
                                }
                            }
                        }

                        if (isPastDay && !hasAnyContentForThisSlot) return null;
                        if(shouldHideSlot) return null;
                        
                        return (
                            <ItemLists
                                key={slotIndex}
                                dateKey={dateKey}
                                slot={slot}
                                isPastDay={isPastDay}
                                isAddingDisabledForThisSlot={isAddingDisabledForThisSlot}
                                hasAnyContentForThisSlot={hasAnyContentForThisSlot}
                                todos={allTodos[dateKey]?.[slot] || []}
                                meetingNotes={allMeetingNotes[dateKey]?.[slot] || []}
                                shareLinks={allShareLinks[dateKey]?.[slot] || []}
                                reflections={allReflections[dateKey]?.[slot] || []}
                                onToggleTodoCompletion={onToggleTodoCompletion}
                                onDeleteTodo={onDeleteTodo}
                                onOpenEditTodoModal={onOpenEditTodoModal}
                                onOpenMeetingNoteModal={onOpenMeetingNoteModal}
                                onDeleteMeetingNote={onDeleteMeetingNote}
                                onOpenShareLinkModal={onOpenShareLinkModal}
                                onDeleteShareLink={onDeleteShareLink}
                                onOpenReflectionModal={onOpenReflectionModal}
                                onDeleteReflection={onDeleteReflection}
                                translations={t}
                            />
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
};
