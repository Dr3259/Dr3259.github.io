
"use client";

import React from 'react';
import { format, isSameDay, isBefore, isAfter } from 'date-fns';
import type { Locale } from 'date-fns';
import { DayBox } from '@/components/DayBox';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import type { AllLoadedData, RatingType } from '@/lib/page-types';
import Link from 'next/link';

interface DaysGridProps {
    daysToDisplay: Date[];
    dateLocale: Locale;
    systemToday: Date;
    allLoadedData: AllLoadedData;
    isAfter6PMToday: boolean;
    translations: any;
    onDaySelect: (dayName: string, date: Date) => void;
    onRatingChange: (dateKey: string, newRating: RatingType) => void;
    onHoverStart: (data: { dayName: string; notes: string; imageHint: string }) => void;
    onHoverEnd: () => void;
}

const getDateKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

const dayHasContent = (date: Date, data: AllLoadedData): boolean => {
    const dateKey = getDateKey(date);
    
    if (data.allDailyNotes[dateKey]?.trim()) return true;
    if (data.ratings[dateKey]) return true; 

    const checkSlotItems = (items: Record<string, any[]> | undefined) => 
        items && Object.values(items).some(slotItems => slotItems.length > 0);

    if (checkSlotItems(data.allTodos[dateKey])) return true;
    if (checkSlotItems(data.allMeetingNotes[dateKey])) return true;
    if (checkSlotItems(data.allShareLinks[dateKey])) return true;
    if (checkSlotItems(data.allReflections[dateKey])) return true;

    return false;
};

export const DaysGrid: React.FC<DaysGridProps> = ({
    daysToDisplay,
    dateLocale,
    systemToday,
    allLoadedData,
    isAfter6PMToday,
    translations: t,
    onDaySelect,
    onRatingChange,
    onHoverStart,
    onHoverEnd
}) => {

    return (
        <>
            {daysToDisplay.map((dateInWeek) => {
                const dayNameForDisplay = format(dateInWeek, 'EEEE', { locale: dateLocale });
                const dateKeyForStorage = getDateKey(dateInWeek);
                
                const isCurrentActualDay = isSameDay(dateInWeek, systemToday);
                const isPastActualDay = isBefore(dateInWeek, systemToday) && !isSameDay(dateInWeek, systemToday);
                const isFutureActualDay = isAfter(dateInWeek, systemToday) && !isSameDay(dateInWeek, systemToday);
                
                const noteForThisDayBox = allLoadedData.allDailyNotes[dateKeyForStorage] || '';
                const ratingForThisDayBox = allLoadedData.ratings[dateKeyForStorage] || null;
                const hasAnyDataForThisDay = dayHasContent(dateInWeek, allLoadedData);

                return (
                    <DayBox
                        key={dateKeyForStorage}
                        dayName={dayNameForDisplay}
                        onClick={() => onDaySelect(dayNameForDisplay, dateInWeek)}
                        notes={noteForThisDayBox} 
                        dayHasAnyData={hasAnyDataForThisDay}
                        rating={ratingForThisDayBox}
                        onRatingChange={(newRating) => onRatingChange(dateKeyForStorage, newRating as RatingType)}
                        isCurrentDay={isCurrentActualDay}
                        isPastDay={isPastActualDay}
                        isFutureDay={isFutureActualDay}
                        isAfter6PMToday={isAfter6PMToday} 
                        todayLabel={t.todayPrefix}
                        selectDayLabel={t.selectDayAria(dayNameForDisplay)}
                        contentIndicatorLabel={t.hasNotesAria}
                        ratingUiLabels={t.ratingLabels}
                        onHoverStart={onHoverStart}
                        onHoverEnd={onHoverEnd}
                        imageHint="activity memory"
                    />
                );
            })}
        </>
    );
};
