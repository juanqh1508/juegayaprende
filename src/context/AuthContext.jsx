import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('game_auth_token') || null);
  const [loading, setLoading] = useState(true);

  // Verificar token guardado al cargar la aplicación
  useEffect(() => {
    async function verifyUser() {
      const storedToken = localStorage.getItem('game_auth_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem('game_auth_token');
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.warn('No se pudo contactar al servidor de autenticación:', err);
      } finally {
        setLoading(false);
      }
    }

    verifyUser();
  }, []);

  // Iniciar sesión con Correo o Usuario + Contraseña
  const login = async (identifier, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      localStorage.setItem('game_auth_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Registrar nueva cuenta con correo
  const register = async ({ email, username, password, fullName }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, fullName })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      localStorage.setItem('game_auth_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Iniciar sesión con Google (recibe el token/credential de Google)
  const loginWithGoogle = async (credential) => {
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al autenticar con Google');
      }

      localStorage.setItem('game_auth_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Iniciar sesión con Microsoft / Hotmail / Outlook
  const loginWithMicrosoft = async (accessToken) => {
    try {
      const response = await fetch('/api/auth/microsoft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al autenticar con Microsoft');
      }

      localStorage.setItem('game_auth_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('game_auth_token');
    setToken(null);
    setUser(null);
  };

  // Guardar progreso del juego en PostgreSQL
  const saveProgress = async (progressData) => {
    if (!token) return null;
    try {
      const response = await fetch('/api/auth/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(progressData)
      });
      return await response.json();
    } catch (err) {
      console.error('Error al sincronizar progreso con PostgreSQL:', err);
      return null;
    }
  };

  // Obtener historial de progreso del usuario desde PostgreSQL
  const getProgress = async () => {
    if (!token) return [];
    try {
      const response = await fetch('/api/auth/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.progress || [];
      }
      return [];
    } catch (err) {
      console.error('Error al consultar historial en PostgreSQL:', err);
      return [];
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
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
