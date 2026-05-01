// firebase.js
import admin from "firebase-admin";

let firebaseAdmin = null;

try {
  if (process.env.FIREBASE_CREDENTIALS) {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_CREDENTIALS, "base64").toString("utf8")
    );

    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("🔥 Firebase Admin Initialized");
  } else {
    console.warn("⚠️ FIREBASE_CREDENTIALS not found in environment variables.");
  }
} catch (error) {
  console.error("❌ Firebase Initialization Error:", error.message);
}

export default firebaseAdmin;
