'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

export { db };
