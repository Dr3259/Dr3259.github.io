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
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromBlob } from '@/lib/ocr';
import { usePlannerStore } from '@/hooks/usePlannerStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface DraftItem {
  id: string;
  content: string;
  images?: string[];
  timestamp?: string;
}

export interface DraftModalTranslations {
  modalTitleNew: string;
  modalTitleEdit: string;
  modalDescription: string;
  contentLabel: string;
  contentPlaceholder: string;
  saveButton: string;
  updateButton: string;
  cancelButton: string;
  deleteButton: string;
}

interface DraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateKey: string, hourSlot: string, draft: DraftItem) => void;
  onDelete?: (draftId: string) => void;
  dateKey: string;
  hourSlot: string;
  initialData?: DraftItem | null;
  translations: DraftModalTranslations;
}

const MAX_DRAFT_LENGTH = 2000;

export const DraftModal: React.FC<DraftModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  dateKey,
  hourSlot,
  initialData,
  translations,
}) => {
  const [content, setContent] = useState('');
  const { toast } = useToast();
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [audios, setAudios] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const recognitionRef = React.useRef<any>(null);
  const { addShareLink, addTodo, addReflection } = usePlannerStore();
  const isZh = typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setContent(initialData.content);
        setImages(initialData.images || []);
        setAudios(initialData.audios || []);
      } else {
        setContent('');
        setImages([]);
        setAudios([]);
      }
    }
  }, [isOpen, initialData]);

  const handleSaveOrUpdate = () => {
    if (content.trim() === '') {
        onClose(); 
        return;
    }

    const draftData: DraftItem = {
      id: initialData?.id || Date.now().toString(),
      content: content.trim(),
      images,
      audios,
      timestamp: initialData?.timestamp || new Date().toISOString(),
    };
    onSave(dateKey, hourSlot, draftData);
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
  
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    try {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (!file) continue;
          e.preventDefault();
          const reader = new FileReader();
          reader.onload = () => {
            const url = String(reader.result || '');
            if (url) {
              setImages(prev => [...prev, url]);
              const msg = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? '图片已添加' : 'Image added';
              toast({ title: msg, duration: 2000 });
            }
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    } catch {
      const errMsg = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? '图片添加失败' : 'Image add failed';
      toast({ title: errMsg, variant: 'destructive', duration: 3000 });
    }
  };
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const added: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = () => {
          const url = String(reader.result || '');
          if (url) added.push(url);
          resolve();
        };
        reader.readAsDataURL(f);
      });
    }
    if (added.length > 0) {
      setImages(prev => [...prev, ...added]);
      const msg = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? '图片已添加' : 'Images added';
      toast({ title: msg, duration: 2000 });
    }
    e.currentTarget.value = '';
  };
  
  const dataUrlToBlob = (dataUrl: string): Blob => {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };
  
  const handleOcrFromImage = async (url: string) => {
    try {
      setIsOcrLoading(true);
      const lang = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? 'chi_sim' : 'eng';
      const startMsg = lang === 'chi_sim' ? '正在识别图片文字...' : 'Extracting text from image...';
      toast({ title: startMsg, duration: 2000 });
      const blob = dataUrlToBlob(url);
      const text = await extractTextFromBlob(blob, lang);
      const resultMsg = lang === 'chi_sim' ? '识别完成' : 'Extraction complete';
      setContent(prev => (prev ? `${prev}\n${text}` : text).substring(0, MAX_DRAFT_LENGTH));
      toast({ title: resultMsg, duration: 2000 });
    } catch {
      const errMsg = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? '图片识别失败' : 'Image OCR failed';
      toast({ title: errMsg, variant: 'destructive', duration: 3000 });
    } finally {
      setIsOcrLoading(false);
    }
  };
  
  const handleRemoveImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };
  
  const extractUrls = (text: string): string[] => {
    const regex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(regex) || [];
    return Array.from(new Set(matches));
  };
  
  const handleExtractLinksToSlot = () => {
    const urls = extractUrls(content);
    if (urls.length === 0) {
      const msg = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? '未发现链接' : 'No links found';
      toast({ title: msg, duration: 2000 });
      return;
    }
    urls.forEach(url => {
      addShareLink(dateKey, hourSlot, { id: Date.now().toString(), url, title: url, category: null });
    });
    const msg = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? '链接已保存到当前时段' : 'Links saved to current slot';
    toast({ title: msg, duration: 2000 });
  };
  
  const handleConvertToTodo = () => {
    const text = content.trim();
    if (!text) return;
    addTodo(dateKey, hourSlot, { text, completed: false, category: null, deadline: null, importance: null });
    const msg = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? '已转换为待办' : 'Converted to to-do';
    toast({ title: msg, duration: 2000 });
  };
  
  const handleConvertToReflection = () => {
    const text = content.trim();
    if (!text) return;
    addReflection(dateKey, hourSlot, { text, category: '', timestamp: new Date().toISOString() });
    const msg = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? '已转换为灵感' : 'Converted to reflection';
    toast({ title: msg, duration: 2000 });
  };
  
  const handleOcrAllImages = async () => {
    if (images.length === 0) return;
    try {
      setIsOcrLoading(true);
      const lang = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? 'chi_sim' : 'eng';
      const startMsg = lang === 'chi_sim' ? '正在识别全部图片...' : 'Extracting all images...';
      toast({ title: startMsg, duration: 2000 });
      const texts: string[] = [];
      for (const url of images) {
        const blob = dataUrlToBlob(url);
        const text = await extractTextFromBlob(blob, lang);
        if (text) texts.push(text);
      }
      const merged = texts.join('\n').trim();
      if (merged) {
        setContent(prev => (prev ? `${prev}\n${merged}` : merged).substring(0, MAX_DRAFT_LENGTH));
      }
      const resultMsg = lang === 'chi_sim' ? '识别完成' : 'Extraction complete';
      toast({ title: resultMsg, duration: 2000 });
    } catch {
      const errMsg = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? '图片识别失败' : 'Image OCR failed';
      toast({ title: errMsg, variant: 'destructive', duration: 3000 });
    } finally {
      setIsOcrLoading(false);
    }
  };
  
  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          const url = String(reader.result || '');
          if (url) setAudios(prev => [...prev, url]);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setIsRecording(true);
      const msg = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? '开始录音' : 'Recording started';
      toast({ title: msg, duration: 1500 });
    } catch {
      const msg = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? '无法访问麦克风' : 'Microphone unavailable';
      toast({ title: msg, variant: 'destructive', duration: 3000 });
    }
  };
  
  const stopRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    const msg = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? '录音已保存' : 'Recording saved';
    toast({ title: msg, duration: 1500 });
  };
  
  const startListening = () => {
    if (isListening) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      const msg = (typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh')) ? '当前浏览器不支持语音识别' : 'Speech recognition not supported';
      toast({ title: msg, variant: 'destructive', duration: 3000 });
      return;
    }
    const recog = new SR();
    const isZh = typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh');
    recog.lang = isZh ? 'zh-CN' : 'en-US';
    recog.continuous = true;
    recog.interimResults = true;
    recog.onresult = (e: any) => {
      let finalText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) finalText += res[0].transcript;
      }
      if (finalText) setContent(prev => (prev ? `${prev}\n${finalText}` : finalText).substring(0, MAX_DRAFT_LENGTH));
    };
    recog.onend = () => {
      if (isListening) recog.start();
    };
    recognitionRef.current = recog;
    recog.start();
    setIsListening(true);
    const msg = isZh ? '开始语音输入' : 'Voice input started';
    toast({ title: msg, duration: 1500 });
  };
  
  const stopListening = () => {
    if (!isListening || !recognitionRef.current) return;
    recognitionRef.current.onend = null;
    recognitionRef.current.stop();
    setIsListening(false);
    const isZh = typeof document !== 'undefined' && document.documentElement.lang?.toLowerCase().startsWith('zh');
    const msg = isZh ? '语音输入已停止' : 'Voice input stopped';
    toast({ title: msg, duration: 1500 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border border-amber-800/20 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-t-lg"></div>
        
        <DialogHeader className="space-y-3 mb-6">
          <DialogTitle className="text-xl font-medium text-foreground flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-700/20 to-amber-800/20 border border-amber-700/30 flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-6 h-6 text-amber-800" />
            </div>
            {initialData ? translations.modalTitleEdit : translations.modalTitleNew}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80 leading-relaxed">
            {translations.modalDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">{isZh ? '内容' : 'Content'}</TabsTrigger>
              <TabsTrigger value="images">{isZh ? '图片' : 'Images'}</TabsTrigger>
              <TabsTrigger value="audio">{isZh ? '音频' : 'Audio'}</TabsTrigger>
              <TabsTrigger value="actions">{isZh ? '动作' : 'Actions'}</TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <Label htmlFor="draft-content" className="text-xs font-medium text-muted-foreground/80 mb-2 block">
                {translations.contentLabel}
              </Label>
              <Textarea
                id="draft-content"
                value={content}
                onChange={(e) => setContent(e.target.value.substring(0, MAX_DRAFT_LENGTH))}
                onPaste={handlePaste}
                placeholder={translations.contentPlaceholder}
                className="min-h-[300px] text-base leading-relaxed resize-none border-2 border-border/50 focus:border-amber-700 focus:ring-4 focus:ring-amber-700/15 focus:outline-none focus:shadow-lg transition-all duration-500 bg-background/50 backdrop-blur-sm rounded-xl p-4 shadow-sm"
                maxLength={MAX_DRAFT_LENGTH}
                autoComplete="off"
                style={{ boxShadow: 'none', outline: 'none', WebkitTapHighlightColor: 'transparent' }}
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground/60">
                  {isZh ? '粘贴图片或链接，或直接输入内容' : 'Paste images or links, or type freely'}
                </span>
                <span className="text-xs text-muted-foreground/60">
                  {content.length} / {MAX_DRAFT_LENGTH}
                </span>
              </div>
            </TabsContent>
            <TabsContent value="images">
              <Label className="text-xs font-medium text-muted-foreground/80 mb-2 block">
                {isZh ? '添加或粘贴图片，支持一键识别文字' : 'Add or paste images, then extract text'}
              </Label>
              <input type="file" accept="image/*" multiple onChange={handleFileSelect} />
              <div className="grid grid-cols-3 gap-3 mt-3">
                {images.map((img, idx) => (
                  <div key={idx} className="border rounded-lg p-2 flex flex-col gap-2">
                    <img src={img} alt="" className="w-full h-24 object-cover rounded" />
                    <Button onClick={() => handleOcrFromImage(img)} disabled={isOcrLoading} className="py-2 bg-amber-700 text-white">
                      {isZh ? '提取图片文字' : 'Extract Text'}
                    </Button>
                    <Button variant="outline" onClick={() => handleRemoveImage(idx)} disabled={isOcrLoading} className="py-2">
                      {isZh ? '删除图片' : 'Remove'}
                    </Button>
                  </div>
                ))}
              </div>
              {images.length > 0 && (
                <div className="flex gap-2 mt-3">
                  <Button onClick={handleOcrAllImages} disabled={isOcrLoading} className="py-2 bg-amber-700 text-white">
                    {isZh ? '识别全部图片' : 'OCR All'}
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="audio">
              <Label className="text-xs font-medium text-muted-foreground/80 mb-2 block">
                {isZh ? '语音输入或录音，快速转文字或保存音频' : 'Voice input or record audio, transcribe or save'}
              </Label>
              <div className="flex gap-2">
                {!isListening ? (
                  <Button onClick={startListening} className="py-2 bg-amber-700 text-white">
                    {isZh ? '开始语音输入' : 'Start Voice Input'}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={stopListening} className="py-2">
                    {isZh ? '停止语音输入' : 'Stop Voice Input'}
                  </Button>
                )}
                {!isRecording ? (
                  <Button onClick={startRecording} className="py-2 bg-amber-700 text-white">
                    {isZh ? '开始录音' : 'Start Recording'}
                  </Button>
                ) : (
                  <Button variant="outline" onClick={stopRecording} className="py-2">
                    {isZh ? '停止录音' : 'Stop Recording'}
                  </Button>
                )}
              </div>
              {audios.length > 0 && (
                <div className="grid grid-cols-1 gap-3 mt-3">
                  {audios.map((a, idx) => (
                    <div key={idx} className="border rounded-lg p-2 flex items-center justify-between gap-2">
                      <audio src={a} controls className="w-full" />
                      <Button variant="outline" onClick={() => setAudios(prev => prev.filter((_, i) => i !== idx))} className="py-2">
                        {isZh ? '删除音频' : 'Remove Audio'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="actions">
              <Label className="text-xs font-medium text-muted-foreground/80 mb-2 block">
                {isZh ? '把内容快速分发到其他模块' : 'Quickly distribute content elsewhere'}
              </Label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleExtractLinksToSlot} className="py-2">
                  {isZh ? '提取链接到当前时段' : 'Extract Links to Slot'}
                </Button>
                <Button variant="outline" onClick={handleConvertToTodo} className="py-2">
                  {isZh ? '转为待办' : 'To To-do'}
                </Button>
                <Button variant="outline" onClick={handleConvertToReflection} className="py-2">
                  {isZh ? '转为灵感' : 'To Reflection'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
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
              <Button variant="outline" onClick={onClose} className="py-3 border-amber-700/30 hover:bg-amber-50/50 hover:border-amber-700/50 transition-all duration-200">
                {translations.cancelButton}
              </Button>
            </DialogClose>
            <Button onClick={handleSaveOrUpdate} className="py-3 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              {initialData ? translations.updateButton : translations.saveButton}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
