
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card"; // Removed CardHeader, CardTitle
import { ScrollArea } from "@/components/ui/scroll-area";

interface DayHoverPreviewProps {
  dayName: string; // Prop remains as it's passed by parent, altText depends on it
  notes: string;
  imageHint: string;
  altText: string;
}

export const DayHoverPreview: FC<DayHoverPreviewProps> = ({
  notes,
  imageHint,
  altText,
  // dayName is not directly rendered as a title in this component anymore
}) => {
  const imageUrl = `https://placehold.co/300x200.png`;

  return (
    <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80 sm:w-96 bg-card shadow-2xl border-2 border-primary/50">
      {/* CardHeader containing the CardTitle with dayName has been removed */}
      <CardContent className="p-4"> {/* Adjusted padding from "p-4 pt-0" to "p-4" */}
        <div className="mb-3">
          <Image
            src={imageUrl}
            alt={altText}
            width={300}
            height={200}
            className="rounded-md object-cover w-full"
            data-ai-hint={imageHint}
            priority // Preload image as it's a key part of the preview
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
