// Configuración e inicialización de Firebase
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJKKlYrhycigYgqGY5vJEtteElK7fZQyc",
  authDomain: "juegayaprende-d8758.firebaseapp.com",
  projectId: "juegayaprende-d8758",
  storageBucket: "juegayaprende-d8758.firebasestorage.app",
  messagingSenderId: "295039486267",
  appId: "1:295039486267:web:7d0387e6037060dda78f1e",
  measurementId: "G-91ZCVWV5W1"
};

// Inicializar la aplicación de Firebase
export const app = initializeApp(firebaseConfig);

// Servicio de Autenticación
export const auth = getAuth(app);

// Servicio de Base de Datos Cloud Firestore
export const db = getFirestore(app);

// Proveedor de Google
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Proveedor de Microsoft (Hotmail / Outlook)
export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({ prompt: 'select_account' });

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs
};
