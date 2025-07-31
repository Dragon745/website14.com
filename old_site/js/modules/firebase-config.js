// Firebase Configuration Module
export const firebaseConfig = {
    apiKey: "AIzaSyBbmGZ_MfS8Dgj6Rt58u1l7Oa7653HBVg4",
    authDomain: "website14-fb82e.firebaseapp.com",
    projectId: "website14-fb82e",
    storageBucket: "website14-fb82e.firebasestorage.app",
    messagingSenderId: "632727286029",
    appId: "1:632727286029:web:4a773a22d589fc34680044"
};

// Initialize Firebase and export instances
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db }; 