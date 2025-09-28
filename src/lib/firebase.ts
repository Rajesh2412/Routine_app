'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

let dbPromise: Promise<Firestore> | null = null;

const initializeDb = (): Promise<Firestore> => {
    if (dbPromise) {
        return dbPromise;
    }

    dbPromise = new Promise((resolve, reject) => {
        try {
            // Check if all firebase config values are present
            if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.storageBucket || !firebaseConfig.messagingSenderId || !firebaseConfig.appId) {
                console.error("Firebase config is missing. Make sure all environment variables are set.");
                reject(new Error("Firebase config is missing."));
                return;
            }

            const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
            const firestore = getFirestore(app);

            enableIndexedDbPersistence(firestore)
                .then(() => {
                    resolve(firestore);
                })
                .catch((err) => {
                    if (err.code == 'failed-precondition' || err.code == 'unimplemented') {
                        // Persistence failed, but we can still use Firestore online.
                        // This is a normal scenario in some browser environments (e.g., multiple tabs).
                        if (err.code == 'unimplemented') {
                             console.warn("Firebase persistence not available in this browser.");
                        }
                        resolve(firestore);
                    } else {
                        console.error("Error enabling Firebase persistence:", err);
                        reject(err);
                    }
                });
        } catch (error) {
            console.error("Error initializing Firebase:", error);
            dbPromise = null; // Reset promise on error
            reject(error);
        }
    });

    return dbPromise;
};

export const getDb = (): Promise<Firestore> => {
  return initializeDb();
};
