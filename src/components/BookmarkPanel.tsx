
"use client";

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Loader2 } from 'lucide-react';

export interface BookmarkWithTitle {
  page: number;
  title: string;
}

interface BookmarkPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkWithTitle[];
  isLoading: boolean;
  onGoToPage: (pageNumber: number) => void;
  onRemoveBookmark: (pageNumber: number) => void;
  translations: {
    title: string;
    loading: string;
    noBookmarks: string;
    pageLabel: string;
  };
}

export const BookmarkPanel: React.FC<BookmarkPanelProps> = ({
  isOpen,
  onClose,
  bookmarks,
  isLoading,
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
          {isLoading ? (
             <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="ml-2 text-sm text-muted-foreground">{translations.loading}</p>
             </div>
          ) : bookmarks.length > 0 ? (
            <ul className="space-y-2">
              {bookmarks.map(bookmark => (
                <li key={bookmark.page} className="flex items-center justify-between p-2 rounded-md hover:bg-accent group">
                  <button
                    onClick={() => {
                      onGoToPage(bookmark.page);
                      onClose();
                    }}
                    className="flex-grow text-left text-sm space-y-1"
                  >
                    <span className="font-semibold text-foreground/90">{`${translations.pageLabel} ${bookmark.page}`}</span>
                    <p className="text-xs text-muted-foreground truncate" title={bookmark.title}>{bookmark.title}</p>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                    onClick={() => onRemoveBookmark(bookmark.page)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center mt-8">{translations.noBookmarks}</p>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
