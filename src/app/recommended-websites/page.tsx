
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Globe, Star, PlusCircle, Trash2, Github } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import Image from 'next/image';

const translations = {
  'zh-CN': {
    pageTitle: '网络宝藏',
    backButton: '返回休闲驿站',
    tabWebsite: '网站',
    tabOpenSource: '开源',
    tabFavorites: '偏爱',
    addFavorite: '添加偏爱',
    noFavorites: '您还没有添加任何偏爱的网站。',
    addFavoriteDialog: {
      title: '添加新的偏爱网站',
      description: '输入您想收藏的网站信息。',
      labelName: '名称',
      placeholderName: '例如：创意咖啡',
      labelUrl: '链接',
      placeholderUrl: 'https://example.com',
      labelDesc: '描述 (可选)',
      placeholderDesc: '一杯咖啡，无限灵感',
      save: '保存',
      cancel: '取消',
    },
    delete: '删除',
    confirmDelete: '您确定要删除这个收藏吗？'
  },
  'en': {
    pageTitle: 'Web Treasures',
    backButton: 'Back to Rest Stop',
    tabWebsite: 'Websites',
    tabOpenSource: 'Open Source',
    tabFavorites: 'Favorites',
    addFavorite: 'Add Favorite',
    noFavorites: 'You haven\'t added any favorite sites yet.',
    addFavoriteDialog: {
      title: 'Add a New Favorite Site',
      description: 'Enter the information for the site you want to save.',
      labelName: 'Name',
      placeholderName: 'e.g., Creative Coffee',
      labelUrl: 'URL',
      placeholderUrl: 'https://example.com',
      labelDesc: 'Description (optional)',
      placeholderDesc: 'A cup of coffee, endless inspiration',
      save: 'Save',
      cancel: 'Cancel',
    },
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this favorite?'
  }
};

type LanguageKey = keyof typeof translations;

interface SiteItem {
  id?: string;
  name: string;
  description: string;
  url: string;
  icon?: string;
}

const predefinedWebsites: SiteItem[] = [
  { name: 'Product Hunt', description: 'Discover your next favorite thing.', url: 'https://www.producthunt.com/', icon: 'https://placehold.co/40x40.png?text=PH' },
  { name: 'Hacker News', description: 'Where developers get their news.', url: 'https://news.ycombinator.com/', icon: 'https://placehold.co/40x40.png?text=Y' },
  { name: 'Smashing Magazine', description: 'For web designers and developers.', url: 'https://www.smashingmagazine.com/', icon: 'https://placehold.co/40x40.png?text=SM' },
  { name: 'Awwwards', description: 'The awards for design, creativity and innovation on the internet.', url: 'https://www.awwwards.com/', icon: 'https://placehold.co/40x40.png?text=A' },
];

const predefinedOpenSource: SiteItem[] = [
  { name: 'shadcn/ui', description: 'Beautifully designed components built with Radix UI and Tailwind CSS.', url: 'https://github.com/shadcn/ui', icon: 'github' },
  { name: 'Next.js', description: 'The React Framework for Production.', url: 'https://github.com/vercel/next.js', icon: 'github' },
  { name: 'VS Code', description: 'Code editor redefined and free.', url: 'https://github.com/microsoft/vscode', icon: 'github' },
  { name: 'Home Assistant', description: 'Open source home automation that puts local control and privacy first.', url: 'https://github.com/home-assistant/core', icon: 'github' },
];

const LOCAL_STORAGE_FAVORITES_KEY = 'webtreasures_favorites_v1';

const AddFavoriteDialog: React.FC<{ t: any, onSave: (newItem: SiteItem) => void }> = ({ t, onSave }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = () => {
        if (name && url) {
            onSave({
                id: `fav-${Date.now()}`,
                name,
                url,
                description,
            });
            setName('');
            setUrl('');
            setDescription('');
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> {t.addFavorite}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t.addFavoriteDialog.title}</DialogTitle>
                    <DialogDescription>{t.addFavoriteDialog.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t.addFavoriteDialog.labelName}</Label>
                        <Input id="name" placeholder={t.addFavoriteDialog.placeholderName} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="url">{t.addFavoriteDialog.labelUrl}</Label>
                        <Input id="url" placeholder={t.addFavoriteDialog.placeholderUrl} value={url} onChange={(e) => setUrl(e.target.value)} type="url" autoComplete="off" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">{t.addFavoriteDialog.labelDesc}</Label>
                        <Input id="description" placeholder={t.addFavoriteDialog.placeholderDesc} value={description} onChange={(e) => setDescription(e.target.value)} autoComplete="off" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>{t.addFavoriteDialog.cancel}</Button>
                    <Button type="submit" onClick={handleSubmit}>{t.addFavoriteDialog.save}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

const SiteCard: React.FC<{ item: SiteItem, isFavorite?: boolean, onDelete?: (id: string) => void, t: any }> = ({ item, isFavorite, onDelete, t }) => {
    return (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="block p-4 h-full">
                <CardHeader className="flex flex-row items-center gap-4 p-0">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        {item.icon === 'github' ? <Github className="w-6 h-6 text-foreground" /> : item.icon ? 
                            <Image src={item.icon} alt={`${item.name} logo`} width={40} height={40} className="rounded-md" data-ai-hint="logo" /> : 
                            <Globe className="w-6 h-6 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-base font-semibold leading-tight">{item.name}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0 pt-3">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
            </a>
            {isFavorite && onDelete && item.id && (
                <div className="absolute top-2 right-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                        onClick={(e) => {
                            e.preventDefault();
                            if (window.confirm(t.confirmDelete)) {
                                onDelete(item.id!);
                            }
                        }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </Card>
    )
}

export default function RecommendedWebsitesPage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [favorites, setFavorites] = useLocalStorage<SiteItem[]>(LOCAL_STORAGE_FAVORITES_KEY, []);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);
  
  const handleAddFavorite = useCallback((newItem: SiteItem) => {
    setFavorites(prev => [...prev, newItem]);
  }, [setFavorites]);

  const handleDeleteFavorite = useCallback((idToDelete: string) => {
    setFavorites(prev => prev.filter(item => item.id !== idToDelete));
  }, [setFavorites]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground py-8 sm:py-12 px-4 items-center">
      <header className="w-full max-w-4xl mb-6 sm:mb-8 self-center">
        <Link href="/rest" passHref>
            <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.backButton}
            </Button>
        </Link>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center">
        <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary">
            {t.pageTitle}
            </h1>
        </div>

        <Tabs defaultValue="websites" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="websites"><Globe className="mr-2 h-4 w-4"/>{t.tabWebsite}</TabsTrigger>
                <TabsTrigger value="opensource"><Github className="mr-2 h-4 w-4"/>{t.tabOpenSource}</TabsTrigger>
                <TabsTrigger value="favorites"><Star className="mr-2 h-4 w-4"/>{t.tabFavorites}</TabsTrigger>
            </TabsList>
            <TabsContent value="websites">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {predefinedWebsites.map(item => <SiteCard key={item.name} item={item} t={t} />)}
                </div>
            </TabsContent>
            <TabsContent value="opensource">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {predefinedOpenSource.map(item => <SiteCard key={item.name} item={item} t={t} />)}
                </div>
            </TabsContent>
            <TabsContent value="favorites">
                 <div className="space-y-6">
                    <div className="flex justify-end">
                        <AddFavoriteDialog t={t} onSave={handleAddFavorite} />
                    </div>
                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favorites.map(item => <SiteCard key={item.id} item={item} isFavorite={true} onDelete={handleDeleteFavorite} t={t} />)}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>{t.noFavorites}</p>
                        </div>
                    )}
                </div>
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

    