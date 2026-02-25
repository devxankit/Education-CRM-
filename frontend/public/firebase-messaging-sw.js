/* global importScripts, firebase */

// Basic Firebase Messaging service worker.
// This enables background push notifications in supported browsers.

importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

// TODO: Replace the placeholder values below with your actual Firebase config
// or inject them at build time. Leaving them as-is will disable background
// notifications but will not break the app.
firebase.initializeApp({
  apiKey: "AIzaSyC8JwEMD-jkljzzKqBsudUveri780DfaOc",
  authDomain: "neargud-cd346.firebaseapp.com",
  projectId: "neargud-cd346",
  storageBucket: "neargud-cd346.firebasestorage.app",
  messagingSenderId: "830806151719",
  appId: "1:830806151719:web:a06b49f83f3c3468b1f402",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification?.title || "New notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

