import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBbmGZ_MfS8Dgj6Rt58u1l7Oa7653HBVg4",
    authDomain: "website14-fb82e.firebaseapp.com",
    projectId: "website14-fb82e",
    storageBucket: "website14-fb82e.firebasestorage.app",
    messagingSenderId: "632727286029",
    appId: "1:632727286029:web:4a773a22d589fc34680044"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app; 