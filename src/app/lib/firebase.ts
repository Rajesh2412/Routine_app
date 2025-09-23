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

let db: Firestore;
let dbPromise: Promise<Firestore>;

const initializeDb = () => {
  if (dbPromise) {
    return dbPromise;
  }
  
  dbPromise = new Promise((resolve, reject) => {
    try {
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      const firestore = getFirestore(app);

      enableIndexedDbPersistence(firestore)
        .then(() => {
          db = firestore;
          resolve(db);
        })
        .catch((err) => {
          if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time.
            // This is a normal scenario, so we can resolve with the existing instance.
            db = firestore;
            resolve(db);
          } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the features required to enable persistence
            console.warn("Firebase persistence not available in this browser.");
            db = firestore;
            resolve(db);
          } else {
            console.error("Error enabling Firebase persistence:", err);
            reject(err);
          }
        });
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      reject(error);
    }
  });
  
  return dbPromise;
};

export const getDb = async () => {
  if (db) {
    return db;
  }
  return initializeDb();
};
