import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import HistoryModal from '../components/HistoryModal';
import './MainMenu.css';

function MainMenu({ onNavigate }) {
  const { user, logout, getProgress } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [startLevel, setStartLevel] = useState(0);

  useEffect(() => {
    if (getProgress) {
      getProgress().then(list => {
        if (list && list.length > 0) {
          const maxLevel = Math.max(...list.map(p => Number(p.highest_level) || 0));
          if (maxLevel > 0) {
            setStartLevel(Math.min(maxLevel, 18));
          }
        }
      }).catch(() => {});
    }
  }, [isHistoryOpen, user]);

  return (
    <div className="main-menu">
      {/* Barra superior de usuario / autenticación */}
      <div style={{
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        marginBottom: '0.5rem',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Botón de Historial (disponible para todos) */}
        <button
          onClick={() => setIsHistoryOpen(true)}
          style={{
            background: 'white',
            color: 'var(--tropical-green)',
            border: '2px solid var(--tropical-green)',
            padding: '8px 16px',
            borderRadius: '50px',
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          📊 Mi Historial y Retos
        </button>

        {user ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'white',
            padding: '6px 14px',
            borderRadius: '50px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '2px solid var(--sun-yellow)'
          }}>
            <span style={{ fontWeight: 'bold', color: 'var(--panama-blue)', fontSize: '0.95rem' }}>
              🐭 ¡Hola, {user.fullName || user.username}!
            </span>
            <button
              onClick={logout}
              style={{
                background: '#fee2e2',
                color: '#b91c1c',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              title="Cerrar sesión"
            >
              Salir 🚪
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 'bold', background: '#f1f5f9', padding: '6px 12px', borderRadius: '20px' }}>
              🎮 Modo Libre
            </span>
            <button
              onClick={() => setIsAuthOpen(true)}
              style={{
                background: 'white',
                color: 'var(--panama-blue)',
                border: '2px solid var(--panama-blue)',
                padding: '8px 16px',
                borderRadius: '50px',
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🔐 Iniciar Sesión / Registro
            </button>
          </div>
        )}
      </div>

      <header className="menu-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/logo.png" alt="Juega y Aprende" className="main-logo animate-bounce" style={{ maxWidth: '340px', width: '90%', height: 'auto', marginBottom: '1rem' }} />
        <p className="subtitle">¡Aprende a usar la computadora jugando!</p>

      </header>

      <div className="games-grid">
        <div className="game-card active">
          <div className="card-icon">🖱️</div>
          <h2>Aventura del Mouse</h2>
          <p>Elige tu nivel inicial y dificultad:</p>
          <div style={{ margin: '1rem 0' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Nivel de Inicio:</label>
            <select 
              id="startLevelSelect" 
              value={startLevel}
              onChange={(e) => setStartLevel(parseInt(e.target.value))}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '2px solid var(--ocean-cyan)', fontSize: '1.1rem', fontFamily: 'var(--font-heading)', cursor: 'pointer' }}
            >
              {[...Array(19)].map((_, i) => (
                <option key={i} value={i}>Reto {i + 1}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn-primary" onClick={() => onNavigate('mouse-game', 1, startLevel)}>🟢 Dificultad Fácil</button>
            <button className="btn-primary" onClick={() => onNavigate('mouse-game', 2, startLevel)} style={{ background: 'var(--panama-blue)' }}>🟡 Dificultad Media</button>
            <button className="btn-primary" onClick={() => onNavigate('mouse-game', 3, startLevel)} style={{ background: 'var(--panama-red)' }}>🔴 Dificultad Difícil</button>
          </div>
        </div>
        
        <div className="game-card locked">
          <div className="card-icon">⌨️</div>
          <h2>Misterio del Teclado</h2>
          <p>Próximamente...</p>
          <button className="btn-locked" disabled>Bloqueado</button>
        </div>
      </div>

      {/* Modal de autenticación */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Modal de historial de actividades */}
      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        onOpenAuth={() => setIsAuthOpen(true)}
        onContinueLevel={(diff, level) => onNavigate('mouse-game', diff, level)}
      />
    </div>
  );
}

export default MainMenu;
