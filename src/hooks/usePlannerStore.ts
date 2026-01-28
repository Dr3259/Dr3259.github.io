
"use client";

import { create } from 'zustand';
import type { TodoItem, MeetingNoteItem, ShareLinkItem, ReflectionItem, DraftItem, RatingType, EventRecordItem } from '@/lib/page-types';
import { dataProvider } from '@/lib/data-provider';
import type { User } from 'firebase/auth';

export interface PlannerData {
    allTodos: Record<string, Record<string, TodoItem[]>>;
    allMeetingNotes: Record<string, Record<string, MeetingNoteItem[]>>;
    allShareLinks: Record<string, Record<string, ShareLinkItem[]>>;
    allReflections: Record<string, Record<string, ReflectionItem[]>>;
    allDrafts: Record<string, Record<string, DraftItem[]>>;
    allEventRecords: Record<string, Record<string, EventRecordItem[]>>;
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
    setDraftsForSlot: (dateKey: string, hourSlot: string, drafts: DraftItem[]) => void;
    setEventRecordsForSlot: (dateKey: string, hourSlot: string, items: EventRecordItem[]) => void;
    setDailyNote: (dateKey: string, note: string) => void;
    setRating: (dateKey: string, rating: RatingType) => void;
    setLastTodoMigrationDate: (date: string) => void;
    addUnfinishedTodosToToday: (today: string, yesterday: string) => number;
    addShareLink: (dateKey: string, hourSlot: string, link: ShareLinkItem) => void;
    addTodo: (dateKey: string, hourSlot: string, todo: Omit<TodoItem, 'id'>) => void;
    addReflection: (dateKey: string, hourSlot: string, reflection: Omit<ReflectionItem, 'id'>) => void;
    addDraft: (dateKey: string, hourSlot: string, draft: Omit<DraftItem, 'id'>) => void;
    addEventRecord: (dateKey: string, hourSlot: string, item: Omit<EventRecordItem, 'id'>) => void;
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
    { id: 'reasoning', name: '推理', emoji: '🧠', color: '#8b5cf6' },
    { id: 'review', name: '复盘', emoji: '🔁', color: '#10b981' },
    { id: 'knowledge', name: '知识点', emoji: '📚', color: '#06b6d4' },
    { id: 'goal', name: '目标', emoji: '🎯', color: '#ef4444' },
];

const usePlannerStore = create<PlannerState>()((set, get) => ({
    allTodos: {},
    allMeetingNotes: {},
    allShareLinks: {},
    allReflections: {},
    allDrafts: {},
    allEventRecords: {},
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
                    const current = get();
                    const remoteTags = remoteData.customInspirationTags || [];
                    const localTags = current.customInspirationTags || [];
                    const byId: Record<string, {id:string; name:string; emoji:string; color:string}> = {};
                    for (const t of remoteTags) byId[t.id] = t;
                    for (const t of localTags) if (!byId[t.id]) byId[t.id] = t;
                    const mergedTags = Object.values(byId);
                    get()._setStore({ ...current, ...remoteData, customInspirationTags: mergedTags });
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
                allReflections: {}, allDrafts: {}, customInspirationTags: DEFAULT_INSPIRATION_TAGS, allDailyNotes: {}, allRatings: {},
                allEventRecords: {},
                lastTodoMigrationDate: null,
            });
            if (typeof window !== 'undefined') {
                try {
                    const dataString = localStorage.getItem(LOCAL_STORAGE_PLANNER_KEY);
                    if (dataString) {
                        const { state } = JSON.parse(dataString);
                        if (state) get()._setStore(state);
                        set({ customInspirationTags: DEFAULT_INSPIRATION_TAGS });
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
            dataProvider.saveData(currentUser.uid, { allTodos: newState }).catch(() => {});
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
            dataProvider.saveData(currentUser.uid, { allMeetingNotes: newState }).catch(() => {});
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
            dataProvider.saveData(currentUser.uid, { allShareLinks: newState }).catch(() => {});
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
            dataProvider.saveData(currentUser.uid, { allReflections: newState }).catch(() => {});
        }
    },
    setDraftsForSlot: (dateKey, hourSlot, drafts) => {
        const newState = {
            ...get().allDrafts,
            [dateKey]: {
                ...(get().allDrafts[dateKey] || {}),
                [hourSlot]: drafts
            }
        };
        set({ allDrafts: newState });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { allDrafts: newState }).catch(() => {});
        }
    },
    setEventRecordsForSlot: (dateKey: string, hourSlot: string, items) => {
        const sanitizedItems = items.map(item => ({
            ...item,
            title: item.title || '',
            steps: (item.steps || []).map((s, i) => ({
                order: s.order ?? (i + 1),
                title: s.title || '',
                detail: s.detail ?? undefined
            })),
            timestamp: item.timestamp || new Date().toISOString(),
            completedAt: item.completedAt || new Date().toISOString()
        })) as EventRecordItem[];
        const byDate = { ...(get().allEventRecords[dateKey] || {}) };
        byDate[hourSlot] = sanitizedItems;
        const newState = { ...get().allEventRecords, [dateKey]: byDate };
        set({ allEventRecords: newState });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { allEventRecords: newState }).catch(() => {});
        }
    },
    setDailyNote: (dateKey, note) => {
        const newState = { ...get().allDailyNotes, [dateKey]: note };
        set({ allDailyNotes: newState });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { allDailyNotes: newState }).catch(() => {});
        }
    },
    setRating: (dateKey, rating) => {
        const newState = { ...get().allRatings, [dateKey]: rating };
        set({ allRatings: newState });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { allRatings: newState }).catch(() => {});
        }
    },
    setLastTodoMigrationDate: (date) => {
        set({ lastTodoMigrationDate: date });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { lastTodoMigrationDate: date }).catch(() => {});
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
    addDraft: (dateKey, hourSlot, draft) => {
        const newDraft = { ...draft, id: Date.now().toString() };
        get().setDraftsForSlot(dateKey, hourSlot, [...(get().allDrafts[dateKey]?.[hourSlot] || []), newDraft]);
    },
    addEventRecord: (dateKey, hourSlot, item) => {
        const newItem = { 
            ...item, 
            id: Date.now().toString(),
            title: item.title || '',
            steps: (item.steps || []).map((s, i) => ({
                order: (s as any).order ?? (i + 1),
                title: (s as any).title || '',
                detail: (s as any).detail ?? null
            })),
            timestamp: item.timestamp || new Date().toISOString(),
            completedAt: item.completedAt || new Date().toISOString()
        };
        get().setEventRecordsForSlot(dateKey, hourSlot, [...(get().allEventRecords[dateKey]?.[hourSlot] || []), newItem]);
    },
    addCustomInspirationTag: (tag) => {
        const newTag = { ...tag, id: Date.now().toString() };
        const newTags = [...get().customInspirationTags, newTag];
        set({ customInspirationTags: newTags });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { customInspirationTags: newTags }).catch(() => {});
        }
    },
    updateCustomInspirationTag: (id, tag) => {
        const newTags = get().customInspirationTags.map(t => t.id === id ? { ...tag, id } : t);
        set({ customInspirationTags: newTags });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { customInspirationTags: newTags }).catch(() => {});
        }
    },
    deleteCustomInspirationTag: (id) => {
        const newTags = get().customInspirationTags.filter(t => t.id !== id);
        set({ customInspirationTags: newTags });
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, { customInspirationTags: newTags }).catch(() => {});
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
                }).catch(() => {});
            }
        } else {
            get().setLastTodoMigrationDate(today);
        }
        return unfinishedTodos.length;
    },
    clearAllPlannerData: () => {
        const emptyState: PlannerData = {
            allTodos: {}, allMeetingNotes: {}, allShareLinks: {},
            allReflections: {}, allDrafts: {}, allEventRecords: {}, customInspirationTags: get().customInspirationTags, allDailyNotes: {}, allRatings: {},
            lastTodoMigrationDate: get().lastTodoMigrationDate
        };
        set(emptyState);
        const { currentUser } = get();
        if (currentUser) {
            dataProvider.saveData(currentUser.uid, emptyState).catch(() => {});
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
                allDrafts: state.allDrafts,
                allEventRecords: state.allEventRecords,
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

    
