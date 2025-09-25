// 创建歌单的模态框组件
"use client";

import React, { useState, useMemo, memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { playlistTemplates, templateCategories, type PlaylistTemplate } from "@/lib/playlist-templates";
import { Sparkles, Plus, ArrowLeft } from "lucide-react";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, description?: string) => Promise<void>;
}

// 模板卡片组件 - 使用 memo 优化
const TemplateCard = memo(({ 
  template, 
  onSelect 
}: { 
  template: PlaylistTemplate; 
  onSelect: (template: PlaylistTemplate) => void;
}) => (
  <div
    onClick={() => onSelect(template)}
    className="p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-md group bg-card hover:bg-accent/50 border-border/50 hover:border-border/80"
  >
    <div className="flex items-start gap-3 mb-3">
      <div className="text-2xl">{template.icon}</div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm leading-tight mb-1 group-hover:text-primary transition-colors">
          {template.name}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {template.description}
        </p>
      </div>
    </div>
    <div className="flex flex-wrap gap-1">
      {template.tags.slice(0, 3).map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="text-xs px-2 py-0.5"
        >
          {tag}
        </Badge>
      ))}
      {template.tags.length > 3 && (
        <Badge
          variant="secondary"
          className="text-xs px-2 py-0.5"
        >
          +{template.tags.length - 3}
        </Badge>
      )}
    </div>
  </div>
));

TemplateCard.displayName = 'TemplateCard';

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = memo(({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [mode, setMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<PlaylistTemplate | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleTemplateSelect = (template: PlaylistTemplate) => {
    setSelectedTemplate(template);
    setName(template.name);
    setDescription(template.description);
    setMode('custom');
  };

  // 按分类缓存模板数据
  const templatesByCategory = useMemo(() => {
    return templateCategories.reduce((acc, category) => {
      acc[category.id] = playlistTemplates.filter(template => template.category === category.id);
      return acc;
    }, {} as Record<string, PlaylistTemplate[]>);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      await onConfirm(name.trim(), description.trim() || undefined);
      // 成功后立即关闭，不等待状态重置
      onClose();
      // 延迟重置状态
      setTimeout(() => {
        setMode('template');
        setSelectedTemplate(null);
        setName('');
        setDescription('');
        setIsCreating(false);
      }, 150);
    } catch (error) {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      // 立即关闭弹窗，延迟重置状态以避免卡顿
      onClose();
      
      // 使用 setTimeout 延迟重置状态，让关闭动画先执行
      setTimeout(() => {
        setMode('template');
        setSelectedTemplate(null);
        setName('');
        setDescription('');
      }, 150); // 等待关闭动画完成
    }
  };

  const handleBackToTemplates = () => {
    // 优化状态更新，减少重渲染
    setMode('template');
    setTimeout(() => {
      setSelectedTemplate(null);
      setName('');
      setDescription('');
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "bg-background border shadow-lg",
        mode === 'template' ? "sm:max-w-4xl" : "sm:max-w-lg"
      )}>
        <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-lg"></div>
        
        <DialogHeader className="mb-6 space-y-3">
          <DialogTitle className="text-xl font-medium text-foreground flex items-center gap-3">
            {mode === 'custom' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToTemplates}
                className="h-8 w-8 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              {mode === 'template' ? (
                <Sparkles className="w-6 h-6 text-primary" />
              ) : (
                <Plus className="w-6 h-6 text-primary" />
              )}
            </div>
            {mode === 'template' ? '选择歌单模板' : '创建新歌单'}
          </DialogTitle>
        </DialogHeader>

        {mode === 'template' ? (
          <div className="space-y-6">
            <Tabs defaultValue="mood" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                {templateCategories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {templateCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <ScrollArea className="h-96">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                      {templatesByCategory[category.id]?.map((template) => (
                        <TemplateCard
                          key={template.id}
                          template={template}
                          onSelect={handleTemplateSelect}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-between items-center pt-4 border-t border-border/50">
              <Button
                variant="ghost"
                onClick={() => setMode('custom')}
                className="text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                自定义创建
              </Button>
              <Button
                variant="ghost"
                onClick={handleClose}
                disabled={isCreating}
              >
                取消
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {selectedTemplate && (
              <div className="p-4 rounded-xl border bg-muted/50">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{selectedTemplate.icon}</span>
                  <span className="text-sm font-medium text-primary">
                    基于模板: {selectedTemplate.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedTemplate.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playlist-name" className="text-xs font-medium text-muted-foreground/80">
                  歌单名称
                </Label>
                <Input
                  id="playlist-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入歌单名称"
                  disabled={isCreating}
                  className="h-11"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="playlist-description" className="text-xs font-medium text-muted-foreground/80">
                  描述（可选）
                </Label>
                <Textarea
                  id="playlist-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="为这个歌单添加一些描述"
                  disabled={isCreating}
                  className="min-h-[80px] resize-none"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter className="flex items-center justify-between pt-6 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isCreating}
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || isCreating}
              >
                {isCreating ? '创建中...' : '创建歌单'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
});

CreatePlaylistModal.displayName = 'CreatePlaylistModal';