import { initializeApp, getApps, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const app: App = getApps().length > 0 ? getApps()[0] : initializeApp();

export const adminAuth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const defaultBucket = storage.bucket();
