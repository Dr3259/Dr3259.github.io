
"use client";

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from 'lucide-react';

interface BookmarkPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: number[];
  onGoToPage: (pageNumber: number) => void;
  onRemoveBookmark: (pageNumber: number) => void;
  translations: {
    title: string;
  };
}

export const BookmarkPanel: React.FC<BookmarkPanelProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onGoToPage,
  onRemoveBookmark,
  translations,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{translations.title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-4rem)] mt-4">
          {bookmarks.length > 0 ? (
            <ul className="space-y-2">
              {bookmarks.map(page => (
                <li key={page} className="flex items-center justify-between p-2 rounded-md hover:bg-accent group">
                  <button
                    onClick={() => {
                      onGoToPage(page);
                      onClose();
                    }}
                    className="flex-grow text-left text-sm"
                  >
                    Page {page}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                    onClick={() => onRemoveBookmark(page)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center mt-8">No bookmarks added yet.</p>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
