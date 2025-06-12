
"use client";

import React, { useState, FC } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Smile, Meh, Frown, Sun } from "lucide-react";

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

  const ariaLabel = isCurrentDay ? `${todayLabel} - ${selectDayLabel}` : selectDayLabel;
  const isDisabled = (isPastDay && !dayHasAnyData);


  const handleCardClick = () => {
    if (isDisabled) return;
    onClick();
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (isDisabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
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

  const showContentDot = dayHasAnyData && !isFutureDay && !isDisabled && (isPastDay || isCurrentDay);

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
      onClick={handleCardClick}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={handleCardKeyDown}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
    >
      <CardHeader className="p-2 pb-1 text-center">
        <CardTitle className="text-lg sm:text-xl font-medium text-foreground">{dayName}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-grow flex items-center justify-center">
        {showContentDot ? (
          <div className="w-2 h-2 rounded-full bg-primary" aria-label={contentIndicatorLabel}></div>
        ) : (
          <Sun className={cn(
            "w-12 h-12", // Increased size
            isDisabled ? "text-muted-foreground opacity-60" : "text-yellow-400 opacity-80" // Adjusted opacity
          )} />
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
