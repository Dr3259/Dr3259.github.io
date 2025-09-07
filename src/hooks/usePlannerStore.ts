
"use client";

import { create } from 'zustand';
import type { TodoItem, MeetingNoteItem, ShareLinkItem, ReflectionItem, RatingType } from '@/lib/page-types';
import { doc, setDoc, getDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
// 移除 immer 依赖，使用原生 JavaScript 进行状态更新

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
            console.log(`正在更新 Firestore 字段 ${field}:`, data);
            const docRef = doc(db, FIRESTORE_COLLECTION, currentUser.uid);
            await setDoc(docRef, { [field]: data }, { merge: true });
            console.log(`成功更新 Firestore 字段 ${field}`);
        } catch (error) {
            console.error(`Error updating field ${field} in Firestore:`, error);
        }
    } else {
        console.log(`用户未登录，跳过 Firestore 更新字段 ${field}`);
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
        const currentState = get();
        const newAllTodos = {
            ...currentState.allTodos,
            [dateKey]: {
                ...currentState.allTodos[dateKey],
                [hourSlot]: todos
            }
        };
        set({ allTodos: newAllTodos });
        updateFirestore('allTodos', newAllTodos);
    },
    setMeetingNotesForSlot: (dateKey, hourSlot, notes) => {
        const currentState = get();
        const newAllMeetingNotes = {
            ...currentState.allMeetingNotes,
            [dateKey]: {
                ...currentState.allMeetingNotes[dateKey],
                [hourSlot]: notes
            }
        };
        set({ allMeetingNotes: newAllMeetingNotes });
        updateFirestore('allMeetingNotes', newAllMeetingNotes);
    },
    setShareLinksForSlot: (dateKey, hourSlot, links) => {
        const currentState = get();
        const newAllShareLinks = {
            ...currentState.allShareLinks,
            [dateKey]: {
                ...currentState.allShareLinks[dateKey],
                [hourSlot]: links
            }
        };
        set({ allShareLinks: newAllShareLinks });
        updateFirestore('allShareLinks', newAllShareLinks);
    },
    setReflectionsForSlot: (dateKey, hourSlot, reflections) => {
        const currentState = get();
        const newAllReflections = {
            ...currentState.allReflections,
            [dateKey]: {
                ...currentState.allReflections[dateKey],
                [hourSlot]: reflections
            }
        };
        set({ allReflections: newAllReflections });
        updateFirestore('allReflections', newAllReflections);
    },
    setDailyNote: (dateKey, note) => {
        const currentState = get();
        const newAllDailyNotes = {
            ...currentState.allDailyNotes,
            [dateKey]: note
        };
        set({ allDailyNotes: newAllDailyNotes });
        updateFirestore('allDailyNotes', newAllDailyNotes);
    },
    setRating: (dateKey, rating) => {
        const currentState = get();
        const newAllRatings = {
            ...currentState.allRatings,
            [dateKey]: rating
        };
        set({ allRatings: newAllRatings });
        updateFirestore('allRatings', newAllRatings);
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
    // 更智能的合并策略：保留本地和远程的数据
    const mergedData: PlannerData = {
        allTodos: { ...localData.allTodos, ...remoteData.allTodos },
        allMeetingNotes: { ...localData.allMeetingNotes, ...remoteData.allMeetingNotes },
        allShareLinks: { ...localData.allShareLinks, ...remoteData.allShareLinks },
        allReflections: { ...localData.allReflections, ...remoteData.allReflections },
        allDailyNotes: { ...localData.allDailyNotes, ...remoteData.allDailyNotes },
        allRatings: { ...localData.allRatings, ...remoteData.allRatings },
        lastTodoMigrationDate: remoteData.lastTodoMigrationDate || localData.lastTodoMigrationDate,
    };
    
    console.log('合并数据:', { localData, remoteData, mergedData });
    
    // Update the store with the merged data
    usePlannerStore.getState()._setStore(mergedData);

    // Write the merged data back to Firestore to ensure consistency
    if (currentUser) {
        try {
            const docRef = doc(db, FIRESTORE_COLLECTION, currentUser.uid);
            await setDoc(docRef, mergedData);
            console.log('数据已同步到 Firestore');
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
