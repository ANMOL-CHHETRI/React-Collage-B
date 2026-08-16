import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Development and deployment diagnostic (safe boolean flags, no sensitive secrets printed)
const hasApiKey = Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined")
const hasAuthDomain = Boolean(firebaseConfig.authDomain && firebaseConfig.authDomain !== "undefined")
const hasProjectId = Boolean(firebaseConfig.projectId && firebaseConfig.projectId !== "undefined")
const hasAppId = Boolean(firebaseConfig.appId && firebaseConfig.appId !== "undefined")

if (import.meta.env.DEV || !hasApiKey) {
  console.info("[Firebase Config Diagnostic]", {
    hasApiKey,
    hasAuthDomain,
    hasProjectId,
    hasAppId,
    hasStorageBucket: Boolean(firebaseConfig.storageBucket),
    hasMessagingSenderId: Boolean(firebaseConfig.messagingSenderId)
  })
}

let app = null
let auth = null
let db = null
let storage = null

if (hasApiKey && hasProjectId) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  } catch (err) {
    console.error("[Firebase Initialization Error]:", err)
  }
} else {
  console.warn(
    "[Firebase Warning]: Firebase API key or Project ID is not configured in build/runtime environment variables. " +
    "Firebase Auth and Firestore features require VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID."
  )
}

export { auth, db, storage }
export default app
