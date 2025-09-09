
"use client";

import { auth, db } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  type User 
} from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, type DocumentData } from 'firebase/firestore';
import type { DataProvider } from './data-provider';
import type { PlannerData } from '@/hooks/usePlannerStore';

const FIRESTORE_COLLECTION = 'plannerData';

export const firebaseProvider: DataProvider = {
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  login: (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  register: (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  },

  logout: () => {
    return firebaseSignOut(auth);
  },

  saveData: async (userId, data) => {
    const docRef = doc(db, FIRESTORE_COLLECTION, userId);
    await setDoc(docRef, data, { merge: true });
  },

  getData: async (userId) => {
    const docRef = doc(db, FIRESTORE_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as PlannerData) : null;
  },

  onDataSnapshot: (userId, callback) => {
    const docRef = doc(db, FIRESTORE_COLLECTION, userId);
    return onSnapshot(docRef, (docSnap) => {
      callback(docSnap.exists() ? (docSnap.data() as PlannerData) : null);
    });
  },
};
