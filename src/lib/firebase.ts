// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "week-glance-2f196",
  appId: "1:982445141792:web:091ec2fb9fb11e19cf3145",
  storageBucket: "week-glance-2f196.firebasestorage.app",
  apiKey: "AIzaSyB1wLU3_XTYoAw1Qkaw-tHUNMACHCGYUpw",
  authDomain: "week-glance-2f196.firebaseapp.com",
  messagingSenderId: "982445141792",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// 设置认证持久化 - 用户登录状态会保存在 localStorage 中
// 这意味着用户关闭浏览器后重新打开，登录状态仍然保持
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error('设置认证持久化失败:', error);
  });
}

export default app;
