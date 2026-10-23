import React, { useState, useEffect } from 'react';
import { useAuth, getLastSession } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import HistoryModal from '../components/HistoryModal';
import AdventureCircuit, { getLevelDetails } from '../components/AdventureCircuit';
import { sounds } from '../utils/sounds';
import './MainMenu.css';

function MainMenu({ onNavigate }) {
  const { user, logout, getProgress } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [difficulty, setDifficulty] = useState(() => {
    const s = getLastSession();
    return s?.difficulty ? Number(s.difficulty) : 1;
  });
  const [currentLevel, setCurrentLevel] = useState(() => {
    const s = getLastSession();
    return s?.level !== undefined ? Number(s.level) + 1 : 1;
  });
  const [highestCompleted, setHighestCompleted] = useState(0);

  useEffect(() => {
    if (getProgress) {
      getProgress().then(list => {
        const session = getLastSession();
        if (list && list.length > 0) {
          const maxLevel = Math.max(...list.map(p => Number(p.highest_level) || 0));
          setHighestCompleted(maxLevel);
          if (maxLevel > 0) {
            setCurrentLevel(Math.min(maxLevel + 1, 19));
          }
        } else if (session?.level !== undefined) {
          setCurrentLevel(Math.min(Number(session.level) + 1, 19));
        }
        if (session?.difficulty) {
          setDifficulty(Number(session.difficulty));
        }
      }).catch(() => {});
    }
  }, [isHistoryOpen, user]);

  const activeLevelInfo = getLevelDetails(currentLevel);

  return (
    <div className="main-menu">
      {/* Barra superior de usuario / autenticación */}
      <div className="main-top-bar">
        <button
          onClick={() => { sounds.click(); setIsHistoryOpen(true); }}
          className="btn-history-top"
        >
          📊 Mi Historial y Retos
        </button>

        {user ? (
          <div className="user-profile-badge">
            <span style={{ fontWeight: 'bold', color: 'var(--panama-blue)', fontSize: '0.95rem' }}>
              🐭 ¡Hola, {user.fullName || user.username}!
            </span>
            <button
              onClick={() => { sounds.click(); logout(); }}
              className="btn-logout"
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
              onClick={() => { sounds.click(); setIsAuthOpen(true); }}
              className="btn-login-top"
            >
              🔐 Iniciar Sesión / Registro
            </button>
          </div>
        )}
      </div>

      <header className="menu-header">
        <img src="/logo.png" alt="Juega y Aprende" className="main-logo animate-bounce" style={{ maxWidth: '340px', width: '90%', height: 'auto', marginBottom: '0.5rem' }} />
        <p className="subtitle">¡Aprende a usar la computadora jugando!</p>
      </header>

      {/* Hero Banner: Continuar desde donde se quedó */}
      {highestCompleted > 0 && (
        <div className="resume-hero-banner">
          <div className="resume-hero-left">
            <span className="resume-hero-mouse">🐭</span>
            <div>
              <div className="resume-hero-badge">Progreso Guardado</div>
              <h3 className="resume-hero-title">
                Te quedaste en el Reto {currentLevel}: {activeLevelInfo.name} {activeLevelInfo.icon}
              </h3>
              <p className="resume-hero-sub">
                Dificultad: {difficulty === 1 ? '🟢 Fácil' : (difficulty === 2 ? '🟡 Media' : '🔴 Difícil')} • {highestCompleted} de 19 retos superados
              </p>
            </div>
          </div>
          <button 
            type="button"
            className="btn-resume-hero"
            onClick={() => {
              sounds.click();
              onNavigate('mouse-game', difficulty, currentLevel - 1);
            }}
          >
            🚀 ¡Continuar Jugando!
          </button>
        </div>
      )}

      {/* CIRCUITO INTERACTIVO DE AVENTURA: El ratoncito se mueve por cada nivel */}
      <AdventureCircuit 
        currentLevel={currentLevel}
        difficulty={difficulty}
        onDifficultyChange={(newDiff) => setDifficulty(newDiff)}
        onSelectLevel={(levelIdx, diff) => onNavigate('mouse-game', diff, levelIdx)}
      />

      {/* Otras Actividades / Próximamente */}
      <div className="secondary-games-row">
        <div className="game-card locked">
          <div className="card-icon">⌨️</div>
          <h2>Misterio del Teclado</h2>
          <p>Próximamente nuevas aventuras para dominar el teclado...</p>
          <button className="btn-locked" disabled>🔒 Próximamente</button>
        </div>
      </div>

      {/* Modales */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
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
