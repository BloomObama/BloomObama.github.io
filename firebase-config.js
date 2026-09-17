// Firebase web configuration is intentionally separate from the auth logic.
// Replace the placeholders with the values from Firebase Console → Project settings → Your apps.
// These identifiers are public client configuration, not account passwords or service-account secrets.
globalThis.FullRideFirebaseConfig = Object.freeze({
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID"
});
