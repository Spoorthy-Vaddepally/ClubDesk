// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDLC9eI0j9xZ9y1YvNlBB0gl7wtuHaPrN0",
  authDomain: "club-desk.firebaseapp.com",
  projectId: "club-desk",
  storageBucket: "club-desk.firebasestorage.app",
  messagingSenderId: "114822232141",
  appId: "1:114822232141:web:f538926896c05d96df8404"
};
const app = initializeApp(firebaseConfig);
export { app };
export const auth = getAuth(app);
export const db = getFirestore(app);
