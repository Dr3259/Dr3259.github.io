
"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays, Undo } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfWeek, endOfWeek, subWeeks, isSameWeek, isAfter, parseISO, addDays } from 'date-fns';
import type { Locale } from 'date-fns';
import { startOfMonth, isSameDay, differenceInDays } from 'date-fns';

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

interface WeekNavigatorProps {
    translations: any;
    dateLocale: Locale;
    displayedDate: Date;
    setDisplayedDate: (date: Date) => void;
    systemToday: Date;
    eventfulDays: string[];
}

export const WeekNavigator: React.FC<WeekNavigatorProps> = ({
    translations: t,
    dateLocale,
    displayedDate,
    setDisplayedDate,
    systemToday,
    eventfulDays
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const firstEverWeekWithDataStart = useMemo(() => {
        if(eventfulDays.length === 0) return null;
        return startOfWeek(parseISO(eventfulDays[0]), { weekStartsOn: 1, locale: dateLocale });
    }, [eventfulDays, dateLocale]);

    const currentDisplayedWeekStart = useMemo(() => {
        return startOfWeek(displayedDate, { weekStartsOn: 1, locale: dateLocale });
    }, [displayedDate, dateLocale]);

    const isViewingActualCurrentWeek = useMemo(() => {
        return isSameWeek(displayedDate, systemToday, { weekStartsOn: 1, locale: dateLocale });
    }, [displayedDate, systemToday, dateLocale]);

    const isPreviousWeekDisabled = useMemo(() => {
        if (!firstEverWeekWithDataStart) return true;
        return !isAfter(currentDisplayedWeekStart, firstEverWeekWithDataStart);
    }, [firstEverWeekWithDataStart, currentDisplayedWeekStart]);

    const isNextWeekDisabled = useMemo(() => {
        return isSameWeek(displayedDate, systemToday, { weekStartsOn: 1, locale: dateLocale });
    }, [displayedDate, systemToday, dateLocale]);

    const calendarDisabledMatcher = useCallback((date: Date) => {
        return isAfter(date, systemToday) && !isSameDay(date, systemToday);
    }, [systemToday]);

    const handlePreviousWeek = () => setDisplayedDate(subWeeks(displayedDate, 1));
    const handleNextWeek = () => setDisplayedDate(addDays(displayedDate, 7));
    const handleGoToCurrentWeek = () => setDisplayedDate(new Date(systemToday));

    const handleDateSelectForJump = (date: Date | undefined) => {
        if (date) {
            if (isAfter(date, systemToday)) {
                setIsCalendarOpen(false); 
                return; 
            }
            setDisplayedDate(date);
            setIsCalendarOpen(false);
        }
    };
  
    return (
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
    );
};
