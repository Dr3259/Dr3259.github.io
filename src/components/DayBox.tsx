
import type { FC } from 'react';
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
  hasNotes?: boolean; // This prop might be redundant if we always check notes.trim()
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
}) => {
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

  return (
    <Card
      className={cn(
        "w-36 h-44 sm:w-40 sm:h-48 flex flex-col rounded-xl border-2 transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", // Base structural and focus styles
        isDisabled
          ? "opacity-50 cursor-not-allowed bg-card border-transparent" // Disabled state
          : [ // Enabled states
              "cursor-pointer",
              isSelected
                ? "border-primary shadow-lg scale-105 bg-primary/10" // Selected (and enabled)
                : "border-transparent bg-card hover:border-accent/70 hover:shadow-xl hover:scale-105", // Not selected (and enabled)
            ],
        isCurrentDay && !isDisabled && "ring-2 ring-offset-1 ring-offset-background ring-amber-500 dark:ring-amber-400" // Current day ring for enabled states
      )}
      onClick={handleCardClick}
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
            placeholder={ratingUiLabels.average} // Consider changing this placeholder to something like "Add notes..."
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
                  // No need for 'disabled={isDisabled}' here as the parent CardFooter is conditionally rendered
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
