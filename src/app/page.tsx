
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DayBox } from '@/components/DayBox';
import { DayHoverPreview } from '@/components/DayHoverPreview';
import { Button } from "@/components/ui/button";
import { Languages, Sun, Moon, Gift, Github } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type RatingType = 'excellent' | 'terrible' | 'average' | null;

// Simple SVG icons for platforms not in Lucide
const WeChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2C6.486 2 2 6.03 2 10.552c0 2.45.966 4.692 2.768 6.45L4 22l5.05-2.02c1.35.496 2.805.772 4.283.772h.002c.023 0 .044 0 .067.002.022-.002.044-.002.066-.002h.005c5.514 0 10-4.03 10-8.552C22 6.03 17.514 2 12 2zm-1.248 12.652c0 .942-.768 1.71-1.71 1.71s-1.71-.768-1.71-1.71c0-.94.768-1.708 1.71-1.708s1.71.768 1.71 1.708zm4.902 0c0 .942-.768 1.71-1.71 1.71s-1.71-.768-1.71-1.71c0-.94.768-1.708 1.71-1.708s1.71.768 1.71 1.708z" />
  </svg>
);

const LOCAL_STORAGE_KEY_NOTES = 'weekGlanceNotes';
const LOCAL_STORAGE_KEY_RATINGS = 'weekGlanceRatings';
const LOCAL_STORAGE_KEY_SUMMARY = 'weekGlanceSummary';
const LOCAL_STORAGE_KEY_THEME = 'weekGlanceTheme';

const translations = {
  'zh-CN': {
    pageTitle: '周览',
    pageSubtitle: '规划你的一周，一日一览。',
    languageButtonText: 'English',
    loginButtonText: '登录',
    daysOfWeek: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
    communityPrompt: '加入我们的社区，帮助我们成长！',
    selectDayAria: (day: string) => `查看 ${day} 详情`,
    hasNotesAria: '有笔记',
    ratingLabels: {
      excellent: '好极了',
      average: '一般般',
      terrible: '糟透了',
    },
    weeklySummaryTitle: '本周总结',
    weeklySummaryPlaceholder: '写下你的本周总结...',
    wechatAria: '微信',
    githubAria: 'GitHub',
    toggleThemeAria: '切换主题',
    todayPrefix: '今天',
    thumbnailPreviewAlt: (day: string) => `${day} 的缩略图预览`,
    mitLicenseText: 'MIT 协议',
    donationText: '打赏支持',
  },
  'en': {
    pageTitle: 'Week Glance',
    pageSubtitle: 'Plan your week, one day at a glance.',
    languageButtonText: '中文',
    loginButtonText: 'Login',
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    communityPrompt: 'Join our community and help us grow!',
    selectDayAria: (day: string) => `View details for ${day}`,
    hasNotesAria: 'Has notes',
    ratingLabels: {
      excellent: 'Excellent',
      average: 'Average',
      terrible: 'Terrible',
    },
    weeklySummaryTitle: 'Weekly Summary',
    weeklySummaryPlaceholder: 'Write your weekly summary here...',
    wechatAria: 'WeChat',
    githubAria: 'GitHub',
    toggleThemeAria: 'Toggle theme',
    todayPrefix: 'Today',
    thumbnailPreviewAlt: (day: string) => `Thumbnail preview for ${day}`,
    mitLicenseText: 'MIT Licensed',
    donationText: 'Donate & Support',
  }
};
type LanguageKey = keyof typeof translations;
type Theme = 'light' | 'dark';

interface HoverPreviewData {
  dayName: string;
  notes: string;
  imageHint: string; 
  altText: string;
}

const SHOW_PREVIEW_DELAY = 2000; 
const HIDE_PREVIEW_DELAY = 200; 

export default function WeekGlancePage() {
  const router = useRouter();
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<string, RatingType>>({});
  const [weeklySummary, setWeeklySummary] = useState<string>('');
  const [theme, setTheme] = useState<Theme>('light');
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  const [hoverPreviewData, setHoverPreviewData] = useState<HoverPreviewData | null>(null);
  const [isAfter6PMToday, setIsAfter6PMToday] = useState<boolean>(false);
  
  const showPreviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hidePreviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPreviewSuppressedByClickRef = useRef(false);

  const t = translations[currentLanguage];

  const clearTimeoutIfNecessary = useCallback(() => {
    if (showPreviewTimerRef.current) {
      clearTimeout(showPreviewTimerRef.current);
      showPreviewTimerRef.current = null;
    }
    if (hidePreviewTimerRef.current) {
      clearTimeout(hidePreviewTimerRef.current);
      hidePreviewTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'zh-CN';
    setCurrentLanguage(browserLang);
    if (typeof document !== 'undefined') {
        document.documentElement.lang = browserLang;
    }

    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEY_THEME) as Theme | null;
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let initialTheme: Theme = 'light';
    if (storedTheme) {
      initialTheme = storedTheme;
    } else if (systemPrefersDark) {
      initialTheme = 'dark';
    }
    setTheme(initialTheme);

    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const adjustedDayIndex = (dayOfWeek + 6) % 7; 
    setCurrentDayIndex(adjustedDayIndex);
    setIsAfter6PMToday(today.getHours() >= 18);
    
    return () => { 
      clearTimeoutIfNecessary();
    };

  }, [clearTimeoutIfNecessary]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, theme);
  }, [theme]);
  

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY_NOTES);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error("无法从localStorage解析笔记:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY_NOTES);
    }

    try {
      const storedRatings = localStorage.getItem(LOCAL_STORAGE_KEY_RATINGS);
      if (storedRatings) {
        setRatings(JSON.parse(storedRatings));
      }
    } catch (error) {
      console.error("无法从localStorage解析评分:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY_RATINGS);
    }

    try {
      const storedSummary = localStorage.getItem(LOCAL_STORAGE_KEY_SUMMARY);
      if (storedSummary) {
        setWeeklySummary(storedSummary);
      }
    } catch (error) {
      console.error("无法从localStorage加载总结:", error);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'zh-CN' ? 'en' : 'zh-CN';
    setCurrentLanguage(newLang);
    if (typeof document !== 'undefined') {
        document.documentElement.lang = newLang;
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleDaySelect = useCallback((day: string) => {
    clearTimeoutIfNecessary();
    setHoverPreviewData(null); 
    isPreviewSuppressedByClickRef.current = true;
    router.push(`/day/${encodeURIComponent(day)}`);
  }, [router, clearTimeoutIfNecessary]);


  const handleRatingChange = useCallback((day: string, newRating: RatingType) => {
    setRatings(prevRatings => {
      const updatedRatings = { ...prevRatings, [day]: newRating };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_RATINGS, JSON.stringify(updatedRatings));
      } catch (error) {
        console.error("无法将评分保存到localStorage:", error);
      }
      return updatedRatings;
    });
  }, []);

  const handleSummaryChange = useCallback((summary: string) => {
    setWeeklySummary(summary);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SUMMARY, summary);
    } catch (error) {
      console.error("无法将总结保存到localStorage:", error);
    }
  }, []);

  const handleDayHoverStart = useCallback((dayData: { dayName: string; notes: string; imageHint: string }) => {
    clearTimeoutIfNecessary();
    if (isPreviewSuppressedByClickRef.current) {
      return;
    }
    showPreviewTimerRef.current = setTimeout(() => {
        setHoverPreviewData({
          ...dayData,
          altText: t.thumbnailPreviewAlt(dayData.dayName),
        });
    }, SHOW_PREVIEW_DELAY);
  }, [t, clearTimeoutIfNecessary]);

  const handleDayHoverEnd = useCallback(() => {
    isPreviewSuppressedByClickRef.current = false; 
    clearTimeoutIfNecessary(); 
    hidePreviewTimerRef.current = setTimeout(() => {
      setHoverPreviewData(null);
    }, HIDE_PREVIEW_DELAY);
  }, [clearTimeoutIfNecessary]);

  const handlePreviewMouseEnter = useCallback(() => {
    clearTimeoutIfNecessary(); 
  }, [clearTimeoutIfNecessary]);

  const handlePreviewMouseLeave = useCallback(() => {
    clearTimeoutIfNecessary(); 
    hidePreviewTimerRef.current = setTimeout(() => {
        setHoverPreviewData(null); 
    }, HIDE_PREVIEW_DELAY);
  }, [clearTimeoutIfNecessary]);

  const handlePreviewClick = useCallback(() => {
    clearTimeoutIfNecessary();
    setHoverPreviewData(null);
    isPreviewSuppressedByClickRef.current = true;
  }, [clearTimeoutIfNecessary]);


  return (
    <main className="flex flex-col items-center min-h-screen bg-background text-foreground py-10 sm:py-16 px-4">
      <header className="mb-12 sm:mb-16 w-full max-w-4xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary">
            {t.pageTitle}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {t.pageSubtitle}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={toggleLanguage} aria-label={currentLanguage === 'zh-CN' ? 'Switch to English' : '切换到中文'}>
            <Languages className="mr-2 h-4 w-4" />
            {t.languageButtonText}
          </Button>
          
          <Button variant="outline" size="sm" onClick={toggleTheme} aria-label={t.toggleThemeAria}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 w-full max-w-4xl place-items-center mb-12 sm:mb-16">
        {t.daysOfWeek.map((day, index) => {
          const isCurrentDay = currentDayIndex !== null && index === currentDayIndex;
          const isPastDay = currentDayIndex !== null && index < currentDayIndex;
          const isFutureDay = currentDayIndex !== null && index > currentDayIndex;
          
          return (
            <DayBox
              key={day}
              dayName={day}
              onClick={() => handleDaySelect(day)}
              notes={notes[day] || ''}
              hasNotes={!!notes[day]?.trim()}
              rating={ratings[day] || null}
              onRatingChange={(newRating) => handleRatingChange(day, newRating)}
              isCurrentDay={isCurrentDay}
              isPastDay={isPastDay}
              isFutureDay={isFutureDay}
              isAfter6PMToday={isAfter6PMToday}
              todayLabel={t.todayPrefix}
              selectDayLabel={t.selectDayAria(day)}
              hasNotesLabel={t.hasNotesAria}
              ratingUiLabels={t.ratingLabels}
              onHoverStart={handleDayHoverStart}
              onHoverEnd={handleDayHoverEnd}
              imageHint="activity memory" 
            />
          );
        })}
         <Card className="w-36 h-44 sm:w-40 sm:h-48 flex flex-col rounded-xl border-2 border-transparent hover:border-accent/70 bg-card shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105">
            <CardHeader className="p-2 pb-1 text-center">
               <CardTitle className="text-lg sm:text-xl font-medium text-foreground">
                 {t.weeklySummaryTitle}
               </CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex-grow flex flex-col">
              <Textarea
                placeholder={t.weeklySummaryPlaceholder}
                value={weeklySummary}
                onChange={(e) => handleSummaryChange(e.target.value)}
                className="flex-grow bg-transparent border-none focus-visible:ring-1 focus-visible:ring-primary text-sm rounded-md w-full resize-none p-1"
                aria-label={t.weeklySummaryTitle}
              />
            </CardContent>
          </Card>
      </div>

      {hoverPreviewData && (
        <DayHoverPreview
          dayName={hoverPreviewData.dayName}
          notes={hoverPreviewData.notes}
          imageHint={hoverPreviewData.imageHint}
          altText={hoverPreviewData.altText}
          onMouseEnterPreview={handlePreviewMouseEnter}
          onMouseLeavePreview={handlePreviewMouseLeave}
          onClickPreview={handlePreviewClick}
        />
      )}

      <footer className="mt-auto pt-12 pb-8 w-full max-w-4xl">
        <div className="border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground mb-6">
            {t.communityPrompt}
          </p>
          <div className="flex justify-center items-center space-x-6">
            <a href="#" aria-label={t.wechatAria} className="text-muted-foreground hover:text-primary transition-colors">
              <WeChatIcon />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label={t.githubAria} className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" aria-label={t.donationText} className="text-muted-foreground hover:text-primary transition-colors">
              <Gift className="w-6 h-6" />
            </a>
            <span className="text-xs text-muted-foreground">{t.mitLicenseText}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

