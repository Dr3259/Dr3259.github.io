
"use client";

import type { User, UserCredential } from 'firebase/auth';
import type { PlannerData } from '@/hooks/usePlannerStore';
import { firebaseProvider } from './firebase-provider';
import { cloudbaseProvider } from './cloudbase-provider';

export interface DataProvider {
    onAuthStateChanged: (callback: (user: User | null) => void) => () => void;
    login: (email: string, password: string) => Promise<UserCredential>;
    register: (email: string, password: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
    saveData: (userId: string, data: Partial<PlannerData>) => Promise<void>;
    getData: (userId: string) => Promise<PlannerData | null>;
    onDataSnapshot: (userId: string, callback: (data: PlannerData | null) => void) => () => void;
}

// This function will determine which provider to use.
// For now, it defaults to Firebase. Later, it can be updated
// to check the environment or user's region.
const getActiveProvider = (): DataProvider => {
  // Example logic for the future:
  // if (process.env.NEXT_PUBLIC_DATA_PROVIDER === 'cloudbase') {
  //   return cloudbaseProvider;
  // }
  return firebaseProvider;
};

export const dataProvider = getActiveProvider();
