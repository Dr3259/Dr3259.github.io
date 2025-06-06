
"use client";

import { useState, useEffect, useCallback } from 'react';
import { DayBox } from '@/components/DayBox';
// Removed Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle from 'ui/card' as they are no longer used for the notes section
// Removed Textarea from 'ui/textarea' as it's no longer used
// Removed Button from 'ui/button' as it's no longer used for saving notes
// Removed useToast hook as it's no longer used

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const LOCAL_STORAGE_KEY = 'weekGlanceNotes';

export default function WeekGlancePage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  // Removed currentNoteInput state
  // Removed useToast()

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

  // Removed useEffect that updated currentNoteInput

  const handleDaySelect = useCallback((day: string) => {
    setSelectedDay(prevSelectedDay => prevSelectedDay === day ? null : day);
  }, []);

  // Removed handleSaveNote function

  return (
    <main className="flex flex-col items-center min-h-screen bg-background text-foreground py-8 sm:py-10 px-4">
      <header className="mb-10 sm:mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-headline font-semibold text-primary">
          Week Glance
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Organize your week, one day at a time.
        </p>
      </header>

      <div className="flex flex-col items-center w-full max-w-4xl mb-10">
        {/* Top Row: 4 boxes */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          {DAYS_OF_WEEK.slice(0, 4).map((day) => (
            <DayBox
              key={day}
              dayName={day}
              isSelected={selectedDay === day}
              onClick={() => handleDaySelect(day)}
              hasNotes={!!notes[day]?.trim()}
            />
          ))}
        </div>

        {/* Bottom Row: 3 boxes */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {DAYS_OF_WEEK.slice(4, 7).map((day) => (
            <DayBox
              key={day}
              dayName={day}
              isSelected={selectedDay === day}
              onClick={() => handleDaySelect(day)}
              hasNotes={!!notes[day]?.trim()}
            />
          ))}
        </div>
      </div>

      {/* Removed the Card section for displaying/editing notes */}
    </main>
  );
}
