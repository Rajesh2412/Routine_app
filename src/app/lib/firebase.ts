'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-360945248-2435a',
  appId: '1:866067498857:web:81683caf827cd5e8e35ff8',
  apiKey: 'AIzaSyAd1m5K6Uy_Y4cd0dAesns3iuY_wtikQ3E',
  authDomain: 'studio-360945248-2435a.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '866067498857',
};

let dbPromise: Promise<Firestore> | null = null;

const initializeDb = (): Promise<Firestore> => {
    if (dbPromise) {
        return dbPromise;
    }

    dbPromise = new Promise((resolve, reject) => {
        try {
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
