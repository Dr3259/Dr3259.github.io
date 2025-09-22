// 创建歌单的模态框组件
"use client";

import React, { useState } from 'react';
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

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      await onConfirm(name.trim(), description.trim() || undefined);
      handleClose();
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setMode('template');
      setSelectedTemplate(null);
      setName('');
      setDescription('');
      onClose();
    }
  };

  const handleBackToTemplates = () => {
    setMode('template');
    setSelectedTemplate(null);
    setName('');
    setDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border border-purple-200/20 shadow-2xl",
        mode === 'template' ? "sm:max-w-4xl" : "sm:max-w-lg"
      )}>
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-violet-600 rounded-t-lg"></div>
        
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-200/30 flex items-center justify-center backdrop-blur-sm">
              {mode === 'template' ? (
                <Sparkles className="w-6 h-6 text-purple-600" />
              ) : (
                <Plus className="w-6 h-6 text-purple-600" />
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
                      {playlistTemplates
                        .filter(template => template.category === category.id)
                        .map((template) => (
                          <div
                            key={template.id}
                            onClick={() => handleTemplateSelect(template)}
                            className={cn(
                              "p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group",
                              `bg-gradient-to-br ${template.gradient} bg-opacity-10 hover:bg-opacity-20`,
                              "border-border/50 hover:border-purple-300/50"
                            )}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="text-2xl">{template.icon}</div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm leading-tight mb-1 group-hover:text-purple-600 transition-colors">
                                  {template.name}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed overflow-hidden" style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}>
                                  {template.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {template.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs px-2 py-0.5 bg-background/50 text-muted-foreground border-0"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {template.tags.length > 3 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-2 py-0.5 bg-background/50 text-muted-foreground border-0"
                                >
                                  +{template.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
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
              <div className={cn(
                "p-4 rounded-xl border bg-gradient-to-br bg-opacity-10",
                `${selectedTemplate.gradient}`,
                "border-purple-200/30"
              )}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{selectedTemplate.icon}</span>
                  <span className="text-sm font-medium text-purple-600">
                    基于模板: {selectedTemplate.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedTemplate.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-0.5 bg-background/50 text-muted-foreground border-0"
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
                  className="h-11 text-base border-2 border-border/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 focus:outline-none focus:shadow-lg focus:shadow-purple-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/15 focus-visible:ring-offset-0 transition-all duration-300 bg-background/50 backdrop-blur-sm rounded-xl hover:shadow-md hover:border-purple-400/60 hover:bg-background/70"
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
                  className="min-h-[80px] text-base border-2 border-border/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 focus:outline-none focus:shadow-lg focus:shadow-purple-500/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/15 focus-visible:ring-offset-0 transition-all duration-300 bg-background/50 backdrop-blur-sm rounded-xl hover:shadow-md hover:border-purple-400/60 hover:bg-background/70 resize-none"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter className="flex items-center justify-between pt-6 border-t border-border/50">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isCreating}
                className="h-11 px-6 text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border/50 hover:border-border/70 transition-all duration-300 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md"
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || isCreating}
                className="h-11 px-8 bg-gradient-to-r from-purple-500 via-purple-600 to-violet-500 hover:from-purple-600 hover:via-purple-700 hover:to-violet-600 text-white font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 rounded-xl border-0 focus:ring-4 focus:ring-purple-500/20"
              >
                {isCreating ? '创建中...' : '创建歌单'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};