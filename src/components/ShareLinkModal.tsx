
"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link2 } from 'lucide-react';

export interface ShareLinkItem {
  id: string;
  url: string;
  title: string;
  category: string | null;
}

export interface ShareLinkModalTranslations {
  modalTitleNew: string;
  modalTitleEdit: (titleOrUrl: string) => string;
  modalDescription: string;
  urlLabel: string;
  urlPlaceholder: string;
  titleLabel: string;
  titlePlaceholder: string;
  categoryLabel: string;
  categoryPlaceholder: string;
  saveButton: string;
  updateButton: string;
  cancelButton: string;
  deleteButton: string;
}

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateKey: string, hourSlot: string, link: ShareLinkItem) => void;
  onDelete?: (linkId: string) => void;
  dateKey: string;
  hourSlot: string;
  initialData?: ShareLinkItem | null;
  translations: ShareLinkModalTranslations;
}

const MAX_URL_LENGTH = 2048;
const MAX_LINK_TITLE_LENGTH = 50;
const MAX_CATEGORY_LENGTH = 15;

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  dateKey,
  hourSlot,
  initialData,
  translations,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setUrl(initialData.url);
        setTitle(initialData.title);
        setCategory(initialData.category || '');
      } else {
        setUrl('');
        setTitle('');
        setCategory('');
      }
    }
  }, [isOpen, initialData]);

  const handleSaveOrUpdate = () => {
    if (url.trim() === '') {
      return;
    }

    const linkData: ShareLinkItem = {
      id: initialData?.id || Date.now().toString(),
      url: url.trim(),
      title: title.trim(),
      category: category.trim() || null,
    };
    onSave(dateKey, hourSlot, linkData);
    onClose();
  };

  const handleDeleteClick = () => {
    if (initialData?.id && onDelete) {
      onDelete(initialData.id);
    }
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border border-blue-200/20 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-t-lg"></div>
        
        <DialogHeader className="mb-6 space-y-3">
          <DialogTitle className="text-xl font-medium text-foreground flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-200/30 flex items-center justify-center backdrop-blur-sm">
              <Link2 className="w-6 h-6 text-blue-600" />
            </div>
            {initialData ? translations.modalTitleEdit(initialData.title || initialData.url) : translations.modalTitleNew}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 leading-relaxed">
            {translations.modalDescription}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-5 p-2">
            <div>
              <Label htmlFor="share-link-url" className="text-xs font-medium text-muted-foreground/80 mb-2 block">
                {translations.urlLabel}
              </Label>
              <Input
                id="share-link-url"
                value={url}
                onChange={(e) => setUrl(e.target.value.substring(0, MAX_URL_LENGTH))}
                placeholder={translations.urlPlaceholder}
                className="h-12 text-base border-2 border-border/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:outline-none focus:shadow-lg focus:shadow-blue-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/15 focus-visible:ring-offset-0 transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl px-4 shadow-sm hover:shadow-md hover:border-blue-400/60 hover:bg-background/70"
                maxLength={MAX_URL_LENGTH}
                type="url"
                autoComplete="off"
                style={{ 
                  boxShadow: 'none',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
              />
            </div>

            <div>
              <Label htmlFor="share-link-title" className="text-xs font-medium text-muted-foreground/80 mb-2 block">
                {translations.titleLabel}
              </Label>
              <Input
                id="share-link-title"
                value={title}
                onChange={(e) => setTitle(e.target.value.substring(0, MAX_LINK_TITLE_LENGTH))}
                placeholder={translations.titlePlaceholder}
                className="h-12 text-base border-2 border-border/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:outline-none focus:shadow-lg focus:shadow-blue-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/15 focus-visible:ring-offset-0 transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl px-4 shadow-sm hover:shadow-md hover:border-blue-400/60 hover:bg-background/70"
                maxLength={MAX_LINK_TITLE_LENGTH}
                autoComplete="off"
                style={{ 
                  boxShadow: 'none',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
              />
            </div>

            <div>
              <Label htmlFor="share-link-category" className="text-xs font-medium text-muted-foreground/80 mb-2 block">
                {translations.categoryLabel}
              </Label>
              <Input
                id="share-link-category"
                value={category}
                onChange={(e) => setCategory(e.target.value.substring(0, MAX_CATEGORY_LENGTH))}
                placeholder={translations.categoryPlaceholder}
                className="h-12 text-base border-2 border-border/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:outline-none focus:shadow-lg focus:shadow-blue-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/15 focus-visible:ring-offset-0 transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl px-4 shadow-sm hover:shadow-md hover:border-blue-400/60 hover:bg-background/70"
                maxLength={MAX_CATEGORY_LENGTH}
                autoComplete="off"
                style={{ 
                  boxShadow: 'none',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
          {initialData && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              className="py-3 mt-2 sm:mt-0 sm:mr-auto bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {translations.deleteButton}
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} className="py-3 mt-2 sm:mt-0 border-blue-200/30 hover:bg-blue-50/50 hover:border-blue-300/50 transition-all duration-200">
                {translations.cancelButton}
            </Button>
          </DialogClose>
           <Button onClick={handleSaveOrUpdate} className="py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
            {initialData ? translations.updateButton : translations.saveButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
