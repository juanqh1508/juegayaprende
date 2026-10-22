import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  microsoftProvider, 
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
} from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Escuchar el estado de autenticación en tiempo real con Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Intentar obtener datos extra guardados en Firestore (como el nombre personalizado)
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};

          setUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: userData.username || firebaseUser.email?.split('@')[0] || 'usuario',
            fullName: userData.fullName || firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            avatarUrl: firebaseUser.photoURL
          });
        } catch (err) {
          // Si Firestore aún no tiene reglas o hay error de red, usamos los datos directos de Auth
          setUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: firebaseUser.email?.split('@')[0] || 'usuario',
            fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Estudiante',
            avatarUrl: firebaseUser.photoURL
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 1. Iniciar sesión con Correo y Contraseña
  const login = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      return { success: true, user: cred.user };
    } catch (err) {
      let msg = 'Error al iniciar sesión.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Correo o contraseña incorrectos.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'El formato del correo electrónico no es válido.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Demasiados intentos fallidos. Intenta más tarde.';
      }
      return { success: false, error: msg };
    }
  };

  // 2. Registrarse con Correo y Contraseña
  const register = async ({ email, password, fullName, username }) => {
    try {
      const cleanEmail = email.trim();
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const displayName = fullName || username || cleanEmail.split('@')[0];

      // Actualizar el nombre en Firebase Auth
      await updateProfile(cred.user, { displayName });

      // Guardar información extendida en Cloud Firestore
      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          email: cleanEmail,
          fullName: displayName,
          username: username || cleanEmail.split('@')[0],
          authProvider: 'password',
          createdAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('Nota: Perfil guardado en Auth (Firestore pendiente de reglas):', e);
      }

      return { success: true, user: cred.user };
    } catch (err) {
      let msg = 'Error al crear la cuenta.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'Este correo electrónico ya está registrado. Inicia sesión.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'El correo electrónico no es válido.';
      }
      return { success: false, error: msg };
    }
  };

  // 3. Iniciar sesión con Google (Ventana emergente oficial)
  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      
      // Guardar/Actualizar en Cloud Firestore
      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          email: cred.user.email,
          fullName: cred.user.displayName,
          avatarUrl: cred.user.photoURL,
          authProvider: 'google',
          lastLogin: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('Nota: Sesión iniciada con Google:', e);
      }

      return { success: true, user: cred.user };
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Inicio de sesión con Google cancelado.' };
      }
      return { success: false, error: err.message };
    }
  };

  // 4. Iniciar sesión con Microsoft (Hotmail / Outlook)
  const loginWithMicrosoft = async () => {
    try {
      const cred = await signInWithPopup(auth, microsoftProvider);

      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          email: cred.user.email,
          fullName: cred.user.displayName,
          authProvider: 'microsoft',
          lastLogin: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('Nota: Sesión iniciada con Microsoft:', e);
      }

      return { success: true, user: cred.user };
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Inicio de sesión con Microsoft cancelado.' };
      }
      return { success: false, error: err.message };
    }
  };

  // 5. Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // 6. Guardar progreso de lecciones en Cloud Firestore
  const saveProgress = async (progressData) => {
    if (!auth.currentUser) return null;
    const uid = auth.currentUser.uid;
    const docId = `${uid}_${progressData.gameKey}_${progressData.difficulty}`;

    try {
      const docRef = doc(db, 'progress', docId);
      const existingSnap = await getDoc(docRef);
      const prevLevel = existingSnap.exists() ? (existingSnap.data().highest_level || 0) : 0;
      const prevCompleted = existingSnap.exists() ? existingSnap.data().completed : false;

      const dataToSave = {
        user_id: uid,
        game_key: progressData.gameKey,
        difficulty: progressData.difficulty,
        highest_level: Math.max(prevLevel, progressData.level || 0),
        completed: prevCompleted || !!progressData.completed,
        certificate_name: progressData.certificateName || existingSnap.data()?.certificate_name || null,
        updated_at: new Date().toISOString()
      };

      await setDoc(docRef, dataToSave, { merge: true });
      return dataToSave;
    } catch (err) {
      console.warn('Aviso: No se pudo sincronizar progreso en Firestore:', err);
      return null;
    }
  };

  // 7. Obtener historial de lecciones desde Cloud Firestore
  const getProgress = async () => {
    if (!auth.currentUser) return [];
    try {
      const q = query(collection(db, 'progress'), where('user_id', '==', auth.currentUser.uid));
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data());
    } catch (err) {
      console.warn('Aviso: No se pudo obtener historial de Firestore:', err);
      return [];
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      loginWithGoogle,
      loginWithMicrosoft,
      logout,
      saveProgress,
      getProgress
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
