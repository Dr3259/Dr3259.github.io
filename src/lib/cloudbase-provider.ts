
"use client";

import type { DataProvider } from './data-provider';

// This is a placeholder for the Tencent CloudBase implementation.
// All functions are currently stubs and will be implemented later.

const notImplemented = () => {
    return Promise.reject(new Error("CloudBase provider not implemented yet."));
};

export const cloudbaseProvider: DataProvider = {
  onAuthStateChanged: () => {
    console.warn("CloudBase onAuthStateChanged not implemented.");
    // Return a no-op unsubscribe function
    return () => {};
  },

  login: (email, password) => {
    return notImplemented();
  },

  register: (email, password) => {
    return notImplemented();
  },

  logout: () => {
    return notImplemented();
  },

  saveData: (userId, data) => {
    return notImplemented();
  },

  getData: (userId) => {
    return Promise.resolve(null);
  },
  
  onDataSnapshot: (userId, callback) => {
    console.warn("CloudBase onDataSnapshot not implemented.");
     // Return a no-op unsubscribe function
    return () => {};
  },
};
