"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface EventRecordItem {
  id: string;
  title: string;
  steps: Array<{ order: number; title: string; detail?: string }>;
  timestamp?: string;
  completedAt?: string;
}

interface EventRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateKey: string, hourSlot: string, item: EventRecordItem) => void;
  onDelete?: (id: string) => void;
  dateKey: string;
  hourSlot: string;
  initialData?: EventRecordItem | null;
  translations: {
    modalTitleNew: string;
    modalTitleEdit: string;
    modalDescription: string;
    titleLabel: string;
    titlePlaceholder: string;
    stepTitleLabel: string;
    stepTitlePlaceholder: string;
    stepDetailLabel: string;
    stepDetailPlaceholder: string;
    stepStatusLabel: string;
    addStepButton: string;
    saveButton: string;
    updateButton: string;
    deleteButton: string;
    cancelButton: string;
  };
}

export const EventRecordModal: React.FC<EventRecordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  dateKey,
  hourSlot,
  initialData,
  translations,
}) => {
  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState<Array<{ order: number; title: string; detail?: string }>>([]);
  const [stepTitle, setStepTitle] = useState('');
  const [stepDetail, setStepDetail] = useState('');

  useEffect(() => {
      if (isOpen) {
        if (initialData) {
          setTitle(initialData.title);
          setSteps(initialData.steps || []);
          setStepTitle('');
          setStepDetail('');
        } else {
          setTitle('');
          setSteps([]);
          setStepTitle('');
          setStepDetail('');
        }
      }
  }, [isOpen, initialData]);

  const handleAddStep = () => {
    const t = stepTitle.trim();
    const d = stepDetail.trim();
    if (!t) return;
    const order = steps.length + 1;
    setSteps(prev => [...prev, { order, title: t, detail: d || null }]);
    setStepTitle('');
    setStepDetail('');
  };

  const handleDeleteStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 })));
  };


  const handleSave = () => {
    const data: EventRecordItem = {
      id: initialData?.id || Date.now().toString(),
      title: title.trim() || translations.modalTitleNew,
      steps,
      timestamp: initialData?.timestamp || new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    onSave(dateKey, hourSlot, data);
    onClose();
  };

  const handleDelete = () => {
    if (initialData?.id && onDelete) {
      onDelete(initialData.id);
    }
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-3 mb-4">
          <DialogTitle className="text-xl font-medium">
            {initialData ? translations.modalTitleEdit : translations.modalTitleNew}
          </DialogTitle>
          <DialogDescription>{translations.modalDescription}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="event-title" className="text-xs font-medium text-muted-foreground/80 mb-2 block">
              {translations.titleLabel}
            </Label>
            <Input id="event-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={translations.titlePlaceholder} />
          </div>
          <div>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <Label className="text-xs font-medium text-muted-foreground/80 mb-1 block">{translations.stepTitleLabel}</Label>
                <Input value={stepTitle} onChange={(e) => setStepTitle(e.target.value)} placeholder={translations.stepTitlePlaceholder} />
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground/80 mb-1 block">{translations.stepDetailLabel}</Label>
                <Textarea value={stepDetail} onChange={(e) => setStepDetail(e.target.value)} placeholder={translations.stepDetailPlaceholder} className="min-h-[72px]" />
              </div>
              <div>
                <Button onClick={handleAddStep}>{translations.addStepButton}</Button>
              </div>
            </div>
          </div>
          <ScrollArea className="max-h-[40vh] pr-2">
            <div className="space-y-2">
              {steps.map((s, i) => (
                <div key={i} className="p-2 border rounded-md">
                  <div className="text-sm font-medium">{s.order}. {s.title}</div>
                  {s.detail && <div className="text-sm whitespace-pre-wrap mt-1">{s.detail}</div>}
                  <div className="flex gap-2 mt-2">
                    <Button type="button" variant="ghost" onClick={() => handleDeleteStep(i)} className="text-red-600">删除步骤</Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="flex justify-between pt-4">
          <div>
            {initialData && onDelete && (
              <Button variant="ghost" onClick={handleDelete} className="text-red-600">
                {translations.deleteButton}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose}>{translations.cancelButton}</Button>
            </DialogClose>
            <Button onClick={handleSave}>{initialData ? translations.updateButton : translations.saveButton}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
