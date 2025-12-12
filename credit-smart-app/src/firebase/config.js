import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCA1E_16W7whxlLrw79JlSqFCGSlDvrglg",
  authDomain: "credismart-emanuel.firebaseapp.com",
  projectId: "credismart-emanuel",
  storageBucket: "credismart-emanuel.firebasestorage.app",
  messagingSenderId: "779865859938",
  appId: "1:779865859938:web:a45c9c1b8185053e7dee3b"
};

// Inicializamos app
const app = initializeApp(firebaseConfig);

// Exportamos el db
export const db = getFirestore(app);
