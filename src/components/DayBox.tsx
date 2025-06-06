import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface DayBoxProps {
  dayName: string;
  isSelected: boolean;
  onClick: () => void;
  hasNotes?: boolean;
}

export const DayBox: FC<DayBoxProps> = ({ dayName, isSelected, onClick, hasNotes }) => {
  return (
    <Card
      className={cn(
        "w-36 h-36 sm:w-40 sm:h-40 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105 rounded-xl border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
        {hasNotes && <FileText className="w-5 h-5 text-muted-foreground" />}
      </CardContent>
    </Card>
  );
};
