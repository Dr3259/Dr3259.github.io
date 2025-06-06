
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DayHoverPreviewProps {
  dayName: string; 
  notes: string;
  imageHint: string;
  altText: string;
  onMouseEnterPreview?: () => void;
  onMouseLeavePreview?: () => void;
}

export const DayHoverPreview: FC<DayHoverPreviewProps> = ({
  notes,
  imageHint,
  altText,
  onMouseEnterPreview,
  onMouseLeavePreview,
}) => {
  const imageUrl = `https://placehold.co/420x280.png`;

  return (
    <Card 
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[460px] bg-card shadow-2xl border-2 border-primary/50"
      onMouseEnter={onMouseEnterPreview}
      onMouseLeave={onMouseLeavePreview}
    >
      <CardContent className="p-4">
        <div className="mb-3">
          <Image
            src={imageUrl}
            alt={altText}
            width={420}
            height={280}
            className="rounded-md object-cover w-full border border-border/50"
            data-ai-hint={imageHint}
            priority 
          />
        </div>
        {notes ? (
          <ScrollArea className="h-24 w-full rounded-md border p-2 bg-background/50">
            <p className="text-sm text-foreground whitespace-pre-wrap">{notes}</p>
          </ScrollArea>
        ) : (
          <p className="text-sm text-muted-foreground italic">No notes for this day.</p>
        )}
      </CardContent>
    </Card>
  );
};

