
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, ThumbsUp, ThumbsDown, Meh } from "lucide-react";

interface DayBoxProps {
  dayName: string;
  isSelected: boolean;
  onClick: () => void;
  hasNotes?: boolean;
  rating: 'excellent' | 'terrible' | 'average' | null;
  onRatingChange: (newRating: 'excellent' | 'terrible' | 'average' | null) => void;
}

const RATING_OPTIONS = [
  { type: 'excellent' as const, Icon: ThumbsUp, label: 'Excellent' },
  { type: 'average' as const, Icon: Meh, label: 'Average' },
  { type: 'terrible' as const, Icon: ThumbsDown, label: 'Terrible' },
];

export const DayBox: FC<DayBoxProps> = ({ dayName, isSelected, onClick, hasNotes, rating, onRatingChange }) => {
  return (
    <Card
      className={cn(
        "w-36 h-40 sm:w-40 sm:h-44 flex flex-col cursor-pointer transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105 rounded-xl border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isSelected ? "border-primary shadow-lg scale-105 bg-primary/10" : "border-transparent hover:border-accent/70 bg-card"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick()}}
      aria-pressed={isSelected}
      aria-label={`Select ${dayName}`}
    >
      <CardHeader className="p-2 pb-1 text-center">
        <CardTitle className="text-lg sm:text-xl font-medium text-foreground">{dayName}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex-grow flex items-center justify-center">
        {hasNotes && <FileText className="w-5 h-5 text-muted-foreground" aria-label="Has notes"/>}
      </CardContent>
      <CardFooter className="p-2 pt-1 mt-auto w-full">
        <div className="flex justify-around w-full">
          {RATING_OPTIONS.map(({ type, Icon, label }) => (
            <button
              key={type}
              onClick={(e) => {
                e.stopPropagation(); // Prevent DayBox onClick
                onRatingChange(rating === type ? null : type);
              }}
              className={cn(
                "p-1 rounded-full hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                rating === type ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={`Rate as ${label}`}
              aria-pressed={rating === type}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};
