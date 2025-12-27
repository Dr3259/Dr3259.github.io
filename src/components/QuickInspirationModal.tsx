"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Lightbulb, Save, X, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { usePlannerStore } from '@/hooks/usePlannerStore';

interface QuickInspirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { text: string; category: string; date: Date }) => void;
  translations: {
    title: string;
    placeholder: string;
    categoryLabel: string;
    saveButton: string;
    cancelButton: string;
  };
}

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

export function QuickInspirationModal({ 
  isOpen, 
  onClose, 
  onSave, 
  translations 
}: QuickInspirationModalProps) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('idea');
  const [isManagingTags, setIsManagingTags] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagEmoji, setNewTagEmoji] = useState('💡');
  const [newTagColor, setNewTagColor] = useState('#fbbf24');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { customInspirationTags, addCustomInspirationTag, updateCustomInspirationTag, deleteCustomInspirationTag } = usePlannerStore();

  useEffect(() => {
    if (isOpen) {
      setText('');
      setCategory(customInspirationTags[0]?.id || 'idea');
      setIsManagingTags(false);
      setEditingTagId(null);
      // 延迟聚焦，确保模态框完全打开
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, customInspirationTags]);

  const handleSave = () => {
    if (!text.trim()) return;
    
    onSave({
      text: text.trim(),
      category,
      date: new Date()
    });
    
    setText('');
    setCategory(customInspirationTags[0]?.id || 'idea');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            {translations.title}
          </DialogTitle>
        </DialogHeader>
        
        {!isManagingTags ? (
          // 主界面：记录灵感
          <div className="space-y-4">
            <div>
              <Label htmlFor="inspiration-text" className="sr-only">
                {translations.placeholder}
              </Label>
              <Textarea
                ref={textareaRef}
                id="inspiration-text"
                placeholder={translations.placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[120px] resize-none"
                autoFocus
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">
                  {translations.categoryLabel}
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsManagingTags(true)}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  管理标签
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {customInspirationTags.map((tag) => (
                  <Button
                    key={tag.id}
                    type="button"
                    variant={category === tag.id ? 'default' : 'outline'}
                    className="h-auto p-2 flex flex-col items-center gap-0.5"
                    style={{
                      backgroundColor: category === tag.id ? tag.color : 'transparent',
                      borderColor: tag.color,
                      color: category === tag.id ? '#fff' : 'inherit'
                    }}
                    onClick={() => setCategory(tag.id)}
                  >
                    <span className="text-sm">{tag.emoji}</span>
                    <span className="text-xs">{tag.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                <X className="w-4 h-4 mr-2" />
                {translations.cancelButton}
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!text.trim()}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {translations.saveButton}
              </Button>
            </div>
          </div>
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
        
        <div className="text-xs text-muted-foreground text-center mt-2">
          Ctrl/Cmd + Enter 保存 • Esc 取消
        </div>
      </DialogContent>
    </Dialog>
  );
}