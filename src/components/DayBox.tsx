
"use client";

import React, { useState, FC } from 'react'; // Added React and useState
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, Meh } from "lucide-react";

type RatingValue = 'excellent' | 'terrible' | 'average';

interface DayBoxProps {
  dayName: string;
  isSelected: boolean;
  onClick: () => void;
  notes: string;
  onNotesChange: (newNote: string) => void;
  hasNotes?: boolean;
  rating: RatingValue | null;
  onRatingChange: (newRating: RatingValue | null) => void;
  isCurrentDay: boolean;
  isPastDay: boolean;
  todayLabel: string;
  selectDayLabel: string;
  hasNotesLabel?: string;
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
  excellent: ThumbsUp,
  average: Meh,
  terrible: ThumbsDown,
};

const RATING_ORDER: RatingValue[] = ['excellent', 'average', 'terrible'];

export const DayBox: FC<DayBoxProps> = ({
  dayName,
  isSelected,
  onClick,
  notes,
  onNotesChange,
  rating,
  onRatingChange,
  isCurrentDay,
  isPastDay,
  todayLabel,
  selectDayLabel,
  hasNotesLabel,
  ratingUiLabels,
  onHoverStart,
  onHoverEnd,
  imageHint,
}) => {
  const [isHovered, setIsHovered] = useState(false); // Internal hover state

  const ariaLabel = isCurrentDay ? `${todayLabel} - ${selectDayLabel}` : selectDayLabel;
  const showNotesIndicator = !!notes.trim();

  const isDisabled = isPastDay && !showNotesIndicator && !rating && !isSelected;

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

  const showBlueHighlight = isSelected && isHovered && !isDisabled;

  return (
    <Card
      className={cn(
        "w-36 h-44 sm:w-40 sm:h-48 flex flex-col rounded-xl border-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isDisabled
          ? "opacity-50 cursor-not-allowed bg-card border-transparent"
          : [
              "cursor-pointer",
              showBlueHighlight
                ? "border-primary shadow-lg scale-105 bg-primary/10" // Blue highlight: Selected AND Hovered
                : [ // Not blue highlighted (either unselected, OR selected but not hovered)
                    "border-transparent bg-card", // Default appearance
                    !isSelected && "hover:border-accent/70 hover:shadow-xl hover:scale-105", // General hover for non-selected
                  ],
              // Amber ring for current day, if not blue highlighted
              isCurrentDay && !isDisabled && !showBlueHighlight && "ring-2 ring-offset-1 ring-offset-background ring-amber-500 dark:ring-amber-400"
            ]
      )}
      onClick={handleCardClick}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={handleCardKeyDown}
      aria-pressed={isSelected}
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
    >
      <CardHeader className="p-2 pb-1 text-center">
        <CardTitle className="text-lg sm:text-xl font-medium text-foreground">{dayName}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-grow flex items-center justify-center">
        {isSelected && !isDisabled ? (
           <Textarea
            value={notes}
            onChange={(e) => {
              e.stopPropagation();
              onNotesChange(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder={ratingUiLabels.average} // Note: This placeholder might be better as a generic "notes" placeholder
            className="flex-grow bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary text-sm rounded-md w-full resize-none p-1 h-full"
            aria-label={`${dayName} ${hasNotesLabel || 'notes'}`}
          />
        ) : (
          showNotesIndicator && <div className="w-2 h-2 rounded-full bg-primary" aria-label={hasNotesLabel}></div>
        )}
      </CardContent>
      {!isDisabled && (
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
                  disabled={isDisabled} // This check might be redundant if CardFooter is not rendered when isDisabled
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
