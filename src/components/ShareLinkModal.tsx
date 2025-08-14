
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
      <DialogContent className="sm:max-w-lg bg-card p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            {initialData ? translations.modalTitleEdit(initialData.title || initialData.url) : translations.modalTitleNew}
          </DialogTitle>
          <DialogDescription>
            {translations.modalDescription}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 p-2">
            <div>
              <Label htmlFor="share-link-url" className="text-xs font-medium text-muted-foreground mb-1 block">
                {translations.urlLabel}
              </Label>
              <Input
                id="share-link-url"
                value={url}
                onChange={(e) => setUrl(e.target.value.substring(0, MAX_URL_LENGTH))}
                placeholder={translations.urlPlaceholder}
                className="bg-background text-base py-2.5"
                maxLength={MAX_URL_LENGTH}
                type="url"
              />
            </div>

            <div>
              <Label htmlFor="share-link-title" className="text-xs font-medium text-muted-foreground mb-1 block">
                {translations.titleLabel}
              </Label>
              <Input
                id="share-link-title"
                value={title}
                onChange={(e) => setTitle(e.target.value.substring(0, MAX_LINK_TITLE_LENGTH))}
                placeholder={translations.titlePlaceholder}
                className="bg-background text-base py-2.5"
                maxLength={MAX_LINK_TITLE_LENGTH}
              />
            </div>

            <div>
              <Label htmlFor="share-link-category" className="text-xs font-medium text-muted-foreground mb-1 block">
                {translations.categoryLabel}
              </Label>
              <Input
                id="share-link-category"
                value={category}
                onChange={(e) => setCategory(e.target.value.substring(0, MAX_CATEGORY_LENGTH))}
                placeholder={translations.categoryPlaceholder}
                className="bg-background text-base py-2.5"
                maxLength={MAX_CATEGORY_LENGTH}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          {initialData && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              className="py-2.5 mt-2 sm:mt-0 sm:mr-auto"
            >
              {translations.deleteButton}
            </Button>
          )}
           <Button onClick={handleSaveOrUpdate} className="py-2.5">
            {initialData ? translations.updateButton : translations.saveButton}
          </Button>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose} className="py-2.5 mt-2 sm:mt-0">
                {translations.cancelButton}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
