/**
 * Plantrix Botanics — Client Firebase SDK
 * Handles Firebase Authentication and client-side database interactions.
 * Safe for browser execution: never imports server or private key modules.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'plantrix-botanics',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
};

// Initialize Firebase App safely (singleton pattern)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

if (typeof window !== 'undefined' || isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn('[Firebase Client] Initialization deferred or unconfigured:', error);
  }
}

export { app, auth, db };

export async function loginWithEmail(email: string, pass: string): Promise<FirebaseUser | null> {
  if (!auth) throw new Error('Firebase Auth is not configured');
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  return credential.user;
}

export async function registerWithEmail(email: string, pass: string): Promise<FirebaseUser | null> {
  if (!auth) throw new Error('Firebase Auth is not configured');
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  return credential.user;
}

export async function loginWithGoogle(): Promise<FirebaseUser | null> {
  if (!auth) throw new Error('Firebase Auth is not configured');
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  return credential.user;
}

export async function logoutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export async function getClientAuthToken(): Promise<string | null> {
  if (!auth || !auth.currentUser) return null;
  return auth.currentUser.getIdToken();
}
