
"use client";

import React from 'react';
import { format, isSameDay, isBefore, isAfter } from 'date-fns';
import { DayBox } from '@/components/DayBox';
import { Card } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import type { AllLoadedData, RatingType } from '@/lib/page-types';

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

    const handleWeeklySummaryClick = () => {
        // This navigation should be handled in the parent component
        // Or pass router as a prop
        console.log("Weekly summary clicked");
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 w-full max-w-4xl place-items-center mb-12 sm:mb-16">
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
            <Card 
                className="w-full h-44 sm:w-40 sm:h-48 flex flex-col rounded-xl border-2 border-transparent hover:border-accent/70 bg-card shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer"
                onClick={handleWeeklySummaryClick}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleWeeklySummaryClick(); }}
                role="button"
                tabIndex={0}
                aria-label={t.weeklySummaryPlaceholder}
            >
                <Card.Header className="p-2 pb-1 text-center">
                    <Card.Title className="text-lg sm:text-xl font-medium text-foreground">{t.weeklySummaryTitle}</Card.Title>
                </Card.Header>
                <Card.Content className="p-2 flex-grow flex flex-col items-center justify-center">
                    <BarChart className="w-12 h-12 text-primary/80 mb-2" />
                    <p className="text-xs text-center text-muted-foreground">{t.weeklySummaryPlaceholder}</p>
                </Card.Content>
            </Card>
        </div>
    );
};

    