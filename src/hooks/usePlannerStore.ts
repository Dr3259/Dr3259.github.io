
"use client";

import { create } from 'zustand';
import type { TodoItem, MeetingNoteItem, ShareLinkItem, ReflectionItem, RatingType } from '@/lib/page-types';
import { doc, setDoc, getDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { produce } from 'immer';

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
    isFirebaseConnected: boolean;
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
}

const LOCAL_STORAGE_PLANNER_KEY = 'weekglance_planner_data_v3';
const FIRESTORE_COLLECTION = 'plannerData';

let firestoreUnsubscribe: (() => void) | null = null;
let currentUser: User | null = null;

// Function to update Firestore with a specific part of the state
const updateFirestore = async (field: keyof PlannerData, data: any) => {
    if (currentUser) {
        try {
            const docRef = doc(db, FIRESTORE_COLLECTION, currentUser.uid);
            await setDoc(docRef, { [field]: data }, { merge: true });
        } catch (error) {
            console.error(`Error updating field ${field} in Firestore:`, error);
        }
    }
};

const usePlannerStore = create<PlannerState>()((set, get) => ({
    allTodos: {},
    allMeetingNotes: {},
    allShareLinks: {},
    allReflections: {},
    allDailyNotes: {},
    allRatings: {},
    lastTodoMigrationDate: null,
    isFirebaseConnected: false,

    _setStore: (data) => set(data),

    setTodosForSlot: (dateKey, hourSlot, todos) => {
        const newState = produce(get(), draft => {
            if (!draft.allTodos[dateKey]) draft.allTodos[dateKey] = {};
            draft.allTodos[dateKey][hourSlot] = todos;
        });
        set(newState);
        updateFirestore('allTodos', newState.allTodos);
    },
    setMeetingNotesForSlot: (dateKey, hourSlot, notes) => {
        const newState = produce(get(), draft => {
            if (!draft.allMeetingNotes[dateKey]) draft.allMeetingNotes[dateKey] = {};
            draft.allMeetingNotes[dateKey][hourSlot] = notes;
        });
        set(newState);
        updateFirestore('allMeetingNotes', newState.allMeetingNotes);
    },
    setShareLinksForSlot: (dateKey, hourSlot, links) => {
        const newState = produce(get(), draft => {
            if (!draft.allShareLinks[dateKey]) draft.allShareLinks[dateKey] = {};
            draft.allShareLinks[dateKey][hourSlot] = links;
        });
        set(newState);
        updateFirestore('allShareLinks', newState.allShareLinks);
    },
    setReflectionsForSlot: (dateKey, hourSlot, reflections) => {
        const newState = produce(get(), draft => {
            if (!draft.allReflections[dateKey]) draft.allReflections[dateKey] = {};
            draft.allReflections[dateKey][hourSlot] = reflections;
        });
        set(newState);
        updateFirestore('allReflections', newState.allReflections);
    },
    setDailyNote: (dateKey, note) => {
        const newState = produce(get(), draft => {
            draft.allDailyNotes[dateKey] = note;
        });
        set(newState);
        updateFirestore('allDailyNotes', newState.allDailyNotes);
    },
    setRating: (dateKey, rating) => {
        const newState = produce(get(), draft => {
            draft.allRatings[dateKey] = rating;
        });
        set(newState);
        updateFirestore('allRatings', newState.allRatings);
    },
    setLastTodoMigrationDate: (date) => {
        set({ lastTodoMigrationDate: date });
        updateFirestore('lastTodoMigrationDate', date);
    },
    addTodo: (dateKey, hourSlot, todo) => {
        const newTodo = { ...todo, id: Date.now().toString() };
        get().setTodosForSlot(dateKey, hourSlot, [...(get().allTodos[dateKey]?.[hourSlot] || []), newTodo]);
    },
    addShareLink: (dateKey, hourSlot, link) => {
        get().setShareLinksForSlot(dateKey, hourSlot, [...(get().allShareLinks[dateKey]?.[hourSlot] || []), link]);
    },
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
            updateFirestore('allTodos', newState.allTodos);
            updateFirestore('lastTodoMigrationDate', newState.lastTodoMigrationDate);
        } else {
            get().setLastTodoMigrationDate(today);
        }
        return unfinishedTodos.length;
    },
    clearAllPlannerData: () => {
        const emptyState: PlannerData = {
            allTodos: {}, allMeetingNotes: {}, allShareLinks: {},
            allReflections: {}, allDailyNotes: {}, allRatings: {},
            lastTodoMigrationDate: get().lastTodoMigrationDate
        };
        set(emptyState);
        if (currentUser) {
            const docRef = doc(db, FIRESTORE_COLLECTION, currentUser.uid);
            setDoc(docRef, emptyState).catch(error => {
                console.error("Error clearing Firestore data:", error);
            });
        }
    },
}));

const syncFromLocalStorage = () => {
    try {
        const dataString = localStorage.getItem(LOCAL_STORAGE_PLANNER_KEY);
        if (dataString) {
            const { state } = JSON.parse(dataString);
            if (state) {
                usePlannerStore.getState()._setStore(state);
            }
        }
    } catch (e) {
        console.error("Failed to parse local storage data:", e);
    }
};

const mergeAndSyncData = async (localData: PlannerData, remoteData: PlannerData) => {
    // A simple merge: remote data takes precedence. A more complex strategy could be implemented here.
    const mergedData = { ...localData, ...remoteData };
    
    // Update the store with the merged data
    usePlannerStore.getState()._setStore(mergedData);

    // Write the merged data back to Firestore to ensure consistency
    if (currentUser) {
        try {
            const docRef = doc(db, FIRESTORE_COLLECTION, currentUser.uid);
            await setDoc(docRef, mergedData);
        } catch (error) {
            console.error("Error syncing merged data to Firestore:", error);
        }
    }
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User logged in
        if (firestoreUnsubscribe) firestoreUnsubscribe();
        currentUser = user;

        const docRef = doc(db, FIRESTORE_COLLECTION, user.uid);
        
        firestoreUnsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const firestoreData = docSnap.data() as PlannerData;
                // Directly set the store state from Firestore
                usePlannerStore.getState()._setStore(firestoreData);
            } else {
                // If no remote data, check for local data and upload it on first login.
                const dataString = localStorage.getItem(LOCAL_STORAGE_PLANNER_KEY);
                if (dataString) {
                    const { state: localData } = JSON.parse(dataString);
                    if (localData) {
                        setDoc(docRef, localData).then(() => {
                           localStorage.removeItem(LOCAL_STORAGE_PLANNER_KEY);
                        });
                    }
                }
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
        usePlannerStore.setState({
            isFirebaseConnected: false,
            allTodos: {}, allMeetingNotes: {}, allShareLinks: {},
            allReflections: {}, allDailyNotes: {}, allRatings: {},
            lastTodoMigrationDate: null,
        });
        syncFromLocalStorage();
    }
});


export { usePlannerStore };
