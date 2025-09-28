'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDg2akIc404Y30V0NOyN6-P2VF3Nh-JtNU",
    authDomain: "rajesh-routine.firebaseapp.com",
    projectId: "rajesh-routine",
    storageBucket: "rajesh-routine.firebasestorage.app",
    messagingSenderId: "339576883523",
    appId: "1:339576883523:web:39eee513e6b0b7d07707f6",
    measurementId: "G-29074QT0T6"
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
