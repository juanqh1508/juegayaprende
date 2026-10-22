import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

function AuthModal({ isOpen, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, loginWithGoogle, loginWithMicrosoft } = useAuth();

  // Inicializar Google Identity Services si el script está listo
  useEffect(() => {
    if (isOpen && window.google && window.google.accounts) {
      try {
        const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
        if (googleClientId) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
          });
        }
      } catch (err) {
        console.warn('Google Identity no se pudo inicializar:', err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Manejar respuesta de Google
  const handleGoogleCredentialResponse = async (response) => {
    if (!response.credential) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await loginWithGoogle(response.credential);
      if (res.success) {
        setSuccessMsg(`¡Bienvenido, ${res.user.fullName || res.user.username}! 🎉`);
        setTimeout(() => onClose(), 800);
      } else {
        setErrorMsg(res.error || 'No se pudo iniciar sesión con Google.');
      }
    } catch (err) {
      setErrorMsg('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Click en el botón de Google
  const handleGoogleClick = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      setErrorMsg('Aún no has configurado VITE_GOOGLE_CLIENT_ID. Mientras tanto, puedes registrarte o entrar escribiendo tu correo de Google abajo.');
      return;
    }

    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setErrorMsg('Selecciona tu cuenta de Google en la ventana emergente o escribe tu correo abajo.');
        }
      });
    }
  };

  // Click en el botón de Microsoft (Hotmail / Outlook)
  const handleMicrosoftClick = () => {
    const msClientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
    if (!msClientId) {
      setErrorMsg('Aún no has configurado VITE_MICROSOFT_CLIENT_ID. Mientras tanto, puedes registrarte o entrar con tu correo de Hotmail/Outlook abajo.');
      return;
    }

    // Flujo OAuth Popup con Microsoft Identity
    const redirectUri = window.location.origin;
    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${msClientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email%20User.Read`;
    
    const popup = window.open(authUrl, 'Microsoft Login', 'width=500,height=600');
    
    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        return;
      }
      try {
        if (popup.location.href.includes(redirectUri)) {
          const hash = popup.location.hash;
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          popup.close();
          clearInterval(checkPopup);

          if (accessToken) {
            setLoading(true);
            loginWithMicrosoft(accessToken).then((res) => {
              setLoading(false);
              if (res.success) {
                setSuccessMsg(`¡Bienvenido, ${res.user.fullName || res.user.username}! 🎮`);
                setTimeout(() => onClose(), 800);
              } else {
                setErrorMsg(res.error || 'No se pudo iniciar sesión con Microsoft.');
              }
            });
          }
        }
      } catch (e) {
        // Ignora errores de Cross-Origin hasta que regrese al mismo dominio
      }
    }, 500);
  };

  // Envío del formulario tradicional con cualquier correo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await register({
          email: emailOrUser.includes('@') ? emailOrUser.trim() : null,
          username: username.trim() || (emailOrUser.includes('@') ? '' : emailOrUser.trim()),
          password,
          fullName: fullName.trim()
        });

        if (res.success) {
          setSuccessMsg('¡Cuenta creada exitosamente! Bienvenido 🎉');
          setTimeout(() => onClose(), 1000);
        } else {
          setErrorMsg(res.error || 'No se pudo crear la cuenta.');
        }
      } else {
        const res = await login(emailOrUser, password);

        if (res.success) {
          setSuccessMsg('¡Bienvenido de nuevo! 🎮');
          setTimeout(() => onClose(), 800);
        } else {
          setErrorMsg(res.error || 'Correo o contraseña incorrectos.');
        }
      }
    } catch (err) {
      setErrorMsg('Error de conexión con el servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} title="Cerrar">✖</button>

        <div className="auth-header">
          <div className="auth-icon-bubble">
            {isRegister ? '📝' : '🔐'}
          </div>
          <h2>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
          <p className="auth-subtitle">
            {isRegister 
              ? 'Guarda tus diplomas, retos superados y progreso en la plataforma' 
              : 'Accede con tu cuenta para continuar aprendiendo y jugando'}
          </p>
        </div>

        {/* Botones de inicio rápido con Google y Microsoft */}
        <div className="social-login-group">
          <button 
            type="button" 
            className="social-btn google-btn"
            onClick={handleGoogleClick}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continuar con Google
          </button>

          <button 
            type="button" 
            className="social-btn microsoft-btn"
            onClick={handleMicrosoftClick}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 23 23">
              <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
              <rect x="12" y="1" width="10" height="10" fill="#7FBA00"/>
              <rect x="1" y="12" width="10" height="10" fill="#00A4EF"/>
              <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
            </svg>
            Continuar con Hotmail / Outlook
          </button>
        </div>

        {/* Separador */}
        <div className="auth-divider">
          <span>o con cualquier correo</span>
        </div>

        {/* Pestañas para cambiar entre Login y Registro con correo */}
        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(false); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Iniciar Sesión
          </button>
          <button 
            type="button" 
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(true); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Crear Cuenta
          </button>
        </div>

        {errorMsg && (
          <div className="auth-alert error">
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="auth-alert success">
            ✅ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>📧 {isRegister ? 'Correo Electrónico (Hotmail, Gmail, etc.)' : 'Correo Electrónico o Usuario'}</label>
            <input 
              type={isRegister ? 'email' : 'text'}
              placeholder={isRegister ? 'ejemplo@hotmail.com o @gmail.com' : 'tu-correo@correo.com o tu usuario'} 
              value={emailOrUser}
              onChange={(e) => setEmailOrUser(e.target.value)}
              required 
            />
          </div>

          {isRegister && (
            <>
              <div className="form-group">
                <label>🎓 Nombre Completo (aparecerá en tus diplomas)</label>
                <input 
                  type="text" 
                  placeholder="Ej. Sofía Rodríguez" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>👤 Nombre de Usuario (Opcional)</label>
                <input 
                  type="text" 
                  placeholder="Ej. sofia_panama" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>🔑 Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="auth-submit-btn" 
            disabled={loading}
          >
            {loading ? 'Conectando con PostgreSQL...' : (isRegister ? 'Crear Cuenta 🚀' : 'Entrar a Jugar 🎮')}
          </button>

          <button 
            type="button" 
            className="auth-guest-btn" 
            onClick={onClose}
          >
            Continuar como invitado sin cuenta
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
