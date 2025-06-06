"use client";

import { useState, useEffect, useCallback } from 'react';
import { DayBox } from '@/components/DayBox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const LOCAL_STORAGE_KEY = 'weekGlanceNotes';

export default function WeekGlancePage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [currentNoteInput, setCurrentNoteInput] = useState<string>(""); // Renamed for clarity
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error("Failed to parse notes from localStorage:", error);
      // Optionally, clear corrupted data or notify user
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (selectedDay) {
      setCurrentNoteInput(notes[selectedDay] || "");
    } else {
      // When no day is selected, clear the input field
      // Or, alternatively, leave it as is if user might want to paste notes before selecting a day
      // For this design, clearing seems more intuitive.
      setCurrentNoteInput("");
    }
  }, [selectedDay, notes]);

  const handleDaySelect = useCallback((day: string) => {
    setSelectedDay(prevSelectedDay => prevSelectedDay === day ? null : day);
  }, []);

  const handleSaveNote = useCallback(() => {
    if (selectedDay) {
      const updatedNotes = { ...notes, [selectedDay]: currentNoteInput };
      setNotes(updatedNotes);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedNotes));
        toast({
          title: "Note Saved",
          description: `Your note for ${selectedDay} has been saved.`,
        });
      } catch (error) {
        console.error("Failed to save notes to localStorage:", error);
        toast({
          title: "Error",
          description: "Could not save note. Storage might be full.",
          variant: "destructive",
        });
      }
    } else {
       toast({
          title: "No Day Selected",
          description: "Please select a day to save the note.",
          variant: "destructive",
        });
    }
  }, [selectedDay, currentNoteInput, notes, toast]);

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

      {selectedDay && (
        <Card className="mt-8 sm:mt-10 w-full max-w-xl shadow-xl rounded-xl bg-card">
          <CardHeader>
            <CardTitle className="font-headline text-xl sm:text-2xl text-primary">Notes for {selectedDay}</CardTitle>
            <CardDescription>Add or edit your notes for this day. Your notes are saved locally.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={currentNoteInput}
              onChange={(e) => setCurrentNoteInput(e.target.value)}
              placeholder={`What's on your mind for ${selectedDay}?`}
              rows={6}
              className="resize-none focus:ring-primary bg-input/50 placeholder:text-muted-foreground"
              aria-label={`Notes for ${selectedDay}`}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              onClick={handleSaveNote} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              aria-label={`Save note for ${selectedDay}`}
            >
              Save Note
            </Button>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
