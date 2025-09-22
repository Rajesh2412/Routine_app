'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-360945248-2435a',
  appId: '1:866067498857:web:81683caf827cd5e8e35ff8',
  apiKey: 'AIzaSyAd1m5K6Uy_Y4cd0dAesns3iuY_wtikQ3E',
  authDomain: 'studio-360945248-2435a.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '866067498857',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time.
    // ...
  } else if (err.code == 'unimplemented') {
    // The current browser does not support all of the features required to enable persistence
    // ...
  }
});


export { db };
