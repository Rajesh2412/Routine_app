'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBwQO2j28zWCMpA0s-945NoiA1LvrXQP1U",
    authDomain: "rajesh-routine-a20c3.firebaseapp.com",
    projectId: "rajesh-routine-a20c3",
    storageBucket: "rajesh-routine-a20c3.appspot.com",
    messagingSenderId: "1050736185289",
    appId: "1:1050736185289:web:1d18227f4c7a8b542c3243"
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
