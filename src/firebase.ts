
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyD7r6dqjJqfvl-SumQXAlxsAe46FHmOMUY",
    authDomain: "artvibe-eca4e.firebaseapp.com",
    projectId: "artvibe-eca4e",
    storageBucket: "artvibe-eca4e.firebasestorage.app",
    messagingSenderId: "71050644047",
    appId: "1:71050644047:web:ae96ae454102a4c51c383a",
    measurementId: "G-PLZLPTZ3SH"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export the Firebase services you'll need
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;