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

const LOCAL_STORAGE_KEY = 'plataforma_juegos_progress';
const LAST_SESSION_KEY = 'plataforma_juegos_last_session';

export function getLocalProgressList() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Error al leer progreso de localStorage:', e);
    return [];
  }
}

export function saveLocalProgressItem(item) {
  try {
    const list = getLocalProgressList();
    const existingIndex = list.findIndex(
      p => p.game_key === item.game_key && Number(p.difficulty) === Number(item.difficulty)
    );

    if (existingIndex >= 0) {
      const existing = list[existingIndex];
      list[existingIndex] = {
        ...existing,
        ...item,
        highest_level: Math.max(Number(existing.highest_level) || 0, Number(item.highest_level) || 0),
        completed: existing.completed || item.completed,
        certificate_name: item.certificate_name || existing.certificate_name || null,
        updated_at: new Date().toISOString()
      };
    } else {
      list.push({
        ...item,
        highest_level: Number(item.highest_level) || 0,
        completed: !!item.completed,
        updated_at: new Date().toISOString()
      });
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch (e) {
    console.warn('Error al guardar progreso en localStorage:', e);
    return [];
  }
}

export function getLastSession() {
  try {
    const raw = localStorage.getItem(LAST_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveLastSession(sessionData) {
  try {
    localStorage.setItem(LAST_SESSION_KEY, JSON.stringify({
      difficulty: Number(sessionData.difficulty) || 1,
      level: Number(sessionData.level) || 0,
      updated_at: new Date().toISOString()
    }));
  } catch (e) {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Escuchar el estado de autenticación en tiempo real con Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
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
          setUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: firebaseUser.email?.split('@')[0] || 'usuario',
            fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Estudiante',
            avatarUrl: firebaseUser.photoURL
          });
        }
        // Auto-sincronizar con Firestore
        getProgress();
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

      await updateProfile(cred.user, { displayName });

      try {
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          email: cleanEmail,
          fullName: displayName,
          username: username || cleanEmail.split('@')[0],
          authProvider: 'password',
          createdAt: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Nota: Usuario registrado con correo:', e);
      }

      return { success: true, user: cred.user };
    } catch (err) {
      let msg = 'Error al registrar usuario.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'Este correo electrónico ya está registrado. Por favor inicia sesión.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'El formato del correo electrónico no es válido.';
      }
      return { success: false, error: msg };
    }
  };

  // 3. Iniciar sesión con Google
  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);

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

  // 4. Iniciar sesión con Microsoft
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

  // 6. Guardar progreso de lecciones (Híbrido: SIEMPRE local + Firestore si hay sesión)
  const saveProgress = async (progressData) => {
    const gameKey = progressData.gameKey || 'mouse-game';
    const difficulty = Number(progressData.difficulty) || 1;
    const level = Number(progressData.level) || 0;
    const completed = !!progressData.completed;
    const certificateName = progressData.certificateName || null;

    // Actualizar última sesión
    saveLastSession({ difficulty, level });

    // 1. Guardar SIEMPRE en localStorage (inmune a fallos de red o falta de sesión)
    const localItem = {
      game_key: gameKey,
      difficulty,
      highest_level: level,
      completed,
      certificate_name: certificateName
    };
    saveLocalProgressItem(localItem);

    // 2. Si el usuario está autenticado con Firebase, sincronizar también en Cloud Firestore
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      const docId = `${uid}_${gameKey}_${difficulty}`;

      try {
        const docRef = doc(db, 'progress', docId);
        const existingSnap = await getDoc(docRef);
        const prevLevel = existingSnap.exists() ? (existingSnap.data().highest_level || 0) : 0;
        const prevCompleted = existingSnap.exists() ? existingSnap.data().completed : false;

        const dataToSave = {
          user_id: uid,
          game_key: gameKey,
          difficulty,
          highest_level: Math.max(prevLevel, level),
          completed: prevCompleted || completed,
          certificate_name: certificateName || existingSnap.data()?.certificate_name || null,
          updated_at: new Date().toISOString()
        };

        await setDoc(docRef, dataToSave, { merge: true });
        return dataToSave;
      } catch (err) {
        console.warn('Aviso: Guardado localmente. No se pudo sincronizar Firestore:', err);
      }
    }

    return localItem;
  };

  // 7. Obtener historial de lecciones (combina almacenamiento local y Cloud Firestore)
  const getProgress = async () => {
    let combined = getLocalProgressList();

    if (auth.currentUser) {
      try {
        const q = query(collection(db, 'progress'), where('user_id', '==', auth.currentUser.uid));
        const snap = await getDocs(q);
        const firestoreList = snap.docs.map(d => d.data());

        firestoreList.forEach(remoteItem => {
          const localIndex = combined.findIndex(
            p => p.game_key === remoteItem.game_key && Number(p.difficulty) === Number(remoteItem.difficulty)
          );

          if (localIndex >= 0) {
            const local = combined[localIndex];
            combined[localIndex] = {
              ...local,
              ...remoteItem,
              highest_level: Math.max(Number(local.highest_level) || 0, Number(remoteItem.highest_level) || 0),
              completed: local.completed || remoteItem.completed,
              certificate_name: remoteItem.certificate_name || local.certificate_name || null
            };
          } else {
            combined.push(remoteItem);
          }
        });

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(combined));

        for (const item of combined) {
          const docId = `${auth.currentUser.uid}_${item.game_key}_${item.difficulty}`;
          setDoc(doc(db, 'progress', docId), { ...item, user_id: auth.currentUser.uid }, { merge: true }).catch(() => {});
        }
      } catch (err) {
        console.warn('Aviso: Usando historial local (Firestore sin permisos o conexión):', err);
      }
    }

    return combined;
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
      getProgress,
      getLastSession,
      saveLastSession
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
