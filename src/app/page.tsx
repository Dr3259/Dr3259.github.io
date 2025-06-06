
"use client";

import { useState, useEffect, useCallback } from 'react';
import { DayBox } from '@/components/DayBox';
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const LOCAL_STORAGE_KEY = 'weekGlanceNotes';

export default function WeekGlancePage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error("Failed to parse notes from localStorage:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  const handleDaySelect = useCallback((day: string) => {
    setSelectedDay(prevSelectedDay => prevSelectedDay === day ? null : day);
  }, []);

  return (
    <main className="flex flex-col items-center min-h-screen bg-background text-foreground py-8 sm:py-10 px-4">
      <header className="mb-10 sm:mb-12 w-full max-w-4xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-headline font-semibold text-primary">
            Week Glance
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Organize your week, one day at a time.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <LogIn className="mr-2 h-4 w-4" />
          Login
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
          />
        ))}
      </div>
    </main>
  );
}
