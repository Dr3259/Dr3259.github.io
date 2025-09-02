
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { TodoItem, MeetingNoteItem, ShareLinkItem, ReflectionItem, RatingType } from '@/lib/page-types';

export interface PlannerState {
    allTodos: Record<string, Record<string, TodoItem[]>>;
    allMeetingNotes: Record<string, Record<string, MeetingNoteItem[]>>;
    allShareLinks: Record<string, Record<string, ShareLinkItem[]>>;
    allReflections: Record<string, Record<string, ReflectionItem[]>>;
    allDailyNotes: Record<string, string>;
    allRatings: Record<string, RatingType>;
    lastTodoMigrationDate: string | null;

    // Actions
    setTodosForSlot: (dateKey: string, hourSlot: string, todos: TodoItem[]) => void;
    setMeetingNotesForSlot: (dateKey: string, hourSlot: string, notes: MeetingNoteItem[]) => void;
    setShareLinksForSlot: (dateKey: string, hourSlot: string, links: ShareLinkItem[]) => void;
    setReflectionsForSlot: (dateKey: string, hourSlot: string, reflections: ReflectionItem[]) => void;
    setDailyNote: (dateKey: string, note: string) => void;
    setRating: (dateKey: string, rating: RatingType) => void;
    setLastTodoMigrationDate: (date: string) => void;
    addUnfinishedTodosToToday: (today: string, yesterday: string) => number;
    addShareLink: (dateKey: string, hourSlot: string, link: ShareLinkItem) => void;
    addTodo: (dateKey: string, hourSlot: string, todo: Omit<TodoItem, 'id'>) => void;
    clearAllPlannerData: () => void;
}

const LOCAL_STORAGE_PLANNER_KEY = 'weekglance_planner_data_v1';

export const usePlannerStore = create<PlannerState>()(
    persist(
        (set, get) => ({
            allTodos: {},
            allMeetingNotes: {},
            allShareLinks: {},
            allReflections: {},
            allDailyNotes: {},
            allRatings: {},
            lastTodoMigrationDate: null,

            setTodosForSlot: (dateKey, hourSlot, todos) => set(state => ({
                allTodos: {
                    ...state.allTodos,
                    [dateKey]: {
                        ...(state.allTodos[dateKey] || {}),
                        [hourSlot]: todos
                    }
                }
            })),
            setMeetingNotesForSlot: (dateKey, hourSlot, notes) => set(state => ({
                allMeetingNotes: {
                    ...state.allMeetingNotes,
                    [dateKey]: {
                        ...(state.allMeetingNotes[dateKey] || {}),
                        [hourSlot]: notes
                    }
                }
            })),
            setShareLinksForSlot: (dateKey, hourSlot, links) => set(state => ({
                allShareLinks: {
                    ...state.allShareLinks,
                    [dateKey]: {
                        ...(state.allShareLinks[dateKey] || {}),
                        [hourSlot]: links
                    }
                }
            })),
            setReflectionsForSlot: (dateKey, hourSlot, reflections) => set(state => ({
                allReflections: {
                    ...state.allReflections,
                    [dateKey]: {
                        ...(state.allReflections[dateKey] || {}),
                        [hourSlot]: reflections
                    }
                }
            })),
            setDailyNote: (dateKey, note) => set(state => ({
                allDailyNotes: { ...state.allDailyNotes, [dateKey]: note }
            })),
            setRating: (dateKey, rating) => set(state => ({
                allRatings: { ...state.allRatings, [dateKey]: rating }
            })),
            setLastTodoMigrationDate: (date) => set({ lastTodoMigrationDate: date }),
            addUnfinishedTodosToToday: (today, yesterday) => {
                const state = get();
                const yesterdayTodos = state.allTodos[yesterday] || {};
                const unfinishedTodos: TodoItem[] = [];

                Object.values(yesterdayTodos).forEach(slot => {
                    if (Array.isArray(slot)) {
                        slot.forEach((todo: TodoItem) => {
                            if (!todo.completed) {
                                unfinishedTodos.push({ ...todo, id: `${todo.id}-migrated-${Date.now()}` });
                            }
                        });
                    }
                });

                if (unfinishedTodos.length > 0) {
                    const targetSlot = '08:00 - 09:00';
                    const todayDayTodos = { ...(state.allTodos[today] || {}) };
                    const todayTargetSlotTodos = todayDayTodos[targetSlot] || [];
                    todayDayTodos[targetSlot] = [...unfinishedTodos, ...todayTargetSlotTodos];
                    
                    set({
                        allTodos: { ...state.allTodos, [today]: todayDayTodos },
                        lastTodoMigrationDate: today
                    });
                } else {
                    set({ lastTodoMigrationDate: today });
                }
                return unfinishedTodos.length;
            },
            addShareLink: (dateKey, hourSlot, link) => set(state => {
                const dayLinks = state.allShareLinks[dateKey] || {};
                const slotLinks = dayLinks[hourSlot] || [];
                const newSlotLinks = [...slotLinks, link];
                return {
                    allShareLinks: {
                        ...state.allShareLinks,
                        [dateKey]: { ...dayLinks, [hourSlot]: newSlotLinks }
                    }
                }
            }),
            addTodo: (dateKey, hourSlot, todo) => set(state => {
                const newTodo = { ...todo, id: Date.now().toString() };
                const dayTodos = state.allTodos[dateKey] || {};
                const slotTodos = dayTodos[hourSlot] || [];
                const newSlotTodos = [...slotTodos, newTodo];
                 return {
                    allTodos: {
                        ...state.allTodos,
                        [dateKey]: { ...dayTodos, [hourSlot]: newSlotTodos }
                    }
                }
            }),
            clearAllPlannerData: () => set({
                allTodos: {},
                allMeetingNotes: {},
                allShareLinks: {},
                allReflections: {},
                allDailyNotes: {},
                allRatings: {},
            }),
        }),
        {
            name: LOCAL_STORAGE_PLANNER_KEY,
            storage: createJSONStorage(() => localStorage),
        }
    )
);
