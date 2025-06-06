
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { DayBox } from '@/components/DayBox';
import { DayHoverPreview } from '@/components/DayHoverPreview';
import { Button } from "@/components/ui/button";
import { LogIn, Github, Languages, Sun, Moon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type RatingType = 'excellent' | 'terrible' | 'average' | null;

// Simple SVG icons for platforms not in Lucide
const WeChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2C6.486 2 2 6.03 2 10.552c0 2.45.966 4.692 2.768 6.45L4 22l5.05-2.02c1.35.496 2.805.772 4.283.772h.002c.023 0 .044 0 .067.002.022-.002.044-.002.066-.002h.005c5.514 0 10-4.03 10-8.552C22 6.03 17.514 2 12 2zm-1.248 12.652c0 .942-.768 1.71-1.71 1.71s-1.71-.768-1.71-1.71c0-.94.768-1.708 1.71-1.708s1.71.768 1.71 1.708zm4.902 0c0 .942-.768 1.71-1.71 1.71s-1.71-.768-1.71-1.71c0-.94.768-1.708 1.71-1.708s1.71.768 1.71 1.708z" />
  </svg>
);

const AlibabaIcon = () => (
  <svg viewBox="0 0 1024 1024" fill="currentColor" className="w-6 h-6">
    <path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zm207.9 660.8c-10.7 0-21.4-2.8-30.8-8.5l-65.7-39.4c-8.9-5.4-19.6-8.2-30.5-8.2h-93.5c-30.3 0-55.4 22.8-59.9 52.8-1.2 7.7-7.8 13.5-15.6 13.5H292.1c-13.6 0-24.6-11-24.6-24.6s11-24.6 24.6-24.6h129.5c30.3 0 55.4-22.8 59.9-52.8 1.2-7.7 7.8-13.5 15.6-13.5h93.5c39.9 0 74.8-24.3 90.2-60.7 2.3-5.5 1.5-11.8-2.2-16.6l-85.3-109.9c-11.2-14.4-27.8-22.5-45.3-22.5H351.4c-39.9 0-74.8 24.3-90.2 60.7-2.3 5.5-1.5 11.8 2.2 16.6l65.7 84.7c8.9 11.5 22.8 18.2 37.5 18.2h125.6c13.6 0 24.6 11 24.6 24.6s-11 24.6-24.6 24.6H426.6c-40 0-74.8-24.3-90.2-60.7-2.3 5.5-1.5-11.8 2.2-16.6l85.3-109.9c11.2-14.4 27.8-22.5 45.3-22.5h206.5c39.9 0 74.8 24.3 90.2 60.7 2.3 5.5 1.5 11.8-2.2-16.6l-65.7 84.7c-8.9 11.5-22.8 18.2-37.5 18.2H562.1c-13.6 0-24.6-11-24.6-24.6s11-24.6 24.6-24.6h125.6c40 0 74.8 24.3 90.2 60.7 2.3 5.5 1.5 11.8-2.2-16.6l-85.3 109.9c-11.2-14.4-27.8-22.5-45.3-22.5H531.3c-13.6 0-24.6 11-24.6 24.6s11 24.6 24.6 24.6h189.4c10.7 0 21.4-2.8 30.8-8.5l65.7-39.4c8.9-5.4 19.6-8.2 30.5-8.2H781c13.6 0 24.6 11 24.6 24.6s-11 24.6-24.6 24.6H720.7z" />
  </svg>
);

const BilibiliIcon = () => (
  <svg viewBox="0 0 1024 1024" fill="currentColor" className="w-6 h-6">
    <path d="M763.2 128H260.8C188.8 128 128 188.8 128 260.8v502.4C128 835.2 188.8 896 260.8 896h502.4c72 0 132.8-60.8 132.8-132.8V260.8c0-72-60.8-132.8-132.8-132.8zM384 640V384l256 128-256 128z" />
    <path d="M666.4 303.2c-12-11.2-30.4-11.2-41.6 0L512 408.8l-112.8-105.6c-11.2-11.2-30.4-11.2-41.6 0-11.2 11.2-11.2 30.4 0 41.6l112.8 105.6-112.8 105.6c-11.2 11.2-11.2 30.4 0 41.6 5.6 5.6 12.8 8.8 20.8 8.8s15.2-3.2 20.8-8.8L512 597.6l112.8 105.6c5.6 5.6 12.8 8.8 20.8 8.8s15.2-3.2 20.8-8.8c11.2-11.2 11.2-30.4 0-41.6L553.6 556l112.8-105.6c11.2-12 11.2-30.4 0-41.6.8-.8.8-1.6 0-1.6z" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.03,4.73 15.69,5.36 16.95,6.57L19.05,4.49C17.22,2.77 14.96,1.96 12.19,1.96C6.81,1.96 2.62,6.31 2.62,12S6.62,22.04 12.19,22.04C17.65,22.04 21.73,18.35 21.73,12.33C21.73,11.77 21.56,11.45 21.35,11.1Z" />
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
    selectDayAria: (day: string) => `选择 ${day}`,
    hasNotesAria: '有笔记',
    ratingLabels: {
      excellent: '好极了',
      average: '一般般',
      terrible: '糟透了',
    },
    weeklySummaryTitle: '本周总结',
    weeklySummaryPlaceholder: '写下你的本周总结...',
    wechatAria: '微信',
    alibabaAria: '阿里巴巴',
    bilibiliAria: '哔哩哔哩',
    githubAria: 'GitHub',
    googleAria: '谷歌',
    toggleThemeAria: '切换主题',
    todayPrefix: '今天',
    thumbnailPreviewAlt: (day: string) => `${day} 的缩略图预览`,
  },
  'en': {
    pageTitle: 'Week Glance',
    pageSubtitle: 'Plan your week, one day at a glance.',
    languageButtonText: '中文',
    loginButtonText: 'Login',
    daysOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    communityPrompt: 'Join our community and help us grow!',
    selectDayAria: (day: string) => `Select ${day}`,
    hasNotesAria: 'Has notes',
    ratingLabels: {
      excellent: 'Excellent',
      average: 'Average',
      terrible: 'Terrible',
    },
    weeklySummaryTitle: 'Weekly Summary',
    weeklySummaryPlaceholder: 'Write your weekly summary here...',
    wechatAria: 'WeChat',
    alibabaAria: 'Alibaba',
    bilibiliAria: 'Bilibili',
    githubAria: 'GitHub',
    googleAria: 'Google',
    toggleThemeAria: 'Toggle theme',
    todayPrefix: 'Today',
    thumbnailPreviewAlt: (day: string) => `Thumbnail preview for ${day}`,
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

export default function WeekGlancePage() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('zh-CN');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<string, RatingType>>({});
  const [weeklySummary, setWeeklySummary] = useState<string>('');
  const [theme, setTheme] = useState<Theme>('light');
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  const [hoverPreviewData, setHoverPreviewData] = useState<HoverPreviewData | null>(null);
  const [isAfter6PMToday, setIsAfter6PMToday] = useState<boolean>(false);
  
  const hidePreviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPreviewSuppressedByClickRef = useRef(false);

  const t = translations[currentLanguage];

  const clearTimeoutIfNecessary = useCallback(() => {
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
    setHoverPreviewData(null); 
    isPreviewSuppressedByClickRef.current = true;
    setSelectedDay(prevSelectedDay => prevSelectedDay === day ? null : day);
  }, []);

  const handleNotesChange = useCallback((day: string, newNote: string) => {
    setNotes(prevNotes => {
      const updatedNotes = { ...prevNotes, [day]: newNote };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_NOTES, JSON.stringify(updatedNotes));
      } catch (error) {
        console.error("无法将笔记保存到localStorage:", error);
      }
      return updatedNotes;
    });
  }, []);

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
    setHoverPreviewData({
      ...dayData,
      altText: t.thumbnailPreviewAlt(dayData.dayName),
    });
  }, [t, clearTimeoutIfNecessary]);

  const handleDayHoverEnd = useCallback(() => {
    isPreviewSuppressedByClickRef.current = false; 
    clearTimeoutIfNecessary();
    hidePreviewTimerRef.current = setTimeout(() => {
      setHoverPreviewData(null);
    }, 200);
  }, [clearTimeoutIfNecessary]);

  const handlePreviewMouseEnter = useCallback(() => {
    clearTimeoutIfNecessary();
  }, [clearTimeoutIfNecessary]);

  const handlePreviewMouseLeave = useCallback(() => {
    // We only hide if the mouse truly leaves the preview.
    // If it moves to a DayBox, that DayBox's hover will take over.
    // The timer in handleDayHoverEnd is the primary mechanism for hiding 
    // when moving from DayBox to empty space.
    // This direct hide is for when mouse leaves preview to empty space.
    setHoverPreviewData(null); 
  }, []);

  const handlePreviewClick = useCallback(() => {
    setHoverPreviewData(null);
    isPreviewSuppressedByClickRef.current = true; // Suppress immediate re-show
    clearTimeoutIfNecessary(); // Ensure any pending hide timer from DayBox hover end is cleared
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
          <Button variant="outline" size="sm" aria-label={t.loginButtonText}>
            <LogIn className="mr-2 h-4 w-4" />
            {t.loginButtonText}
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
              isSelected={selectedDay === day}
              onClick={() => handleDaySelect(day)}
              notes={notes[day] || ''}
              onNotesChange={(newNote) => handleNotesChange(day, newNote)}
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
            <a href="#" aria-label={t.alibabaAria} className="text-muted-foreground hover:text-primary transition-colors">
              <AlibabaIcon />
            </a>
            <a href="#" aria-label={t.bilibiliAria} className="text-muted-foreground hover:text-primary transition-colors">
              <BilibiliIcon />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label={t.githubAria} className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" aria-label={t.googleAria} className="text-muted-foreground hover:text-primary transition-colors">
              <GoogleIcon />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

