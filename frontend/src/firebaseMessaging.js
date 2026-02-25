// Firebase Web Push setup (browser-side)
// NOTE: Fill these Vite env variables from your Firebase project settings:
// VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID,
// VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID,
// VITE_FIREBASE_APP_ID, VITE_FIREBASE_VAPID_KEY

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let messaging;

export const initFirebaseMessaging = () => {
  if (!firebaseConfig.apiKey) {
    console.warn("Firebase config env vars not set; push notifications disabled.");
    return null;
  }
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
  return messaging;
};

export const requestFcmToken = async () => {
  try {
    if (!("Notification" in window)) return null;
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    if (!messaging) {
      initFirebaseMessaging();
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    const token = await getToken(messaging, vapidKey ? { vapidKey } : undefined);
    return token || null;
  } catch (err) {
    console.error("Error getting FCM token:", err);
    return null;
  }
};

export const subscribeToForegroundMessages = (callback) => {
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    callback?.(payload);
  });
};

