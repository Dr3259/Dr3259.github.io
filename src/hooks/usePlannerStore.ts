
"use client";

import { create } from 'zustand';
import type { TodoItem, MeetingNoteItem, ShareLinkItem, ReflectionItem, RatingType } from '@/lib/page-types';
import { dataProvider } from '@/lib/data-provider';
import type { User } from 'firebase/auth';

export interface PlannerData {
    allTodos: Record<string, Record<string, TodoItem[]>>;
    allMeetingNotes: Record<string, Record<string, MeetingNoteItem[]>>;
    allShareLinks: Record<string, Record<string, ShareLinkItem[]>>;
    allReflections: Record<string, Record<string, ReflectionItem[]>>;
    customInspirationTags: Array<{id: string; name: string; emoji: string; color: string}>; // 自定义标签
    allDailyNotes: Record<string, string>;
    allRatings: Record<string, RatingType>;
    lastTodoMigrationDate: string | null;
}

export interface PlannerState extends PlannerData {
    isFirebaseConnected: boolean; // Note: This name is kept for now, but it represents any backend connection.
    currentUser: User | null;
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
    addReflection: (dateKey: string, hourSlot: string, reflection: Omit<ReflectionItem, 'id'>) => void;
    addCustomInspirationTag: (tag: {name: string; emoji: string; color: string}) => void;
    updateCustomInspirationTag: (id: string, tag: {name: string; emoji: string; color: string}) => void;
    deleteCustomInspirationTag: (id: string) => void;
    clearAllPlannerData: () => void;
    _initialize: (user: User | null) => void;
    _setStore: (data: Partial<PlannerData>) => void;
}

const LOCAL_STORAGE_PLANNER_KEY = 'weekglance_planner_data_v3';

let firestoreUnsubscribe: (() => void) | null = null;

const DEFAULT_INSPIRATION_TAGS = [
    { id: 'idea', name: '想法', emoji: '💡', color: '#fbbf24' },
    { id: 'thought', name: '思考', emoji: '🤔', color: '#8b5cf6' },
    { id: 'quote', name: '摘录', emoji: '📝', color: '#06b6d4' },
    { id: 'reminder', name: '提醒', emoji: '⏰', color: '#f59e0b' },
    { id: 'other', name: '其他', emoji: '📌', color: '#6b7280' }
];

const usePlannerStore = create<PlannerState>()((set, get) => ({
    allTodos: {},
    allMeetingNotes: {},
    allShareLinks: {},
    allReflections: {},
    customInspirationTags: DEFAULT_INSPIRATION_TAGS,
    allDailyNotes: {},
    allRatings: {},
    lastTodoMigrationDate: null,
    isFirebaseConnected: false,
    currentUser: null,

    _setStore: (data) => set(data),

    _initialize: (user) => {
        if (firestoreUnsubscribe) firestoreUnsubscribe();
        
        if (user) {
            set({ currentUser: user, isFirebaseConnected: true });

            firestoreUnsubscribe = dataProvider.onDataSnapshot(user.uid, (remoteData) => {
                if (remoteData) {
                    console.log("Firestore data received:", remoteData);
                    get()._setStore(remoteData);
                } else {
                    // No data on remote, check local and upload if exists
                    if (typeof window !== 'undefined') {
                        const localDataString = localStorage.getItem(LOCAL_STORAGE_PLANNER_KEY);
                        if (localDataString) {
                            try {
                                const { state: localData } = JSON.parse(localDataString);
                                if (localData) {
                                    dataProvider.saveData(user.uid, localData);
                                    localStorage.removeItem(LOCAL_STORAGE_PLANNER_KEY);
                                }
                            } catch (e) {
                                console.error("Failed to parse or upload local data:", e);
                            }
                        }
                    }
                }
            });
        } else {
            // User logged out
            set({
                currentUser: null,
                isFirebaseConnected: false,
                allTodos: {}, allMeetingNotes: {}, allShareLinks: {},
                allReflections: {}, customInspirationTags: DEFAULT_INSPIRATION_TAGS, allDailyNotes: {}, allRatings: {},
                lastTodoMigrationDate: null,
            });
            if (typeof window !== 'undefined') {
                try {
                    const dataString = localStorage.getItem(LOCAL_STORAGE_PLANNER_KEY);
                    if (dataString) {
                        const { state } = JSON.parse(dataString);
                        if (state) get()._setStore(state);
                    }
                } catch (e) {
                    console.error("Failed to load local data after logout:", e);
                }
            }
        }
    },
    
    setTodosForSlot: (dateKey, hourSlot, todos) => {
        const newState = {
            ...get().allTodos,
            [dateKey]: {
                ...(get().allTodos[dateKey] || {}),
                [hourSlot]: todos
            }
        };
        set({ allTodos: newState });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { allTodos: newState });
        }
    },
    setMeetingNotesForSlot: (dateKey, hourSlot, notes) => {
        const newState = {
            ...get().allMeetingNotes,
            [dateKey]: {
                ...(get().allMeetingNotes[dateKey] || {}),
                [hourSlot]: notes
            }
        };
        set({ allMeetingNotes: newState });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { allMeetingNotes: newState });
        }
    },
    setShareLinksForSlot: (dateKey, hourSlot, links) => {
        const newState = {
            ...get().allShareLinks,
            [dateKey]: {
                ...(get().allShareLinks[dateKey] || {}),
                [hourSlot]: links
            }
        };
        set({ allShareLinks: newState });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { allShareLinks: newState });
        }
    },
    setReflectionsForSlot: (dateKey, hourSlot, reflections) => {
        const newState = {
            ...get().allReflections,
            [dateKey]: {
                ...(get().allReflections[dateKey] || {}),
                [hourSlot]: reflections
            }
        };
        set({ allReflections: newState });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { allReflections: newState });
        }
    },
    setDailyNote: (dateKey, note) => {
        const newState = { ...get().allDailyNotes, [dateKey]: note };
        set({ allDailyNotes: newState });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { allDailyNotes: newState });
        }
    },
    setRating: (dateKey, rating) => {
        const newState = { ...get().allRatings, [dateKey]: rating };
        set({ allRatings: newState });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { allRatings: newState });
        }
    },
    setLastTodoMigrationDate: (date) => {
        set({ lastTodoMigrationDate: date });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { lastTodoMigrationDate: date });
        }
    },
    addTodo: (dateKey, hourSlot, todo) => {
        const newTodo = { ...todo, id: Date.now().toString() };
        get().setTodosForSlot(dateKey, hourSlot, [...(get().allTodos[dateKey]?.[hourSlot] || []), newTodo]);
    },
    addShareLink: (dateKey, hourSlot, link) => {
        get().setShareLinksForSlot(dateKey, hourSlot, [...(get().allShareLinks[dateKey]?.[hourSlot] || []), link]);
    },
    addReflection: (dateKey, hourSlot, reflection) => {
        const newReflection = { ...reflection, id: Date.now().toString() };
        get().setReflectionsForSlot(dateKey, hourSlot, [...(get().allReflections[dateKey]?.[hourSlot] || []), newReflection]);
    },
    addCustomInspirationTag: (tag) => {
        const newTag = { ...tag, id: Date.now().toString() };
        const newTags = [...get().customInspirationTags, newTag];
        set({ customInspirationTags: newTags });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { customInspirationTags: newTags });
        }
    },
    updateCustomInspirationTag: (id, tag) => {
        const newTags = get().customInspirationTags.map(t => t.id === id ? { ...tag, id } : t);
        set({ customInspirationTags: newTags });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { customInspirationTags: newTags });
        }
    },
    deleteCustomInspirationTag: (id) => {
        const newTags = get().customInspirationTags.filter(t => t.id !== id);
        set({ customInspirationTags: newTags });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { customInspirationTags: newTags });
        }
    },
    addUnfinishedTodosToToday: (today, yesterday) => {
        const state = get();
        const yesterdayTodos = state.allTodos[yesterday] || {};
        const unfinishedTodos: TodoItem[] = Object.values(yesterdayTodos).flat().filter(todo => !todo.completed).map(todo => ({ ...todo, id: `${todo.id}-migrated-${Date.now()}` }));

        if (unfinishedTodos.length > 0) {
            const now = new Date();
            const currentHour = now.getHours();
            const targetSlot = `${String(currentHour).padStart(2, '0')}:00 - ${String(currentHour + 1).padStart(2, '0')}:00`;
            
            const todayDayTodos = { ...(state.allTodos[today] || {}) };
            const todayTargetSlotTodos = todayDayTodos[targetSlot] || [];
            todayDayTodos[targetSlot] = [...unfinishedTodos, ...todayTargetSlotTodos];
            
            set({ allTodos: { ...state.allTodos, [today]: todayDayTodos }, lastTodoMigrationDate: today });
            if (state.currentUser) {
                dataProvider.saveData(state.currentUser.uid, {
                    allTodos: get().allTodos,
                    lastTodoMigrationDate: today
                });
            }
        } else {
            get().setLastTodoMigrationDate(today);
        }
        return unfinishedTodos.length;
    },
    clearAllPlannerData: () => {
        const emptyState: PlannerData = {
            allTodos: {}, allMeetingNotes: {}, allShareLinks: {},
            allReflections: {}, customInspirationTags: get().customInspirationTags, allDailyNotes: {}, allRatings: {},
            lastTodoMigrationDate: get().lastTodoMigrationDate
        };
        set(emptyState);
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, emptyState);
        }
    },
}));

// This listener should be initialized once in the app, e.g. in a top-level component or context.
// We're placing it here to keep the logic self-contained for now.
dataProvider.onAuthStateChanged(usePlannerStore.getState()._initialize);

// Sync local storage to zustand state for non-logged-in users
if (typeof window !== 'undefined' && !usePlannerStore.getState().currentUser) {
    const dataString = localStorage.getItem(LOCAL_STORAGE_PLANNER_KEY);
    if (dataString) {
        try {
            const { state } = JSON.parse(dataString);
            if (state) usePlannerStore.getState()._setStore(state);
        } catch (e) { console.error("Failed to parse local data:", e); }
    }
}

// Persist to localStorage only when not logged in
usePlannerStore.subscribe(
    (state) => {
        if (!state.currentUser && typeof window !== 'undefined') {
            const dataToSave = {
                allTodos: state.allTodos,
                allMeetingNotes: state.allMeetingNotes,
                allShareLinks: state.allShareLinks,
                allReflections: state.allReflections,
                customInspirationTags: state.customInspirationTags,
                allDailyNotes: state.allDailyNotes,
                allRatings: state.allRatings,
                lastTodoMigrationDate: state.lastTodoMigrationDate
            };
            localStorage.setItem(LOCAL_STORAGE_PLANNER_KEY, JSON.stringify({ state: dataToSave }));
        }
    }
);

export { usePlannerStore };

    