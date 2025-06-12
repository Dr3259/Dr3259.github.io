
"use client";

import React, { useState, FC } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Smile, Meh, Frown, CalendarPlus, Archive, Sun } from "lucide-react"; // Changed CalendarDays to Archive

type RatingValue = 'excellent' | 'terrible' | 'average';

interface DayBoxProps {
  dayName: string;
  onClick: () => void;
  notes: string;
  dayHasAnyData: boolean;
  rating: RatingValue | null;
  onRatingChange: (newRating: RatingValue | null) => void;
  isCurrentDay: boolean;
  isPastDay: boolean;
  isFutureDay: boolean;
  isAfter6PMToday: boolean;
  todayLabel: string;
  selectDayLabel: string;
  contentIndicatorLabel?: string;
  ratingUiLabels: {
    excellent: string;
    average: string;
    terrible: string;
  };
  onHoverStart: (data: { dayName: string; notes: string; imageHint: string }) => void;
  onHoverEnd: () => void;
  imageHint: string;
}

const RATING_ICONS: Record<RatingValue, LucideIcon> = {
  excellent: Smile,
  average: Meh,
  terrible: Frown,
};

const RATING_ORDER: RatingValue[] = ['excellent', 'average', 'terrible'];

export const DayBox: FC<DayBoxProps> = ({
  dayName,
  onClick,
  notes,
  dayHasAnyData,
  rating,
  onRatingChange,
  isCurrentDay,
  isPastDay,
  isFutureDay,
  isAfter6PMToday,
  todayLabel,
  selectDayLabel,
  contentIndicatorLabel,
  ratingUiLabels,
  onHoverStart,
  onHoverEnd,
  imageHint,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isDisabled = isPastDay && !dayHasAnyData;
  const ariaLabel = isCurrentDay ? `${todayLabel} - ${selectDayLabel}` : selectDayLabel;

  const handleCardClick = () => {
    // Already handled by conditional assignment below
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Already handled by conditional assignment below
    }
  };

  const handleCardMouseEnter = () => {
    setIsHovered(true);
    if (isPastDay && !isDisabled) {
      onHoverStart({ dayName, notes, imageHint });
    }
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
    if (isPastDay && !isDisabled) {
      onHoverEnd();
    }
  };

  const showRatingIcons =
    !isDisabled &&
    (isPastDay || (isCurrentDay && isAfter6PMToday)) &&
    !isFutureDay;

  const showContentDot = dayHasAnyData && !isDisabled;

  return (
    <Card
      className={cn(
        "w-36 h-44 sm:w-40 sm:h-48 flex flex-col rounded-xl border-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isDisabled
          ? "opacity-50 cursor-not-allowed bg-card border-transparent"
          : [
              "cursor-pointer bg-card",
              isHovered ? "border-accent/70 shadow-xl scale-105" : "border-transparent",
              isCurrentDay && !isDisabled && "ring-2 ring-offset-2 ring-offset-background ring-amber-500 dark:ring-amber-400"
            ]
      )}
      onClick={isDisabled ? undefined : onClick}
      onKeyDown={isDisabled ? undefined : (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      role={isDisabled ? undefined : "button"}
      tabIndex={isDisabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
    >
      <CardHeader className="p-2 pb-1 text-center">
        <CardTitle className="text-lg sm:text-xl font-medium text-foreground">{dayName}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-grow flex items-center justify-center">
        {showContentDot ? (
          <div className="w-2 h-2 rounded-full bg-primary" aria-label={contentIndicatorLabel}></div>
        ) : isDisabled ? (
          <Archive 
            className={cn(
              "w-12 h-12",
              "text-muted-foreground opacity-60" 
            )}
          />
        ) : (
          <CalendarPlus 
            className={cn(
              "w-12 h-12",
              "text-primary/80" 
            )}
          />
        )}
      </CardContent>
      {showRatingIcons && (
        <CardFooter className="p-2 pt-1 mt-auto w-full">
          <div className="flex justify-around w-full">
            {RATING_ORDER.map((type) => {
              const Icon = RATING_ICONS[type];
              const label = ratingUiLabels[type];
              return (
                <button
                  key={type}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRatingChange(rating === type ? null : type);
                  }}
                  className={cn(
                    "p-1 rounded-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    "hover:bg-accent/50",
                    rating === type ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label={label}
                  aria-pressed={rating === type}
                  disabled={isDisabled}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              );
            })}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
