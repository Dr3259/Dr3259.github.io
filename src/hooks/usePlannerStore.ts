
"use client";

import { create } from 'zustand';
import type { TodoItem, MeetingNoteItem, ShareLinkItem, ReflectionItem, RatingType } from '@/lib/page-types';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';

export interface PlannerData {
    allTodos: Record<string, Record<string, TodoItem[]>>;
    allMeetingNotes: Record<string, Record<string, MeetingNoteItem[]>>;
    allShareLinks: Record<string, Record<string, ShareLinkItem[]>>;
    allReflections: Record<string, Record<string, ReflectionItem[]>>;
    allDailyNotes: Record<string, string>;
    allRatings: Record<string, RatingType>;
    lastTodoMigrationDate: string | null;
}

export interface PlannerState extends PlannerData {
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
    _setStore: (data: Partial<PlannerData>) => void;
    isFirebaseConnected: boolean;
}

const LOCAL_STORAGE_PLANNER_KEY = 'weekglance_planner_data_v2';
const FIRESTORE_COLLECTION = 'plannerData';

let firestoreUnsubscribe: (() => void) | null = null;
let currentUser: User | null = null;

const usePlannerStore = create<PlannerState>()(
    (set, get) => ({
        allTodos: {},
        allMeetingNotes: {},
        allShareLinks: {},
        allReflections: {},
        allDailyNotes: {},
        allRatings: {},
        lastTodoMigrationDate: null,
        isFirebaseConnected: false,

        _setStore: (data) => set(data),

        setTodosForSlot: (dateKey, hourSlot, todos) => set(state => {
            const newState = {
                ...state,
                allTodos: {
                    ...state.allTodos,
                    [dateKey]: {
                        ...(state.allTodos[dateKey] || {}),
                        [hourSlot]: todos
                    }
                }
            };
            syncToFirestore(newState);
            return newState;
        }),
        setMeetingNotesForSlot: (dateKey, hourSlot, notes) => set(state => {
            const newState = {
                ...state,
                allMeetingNotes: {
                    ...state.allMeetingNotes,
                    [dateKey]: {
                        ...(state.allMeetingNotes[dateKey] || {}),
                        [hourSlot]: notes
                    }
                }
            };
            syncToFirestore(newState);
            return newState;
        }),
        setShareLinksForSlot: (dateKey, hourSlot, links) => set(state => {
            const newState = {
                ...state,
                allShareLinks: {
                    ...state.allShareLinks,
                    [dateKey]: {
                        ...(state.allShareLinks[dateKey] || {}),
                        [hourSlot]: links
                    }
                }
            };
            syncToFirestore(newState);
            return newState;
        }),
        setReflectionsForSlot: (dateKey, hourSlot, reflections) => set(state => {
            const newState = {
                ...state,
                allReflections: {
                    ...state.allReflections,
                    [dateKey]: {
                        ...(state.allReflections[dateKey] || {}),
                        [hourSlot]: reflections
                    }
                }
            };
            syncToFirestore(newState);
            return newState;
        }),
        setDailyNote: (dateKey, note) => set(state => {
            const newState = { ...state, allDailyNotes: { ...state.allDailyNotes, [dateKey]: note } };
            syncToFirestore(newState);
            return newState;
        }),
        setRating: (dateKey, rating) => set(state => {
            const newState = { ...state, allRatings: { ...state.allRatings, [dateKey]: rating } };
            syncToFirestore(newState);
            return newState;
        }),
        setLastTodoMigrationDate: (date) => set(state => {
            const newState = { ...state, lastTodoMigrationDate: date };
            syncToFirestore(newState);
            return newState;
        }),
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
                
                const newState = {
                    ...state,
                    allTodos: { ...state.allTodos, [today]: todayDayTodos },
                    lastTodoMigrationDate: today
                };
                set(newState);
                syncToFirestore(newState);
            } else {
                const newState = { ...state, lastTodoMigrationDate: today };
                set(newState);
                syncToFirestore(newState);
            }
            return unfinishedTodos.length;
        },
        addShareLink: (dateKey, hourSlot, link) => set(state => {
            const dayLinks = state.allShareLinks[dateKey] || {};
            const slotLinks = dayLinks[hourSlot] || [];
            const newSlotLinks = [...slotLinks, link];
            const newState = {
                ...state,
                allShareLinks: {
                    ...state.allShareLinks,
                    [dateKey]: { ...dayLinks, [hourSlot]: newSlotLinks }
                }
            };
            syncToFirestore(newState);
            return newState;
        }),
        addTodo: (dateKey, hourSlot, todo) => set(state => {
            const newTodo = { ...todo, id: Date.now().toString() };
            const dayTodos = state.allTodos[dateKey] || {};
            const slotTodos = dayTodos[hourSlot] || [];
            const newSlotTodos = [...slotTodos, newTodo];
             const newState = {
                ...state,
                allTodos: {
                    ...state.allTodos,
                    [dateKey]: { ...dayTodos, [hourSlot]: newSlotTodos }
                }
            };
            syncToFirestore(newState);
            return newState;
        }),
        clearAllPlannerData: () => set(state => {
            const newState = {
                ...state,
                allTodos: {}, allMeetingNotes: {}, allShareLinks: {},
                allReflections: {}, allDailyNotes: {}, allRatings: {},
            };
            syncToFirestore(newState);
            return newState;
        }),
    })
);

// --- Auth and Firestore Sync Logic ---

const syncToFirestore = (state: PlannerState) => {
    if (currentUser) {
        const { allTodos, allMeetingNotes, allShareLinks, allReflections, allDailyNotes, allRatings, lastTodoMigrationDate } = state;
        const dataToSync: PlannerData = {
            allTodos, allMeetingNotes, allShareLinks, allReflections, allDailyNotes, allRatings, lastTodoMigrationDate
        };
        const docRef = doc(db, FIRESTORE_COLLECTION, currentUser.uid);
        // We use setDoc with merge:true to avoid overwriting data from another device
        setDoc(docRef, dataToSync, { merge: true }).catch(error => {
            console.error("Error syncing data to Firestore:", error);
        });
    } else {
        // If no user, sync to localStorage
        const { allTodos, allMeetingNotes, allShareLinks, allReflections, allDailyNotes, allRatings, lastTodoMigrationDate } = state;
        const dataToSync = { state: { allTodos, allMeetingNotes, allShareLinks, allReflections, allDailyNotes, allRatings, lastTodoMigrationDate } };
        localStorage.setItem(LOCAL_STORAGE_PLANNER_KEY, JSON.stringify(dataToSync));
    }
};

const syncFromLocalStorage = () => {
    const dataString = localStorage.getItem(LOCAL_STORAGE_PLANNER_KEY);
    if (dataString) {
        try {
            const { state } = JSON.parse(dataString);
            if (state) {
                 usePlannerStore.getState()._setStore(state);
            }
        } catch (e) {
            console.error("Failed to parse local storage data:", e);
        }
    }
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User logged in
        if (firestoreUnsubscribe) firestoreUnsubscribe(); // Unsubscribe from previous user's data
        currentUser = user;

        const docRef = doc(db, FIRESTORE_COLLECTION, user.uid);
        
        // Listen for realtime updates
        firestoreUnsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const firestoreData = docSnap.data() as PlannerData;
                usePlannerStore.getState()._setStore(firestoreData);
            } else {
                // No data for this user yet, maybe sync local data up?
                // For now, we clear the store to start fresh.
                 usePlannerStore.getState()._setStore({
                    allTodos: {}, allMeetingNotes: {}, allShareLinks: {},
                    allReflections: {}, allDailyNotes: {}, allRatings: {},
                 });
            }
            usePlannerStore.setState({ isFirebaseConnected: true });
        }, (error) => {
             console.error("Firestore snapshot error:", error);
             usePlannerStore.setState({ isFirebaseConnected: false });
        });

    } else {
        // User logged out
        if (firestoreUnsubscribe) firestoreUnsubscribe();
        currentUser = null;
        usePlannerStore.setState({ isFirebaseConnected: false });
        // Load data from localStorage
        syncFromLocalStorage();
    }
});


export { usePlannerStore };
