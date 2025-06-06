
"use client";

import { useState, useEffect, useCallback } from 'react';
import { DayBox } from '@/components/DayBox';
import { Button } from "@/components/ui/button";
import { LogIn, Github } from "lucide-react";

const DAYS_OF_WEEK = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
const LOCAL_STORAGE_KEY_NOTES = 'weekGlanceNotes';
const LOCAL_STORAGE_KEY_RATINGS = 'weekGlanceRatings';

type RatingType = 'excellent' | 'terrible' | 'average' | null;

// Simple SVG icons for platforms not in Lucide
const WeChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 2C6.486 2 2 6.03 2 10.552c0 2.45.966 4.692 2.768 6.45L4 22l5.05-2.02c1.35.496 2.805.772 4.283.772h.002c.023 0 .044 0 .067.002.022-.002.044-.002.066-.002h.005c5.514 0 10-4.03 10-8.552C22 6.03 17.514 2 12 2zm-1.248 12.652c0 .942-.768 1.71-1.71 1.71s-1.71-.768-1.71-1.71c0-.94.768-1.708 1.71-1.708s1.71.768 1.71 1.708zm4.902 0c0 .942-.768 1.71-1.71 1.71s-1.71-.768-1.71-1.71c0-.94.768-1.708 1.71-1.708s1.71.768 1.71 1.708z" />
  </svg>
);

const AlibabaIcon = () => (
  <svg viewBox="0 0 1024 1024" fill="currentColor" className="w-6 h-6">
    <path d="M512 0C229.2 0 0 229.2 0 512s229.2 512 512 512 512-229.2 512-512S794.8 0 512 0zm207.9 660.8c-10.7 0-21.4-2.8-30.8-8.5l-65.7-39.4c-8.9-5.4-19.6-8.2-30.5-8.2h-93.5c-30.3 0-55.4 22.8-59.9 52.8-1.2 7.7-7.8 13.5-15.6 13.5H292.1c-13.6 0-24.6-11-24.6-24.6s11-24.6 24.6-24.6h129.5c30.3 0 55.4-22.8 59.9-52.8 1.2-7.7 7.8-13.5 15.6-13.5h93.5c39.9 0 74.8-24.3 90.2-60.7 2.3-5.5 1.5-11.8-2.2-16.6l-85.3-109.9c-11.2-14.4-27.8-22.5-45.3-22.5H351.4c-39.9 0-74.8 24.3-90.2 60.7-2.3 5.5-1.5 11.8 2.2 16.6l65.7 84.7c8.9 11.5 22.8 18.2 37.5 18.2h125.6c13.6 0 24.6 11 24.6 24.6s-11 24.6-24.6 24.6H426.6c-40 0-74.8-24.3-90.2-60.7-2.3-5.5-1.5-11.8 2.2-16.6l85.3-109.9c11.2-14.4 27.8-22.5 45.3-22.5h206.5c39.9 0 74.8 24.3 90.2 60.7 2.3 5.5 1.5 11.8-2.2 16.6l-65.7 84.7c-8.9 11.5-22.8 18.2-37.5 18.2H562.1c-13.6 0-24.6-11-24.6-24.6s11-24.6 24.6-24.6h125.6c40 0 74.8 24.3 90.2 60.7 2.3 5.5 1.5 11.8-2.2 16.6l-85.3 109.9c-11.2-14.4-27.8-22.5-45.3-22.5H531.3c-13.6 0-24.6 11-24.6 24.6s11 24.6 24.6 24.6h189.4c10.7 0 21.4-2.8 30.8-8.5l65.7-39.4c8.9-5.4 19.6-8.2 30.5-8.2H781c13.6 0 24.6 11 24.6 24.6s-11 24.6-24.6 24.6H720.7z" />
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


export default function WeekGlancePage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<Record<string, RatingType>>({});

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
  }, []);

  const handleDaySelect = useCallback((day: string) => {
    setSelectedDay(prevSelectedDay => prevSelectedDay === day ? null : day);
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

  return (
    <main className="flex flex-col items-center min-h-screen bg-background text-foreground py-8 sm:py-10 px-4">
      <header className="mb-10 sm:mb-12 w-full max-w-4xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary">
            周览
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            规划你的一周，一日一览。
          </p>
        </div>
        <Button variant="outline" size="sm">
          <LogIn className="mr-2 h-4 w-4" />
          登录
        </Button>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl place-items-center mb-10">
        {DAYS_OF_WEEK.map((day) => (
          <DayBox
            key={day}
            dayName={day}
            isSelected={selectedDay === day}
            onClick={() => handleDaySelect(day)}
            hasNotes={!!notes[day]?.trim()}
            rating={ratings[day] || null}
            onRatingChange={(newRating) => handleRatingChange(day, newRating)}
          />
        ))}
      </div>

      <footer className="mt-auto pt-10 pb-6 w-full max-w-4xl">
        <div className="border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground mb-4">
            加入我们的社区，帮助我们成长！
          </p>
          <div className="flex justify-center items-center space-x-6">
            <a href="#" aria-label="微信" className="text-muted-foreground hover:text-primary transition-colors">
              <WeChatIcon />
            </a>
            <a href="#" aria-label="阿里巴巴" className="text-muted-foreground hover:text-primary transition-colors">
              <AlibabaIcon />
            </a>
            <a href="#" aria-label="哔哩哔哩" className="text-muted-foreground hover:text-primary transition-colors">
              <BilibiliIcon />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" aria-label="谷歌" className="text-muted-foreground hover:text-primary transition-colors">
              <GoogleIcon />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
