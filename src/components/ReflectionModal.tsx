
"use client";

import React, { useState, useEffect, useRef } from 'react';
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb, Plus, Edit2, Trash2, Check } from 'lucide-react';
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
  
  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const value = text;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      if (e.shiftKey) {
        const hasIndent = value.slice(lineStart, lineStart + 2) === '  ';
        const newValue = hasIndent
          ? value.slice(0, lineStart) + value.slice(lineStart + 2)
          : value;
        setText(newValue.substring(0, MAX_REFLECTION_TEXT_LENGTH));
        setTimeout(() => {
          const delta = hasIndent ? -2 : 0;
          el.selectionStart = Math.max(start + delta, lineStart);
          el.selectionEnd = Math.max(end + delta, lineStart);
        }, 0);
      } else {
        const newValue = value.slice(0, lineStart) + '  ' + value.slice(lineStart);
        setText(newValue.substring(0, MAX_REFLECTION_TEXT_LENGTH));
        setTimeout(() => {
          el.selectionStart = start + 2;
          el.selectionEnd = end + 2;
        }, 0);
      }
    } else if (e.key === 'Enter') {
      if (e.shiftKey) return;
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const value = text;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineText = value.slice(lineStart, start);
      let prefix: string | null = null;
      if (/^\-\s/.test(lineText)) prefix = '- ';
      else {
        const m = lineText.match(/^(\d+)\.\s/);
        if (m) {
          const next = parseInt(m[1]) + 1;
          prefix = `${next}. `;
        }
      }
      if (!prefix) return;
      e.preventDefault();
      const newValue = value.slice(0, start) + '\n' + prefix + value.slice(end);
      setText(newValue.substring(0, MAX_REFLECTION_TEXT_LENGTH));
      closeSlashMenu();
      setTimeout(() => {
        const pos = start + 1 + prefix.length;
        el.selectionStart = pos;
        el.selectionEnd = pos;
      }, 0);
    } else if (e.key === ' ' || e.key === 'Spacebar') {
      const el = e.currentTarget;
      const pos = el.selectionStart;
      const value = text;
      const lineStart = value.lastIndexOf('\n', pos - 1) + 1;
      const lineText = value.slice(lineStart);
      const mOrdered = lineText.match(/^(\d+)\.\s/);
      const isUnordered = lineText.startsWith('- ');
      const prefixLen = isUnordered ? 2 : mOrdered ? (mOrdered[0].length) : 0;
      if (prefixLen > 0 && pos <= lineStart + prefixLen) {
        e.preventDefault();
        const newValue = value.slice(0, lineStart) + value.slice(lineStart + prefixLen);
        setText(newValue.substring(0, MAX_REFLECTION_TEXT_LENGTH));
        closeSlashMenu();
        setTimeout(() => {
          el.selectionStart = lineStart;
          el.selectionEnd = lineStart;
        }, 0);
      }
    } else if (e.key === '/') {
      e.preventDefault();
      setSlashOpen(prev => {
        const next = !prev;
        const ta = textAreaRef.current;
        const container = editorContainerRef.current;
        if (next && ta && container) {
          setCaretRange({ start: ta.selectionStart, end: ta.selectionEnd });
          const { caretLeft, caretTop, lineHeight } = getCaretCoordinates(ta);
          const taRect = ta.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const left = taRect.left - containerRect.left + caretLeft - ta.scrollLeft;
          const top = taRect.top - containerRect.top + caretTop - ta.scrollTop + lineHeight;
          setSlashPos({ top, left });
        } else {
          setSlashPos(null);
          setCaretRange(null);
        }
        return next;
      });
    } else {
      if (slashOpen && e.key.length === 1 && e.key !== '/' && !e.ctrlKey && !e.metaKey) {
        closeSlashMenu();
      }
    }
  };
  
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashPos, setSlashPos] = useState<{ top: number; left: number } | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const closeSlashMenu = () => { setSlashOpen(false); setSlashPos(null); };
  const handleTextInput = () => { if (slashOpen) closeSlashMenu(); };
  const handleCompositionStart = () => { if (slashOpen) closeSlashMenu(); };
  const [caretRange, setCaretRange] = useState<{ start: number; end: number } | null>(null);
  
  const getCaretCoordinates = (ta: HTMLTextAreaElement) => {
    const style = window.getComputedStyle(ta);
    const fontSize = style.fontSize || '16px';
    const fontFamily = style.fontFamily || 'sans-serif';
    const paddingLeft = parseFloat(style.paddingLeft || '0');
    const paddingTop = parseFloat(style.paddingTop || '0');
    const lineHeight = parseFloat(style.lineHeight || '0') || parseFloat(fontSize) * 1.4;
    const before = ta.value.substring(0, ta.selectionStart).replace(/\t/g, '  ');
    const lines = before.split('\n');
    const currentLine = lines[lines.length - 1];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = `${fontSize} ${fontFamily}`;
    }
    const textWidth = ctx ? ctx.measureText(currentLine).width : 0;
    const caretLeft = paddingLeft + textWidth;
    const caretTop = paddingTop + (lines.length - 1) * lineHeight;
    return { caretLeft, caretTop, lineHeight };
  };
  const applyBlock = (type: 'h1' | 'h2' | 'h3' | 'ul' | 'ol') => {
    const el = document.getElementById('reflection-text') as HTMLTextAreaElement | null;
    if (!el) return;
    el.focus();
    const range = caretRange ?? { start: el.selectionStart, end: el.selectionEnd };
    const start = range.start;
    const end = range.end;
    const value = text;
    const startLineStart = value.lastIndexOf('\n', start - 1) + 1;
    const endLineBreak = value.indexOf('\n', end);
    const endLineEnd = endLineBreak === -1 ? value.length : endLineBreak;
    const selected = value.slice(startLineStart, endLineEnd);
    const lines = selected.split('\n');
    const strip = (s: string) => s.replace(/^(\#\s|\#\#\s|\#\#\#\s|\-\s|\d+\.\s)/, '');
    const prefixFor = (s: string) => {
      const content = strip(s);
      if (type === 'h1') return `# ${content}`;
      if (type === 'h2') return `## ${content}`;
      if (type === 'h3') return `### ${content}`;
      if (type === 'ul') return `- ${content}`;
      if (type === 'ol') return `1. ${content}`;
      return content;
    };
    let newSelected = '';
    if (type === 'h1' || type === 'h2' || type === 'h3') {
      const first = lines[0] ?? '';
      const rest = lines.slice(1).join('\n');
      newSelected = prefixFor(first) + (rest ? `\n${rest}` : '');
    } else {
      newSelected = lines.map(prefixFor).join('\n');
    }
    const newValue = value.slice(0, startLineStart) + newSelected + value.slice(endLineEnd);
    setText(newValue.substring(0, MAX_REFLECTION_TEXT_LENGTH));
    setSlashOpen(false);
    setCaretRange(null);
    setTimeout(() => {
      const pos = startLineStart + newSelected.length;
      el.selectionStart = pos;
      el.selectionEnd = pos;
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border border-green-200/20 shadow-2xl">
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
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="category-select" className="text-xs font-medium text-muted-foreground/80">
                {translations.categoryLabel}
              </Label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-xs h-6" onClick={startAddTag}>
                  <Plus className="w-3 h-3 mr-1" />
                  添加标签
                </Button>
                {customInspirationTags.length > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => {
                    const t = customInspirationTags.find(x => x.id === category);
                    if (t) startEditTag(t as any);
                  }}>
                    <Edit2 className="w-3 h-3 mr-1" />
                    编辑当前
                  </Button>
                )}
              </div>
            </div>
            <ScrollArea className="max-h-36">
              <div className="flex flex-wrap gap-2">
                {customInspirationTags.map((tag) => {
                  const isSelected = category === tag.id;
                  return (
                    <Button
                      key={tag.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={"h-7 px-2 rounded-full text-xs font-medium w-auto inline-flex items-center"}
                      onClick={() => setCategory(tag.id)}
                    >
                      <span className="mr-1 text-sm">{tag.emoji}</span>
                      <span className="">{tag.name}</span>
                      <span
                        className="w-2 h-2 rounded-full ml-2"
                        style={{ backgroundColor: tag.color }}
                      />
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
            {editingTagId && (
              <div className="space-y-3 p-3 mt-3 border rounded-lg bg-muted/50">
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
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center ring-2" style={{ ringColor: newTagColor }}>
                      <span className="text-xl">{newTagEmoji}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">预览</span>
                  </div>
                  <div className="overflow-x-auto whitespace-nowrap py-1">
                    {PRESET_EMOJIS.slice(0, 18).map((emoji, index) => (
                      <button
                        key={`emoji-${index}`}
                        className={`inline-flex items-center justify-center w-7 h-7 mx-1 rounded-full text-base ${newTagEmoji === emoji ? 'border-2 border-green-500 bg-muted' : 'border border-muted-foreground/30 bg-transparent hover:bg-muted/40'} active:scale-95`}
                        onClick={() => setNewTagEmoji(emoji)}
                        type="button"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs mb-1 block">颜色</Label>
                  <div className="overflow-x-auto whitespace-nowrap py-1">
                    {PRESET_COLORS.slice(0, 18).map((color, index) => (
                      <button
                        key={`color-${index}`}
                        type="button"
                        className={`inline-flex items-center justify-center w-5 h-5 mx-1 rounded-full ${newTagColor === color ? 'outline outline-2 outline-green-500' : ''} active:scale-95`}
                        style={{ backgroundColor: color }}
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
                  {editingTagId !== 'new' && (
                    <Button variant="ghost" size="sm" onClick={() => deleteTag(editingTagId!)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-3 h-3 mr-1" />
                      删除
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {!editingTagId && (
            <div>
              <Label htmlFor="reflection-text" className="text-xs font-medium text-muted-foreground/80 mb-2 block">
                {translations.textLabel}
              </Label>
              <div ref={editorContainerRef} className="relative">
                {slashOpen && slashPos && (
                  <div className="absolute z-50 w-48 rounded-md border bg-background shadow-lg" style={{ top: slashPos.top, left: slashPos.left }}>
                    <div className="p-2 text-xs text-muted-foreground">选择块类型</div>
                    <div className="flex flex-col">
                      <Button variant="ghost" className="justify-start h-8" onMouseDown={(e) => { e.preventDefault(); applyBlock('h1'); }}>H1 标题</Button>
                      <Button variant="ghost" className="justify-start h-8" onMouseDown={(e) => { e.preventDefault(); applyBlock('h2'); }}>H2 标题</Button>
                      <Button variant="ghost" className="justify-start h-8" onMouseDown={(e) => { e.preventDefault(); applyBlock('h3'); }}>H3 标题</Button>
                      <Button variant="ghost" className="justify-start h-8" onMouseDown={(e) => { e.preventDefault(); applyBlock('ul'); }}>• 列表</Button>
                      <Button variant="ghost" className="justify-start h-8" onMouseDown={(e) => { e.preventDefault(); applyBlock('ol'); }}>1. 列表</Button>
                    </div>
                  </div>
                )}
              <Textarea
                id="reflection-text"
                value={text}
                onChange={(e) => setText(e.target.value.substring(0, MAX_REFLECTION_TEXT_LENGTH))}
                onKeyDown={handleTextKeyDown}
                onInput={handleTextInput}
                onCompositionStart={handleCompositionStart}
                onBlur={closeSlashMenu}
                ref={textAreaRef}
                placeholder={translations.textPlaceholder}
                className="min-h-[200px] text-base leading-relaxed resize-none border-2 border-border/50 focus:border-green-500 focus:outline-none transition-colors duration-150 bg-background/50 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-green-400/60"
                maxLength={MAX_REFLECTION_TEXT_LENGTH}
                autoComplete="off"
                style={{ boxShadow: 'none', outline: 'none', WebkitTapHighlightColor: 'transparent' }}
              />
              </div>
              <div className="flex justify-end mt-2">
                <span className="text-xs text-muted-foreground/60">
                  {text.length} / {MAX_REFLECTION_TEXT_LENGTH}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center pt-6">
          {!editingTagId ? (
            <>
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
            </>
          ) : (
            <div className="flex justify-end w-full">
              <Button variant="outline" onClick={cancelEditTag} className="py-3">
                完成
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
