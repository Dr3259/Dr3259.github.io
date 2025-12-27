
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Lightbulb, Settings, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { usePlannerStore } from '@/hooks/usePlannerStore';

export interface ReflectionItem {
  id: string;
  text: string;
  category?: string;
  timestamp?: string;
}

export interface ReflectionModalTranslations {
  modalTitleNew: string;
  modalTitleEdit: string;
  modalDescription: string;
  textLabel: string;
  textPlaceholder: string;
  categoryLabel: string;
  saveButton: string;
  updateButton: string;
  cancelButton: string;
  deleteButton: string;
}

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateKey: string, hourSlot: string, reflection: ReflectionItem) => void; // Changed dayName to dateKey
  onDelete?: (reflectionId: string) => void;
  dateKey: string; // YYYY-MM-DD
  hourSlot: string;
  initialData?: ReflectionItem | null;
  translations: ReflectionModalTranslations;
}

const MAX_REFLECTION_TEXT_LENGTH = 500;

const PRESET_COLORS = [
  '#fbbf24', '#f59e0b', '#d97706', '#92400e',
  '#ef4444', '#dc2626', '#b91c1c', '#991b1b',
  '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6',
  '#06b6d4', '#0891b2', '#0e7490', '#155e75',
  '#10b981', '#059669', '#047857', '#065f46',
  '#6b7280', '#4b5563', '#374151', '#1f2937'
];

const PRESET_EMOJIS = [
  '💡', '🤔', '📝', '⏰', '📌', '🎯', '🔥', '⭐',
  '💭', '🧠', '📚', '🎨', '🚀', '💎', '🌟', '⚡',
  '🎪', '🎭', '🎵', '🎬', '📱', '💻', '🔧', '🌈'
];

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  dateKey, // Changed from dayName
  hourSlot,
  initialData,
  translations,
}) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('idea');
  const [isManagingTags, setIsManagingTags] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagEmoji, setNewTagEmoji] = useState('💡');
  const [newTagColor, setNewTagColor] = useState('#fbbf24');
  
  const { customInspirationTags, addCustomInspirationTag, updateCustomInspirationTag, deleteCustomInspirationTag } = usePlannerStore();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setText(initialData.text);
        setCategory(initialData.category || customInspirationTags[0]?.id || 'idea');
      } else {
        setText('');
        setCategory(customInspirationTags[0]?.id || 'idea');
      }
      setIsManagingTags(false);
      setEditingTagId(null);
    }
  }, [isOpen, initialData, customInspirationTags]);

  const startEditTag = (tag: any) => {
    setEditingTagId(tag.id);
    setNewTagName(tag.name);
    setNewTagEmoji(tag.emoji);
    setNewTagColor(tag.color);
  };

  const startAddTag = () => {
    setEditingTagId('new');
    setNewTagName('');
    setNewTagEmoji('💡');
    setNewTagColor('#fbbf24');
  };

  const saveTag = () => {
    if (!newTagName.trim()) return;
    
    if (editingTagId === 'new') {
      addCustomInspirationTag({
        name: newTagName.trim(),
        emoji: newTagEmoji,
        color: newTagColor
      });
    } else if (editingTagId) {
      updateCustomInspirationTag(editingTagId, {
        name: newTagName.trim(),
        emoji: newTagEmoji,
        color: newTagColor
      });
    }
    
    setEditingTagId(null);
    setNewTagName('');
    setNewTagEmoji('💡');
    setNewTagColor('#fbbf24');
  };

  const cancelEditTag = () => {
    setEditingTagId(null);
    setNewTagName('');
    setNewTagEmoji('💡');
    setNewTagColor('#fbbf24');
  };

  const deleteTag = (tagId: string) => {
    deleteCustomInspirationTag(tagId);
    if (category === tagId) {
      setCategory(customInspirationTags[0]?.id || 'idea');
    }
  };

  const handleSaveOrUpdate = () => {
    if (text.trim() === '') {
        onClose(); 
        return;
    }

    const reflectionData: ReflectionItem = {
      id: initialData?.id || Date.now().toString(),
      text: text.trim(),
      category,
      timestamp: initialData?.timestamp || new Date().toISOString(),
    };
    onSave(dateKey, hourSlot, reflectionData); // Pass dateKey
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
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border border-green-200/20 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-t-lg"></div>
        
        <DialogHeader className="space-y-3 mb-6">
          <DialogTitle className="text-xl font-medium text-foreground flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-200/30 flex items-center justify-center backdrop-blur-sm">
              <Lightbulb className="w-6 h-6 text-green-600" />
            </div>
            {initialData ? translations.modalTitleEdit : translations.modalTitleNew}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 leading-relaxed">
            {translations.modalDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isManagingTags ? (
            // 主界面：记录反思
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="category-select" className="text-xs font-medium text-muted-foreground/80">
                    {translations.categoryLabel}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsManagingTags(true)}
                    className="text-xs h-6"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    管理标签
                  </Button>
                </div>
                <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                  <SelectTrigger id="category-select" className="border-2 border-border/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/15">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {customInspirationTags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        <div className="flex items-center gap-2">
                          <span>{tag.emoji}</span>
                          <span>{tag.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reflection-text" className="text-xs font-medium text-muted-foreground/80 mb-2 block">
                  {translations.textLabel}
                </Label>
                <Textarea
                  id="reflection-text"
                  value={text}
                  onChange={(e) => setText(e.target.value.substring(0, MAX_REFLECTION_TEXT_LENGTH))}
                  placeholder={translations.textPlaceholder}
                  className="min-h-[200px] text-base leading-relaxed resize-none border-2 border-border/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:outline-none focus:shadow-lg focus:shadow-green-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-500/15 focus-visible:ring-offset-0 transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md hover:border-green-400/60 hover:bg-background/70"
                  maxLength={MAX_REFLECTION_TEXT_LENGTH}
                  autoComplete="off"
                  style={{ 
                    boxShadow: 'none',
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                />
                <div className="flex justify-end mt-2">
                  <span className="text-xs text-muted-foreground/60">
                    {text.length} / {MAX_REFLECTION_TEXT_LENGTH}
                  </span>
                </div>
              </div>
            </>
          ) : (
            // 标签管理界面
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">管理标签</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsManagingTags(false)}
                  className="text-xs"
                >
                  返回
                </Button>
              </div>

              {/* 现有标签列表 */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {customInspirationTags.map((tag) => (
                  <div key={tag.id} className="flex items-center gap-2 p-2 border rounded-lg">
                    <span className="text-lg">{tag.emoji}</span>
                    <span className="flex-1 text-sm font-medium">{tag.name}</span>
                    <div 
                      className="w-3 h-3 rounded-full border" 
                      style={{ backgroundColor: tag.color }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditTag(tag)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTag(tag.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* 编辑/添加表单 */}
              {editingTagId && (
                <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
                  <Label className="text-sm font-medium">
                    {editingTagId === 'new' ? '添加新标签' : '编辑标签'}
                  </Label>
                  
                  <div>
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="标签名称"
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-xs mb-1 block">图标</Label>
                    <div className="grid grid-cols-6 gap-1">
                      {PRESET_EMOJIS.slice(0, 12).map((emoji, index) => (
                        <Button
                          key={`emoji-${index}`}
                          variant={newTagEmoji === emoji ? 'default' : 'outline'}
                          size="sm"
                          className="h-6 w-6 p-0 text-xs"
                          onClick={() => setNewTagEmoji(emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs mb-1 block">颜色</Label>
                    <div className="grid grid-cols-6 gap-1">
                      {PRESET_COLORS.slice(0, 12).map((color, index) => (
                        <Button
                          key={`color-${index}`}
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0 border-2"
                          style={{ 
                            backgroundColor: color,
                            borderColor: newTagColor === color ? '#000' : 'transparent'
                          }}
                          onClick={() => setNewTagColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveTag} size="sm">
                      <Check className="w-3 h-3 mr-1" />
                      保存
                    </Button>
                    <Button variant="outline" onClick={cancelEditTag} size="sm">
                      取消
                    </Button>
                  </div>
                </div>
              )}

              {/* 添加新标签按钮 */}
              {!editingTagId && (
                <Button onClick={startAddTag} className="w-full" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  添加新标签
                </Button>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center pt-6">
          <div>
            {initialData && onDelete && (
              <Button
                variant="ghost"
                onClick={handleDeleteClick}
                className="py-3 text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-200"
              >
                {translations.deleteButton}
              </Button>
            )}
          </div>
          <div className="flex space-x-3">
            <DialogClose asChild>
              <Button variant="outline" onClick={onClose} className="py-3 border-green-200/30 hover:bg-green-50/50 hover:border-green-300/50 transition-all duration-200">
                {translations.cancelButton}
              </Button>
            </DialogClose>
            <Button onClick={handleSaveOrUpdate} className="py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              {initialData ? translations.updateButton : translations.saveButton}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
