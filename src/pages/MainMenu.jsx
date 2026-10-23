import React, { useState, useEffect } from 'react';
import { useAuth, getLastSession } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import HistoryModal from '../components/HistoryModal';
import AdventureCircuit, { getLevelDetails } from '../components/AdventureCircuit';
import { sounds } from '../utils/sounds';
import './MainMenu.css';

function MainMenu({ onNavigate, initialView = 'cards' }) {
  const { user, logout, getProgress } = useAuth();
  const [menuView, setMenuView] = useState(initialView); // 'cards' o 'circuit'
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
    if (initialView) {
      setMenuView(initialView);
    }
  }, [initialView]);

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
        {menuView === 'circuit' ? (
          <button
            onClick={() => { sounds.click(); setMenuView('cards'); }}
            className="btn-back-menu"
          >
            ⬅ Volver a Juegos
          </button>
        ) : (
          <button
            onClick={() => { sounds.click(); setIsHistoryOpen(true); }}
            className="btn-history-top"
          >
            📊 Mi Historial y Retos
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {menuView === 'circuit' && (
            <button
              onClick={() => { sounds.click(); setIsHistoryOpen(true); }}
              className="btn-history-top"
            >
              📊 Mi Historial y Retos
            </button>
          )}

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
      </div>

      {/* VISTA 1: MENÚ DE TARJETAS DE SELECCIÓN DE JUEGO */}
      {menuView === 'cards' && (
        <>
          <header className="menu-header">
            <img 
              src="/logo.png" 
              alt="Juega y Aprende" 
              className="main-logo animate-bounce" 
              style={{ maxWidth: '340px', width: '90%', height: 'auto', marginBottom: '0.5rem' }} 
            />
            <p className="subtitle">¡Aprende a usar la computadora jugando!</p>
          </header>

          {/* Banner rápido si tiene partida guardada */}
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

          {/* Tarjetas de Selección de Juego */}
          <div className="games-grid">
            {/* Tarjeta Aventura del Mouse */}
            <div 
              className="game-card active mouse-card"
              onClick={() => {
                sounds.click();
                setMenuView('circuit');
              }}
            >
              <div className="card-icon">🖱️</div>
              <h2>Aventura del Mouse</h2>
              <span className="card-tag">🌟 19 Retos con Circuito Interactivo</span>
              
              {highestCompleted > 0 ? (
                <div className="card-progress-pill">
                  <span>🐭 Reto actual: Reto {currentLevel} ({activeLevelInfo.name})</span>
                </div>
              ) : (
                <p>
                  Aprende a mover el cursor, hacer clic, doble clic, arrastrar y soltar, rueda de scroll y botones de selección guiando al ratoncito por todo el circuito.
                </p>
              )}

              <button 
                type="button" 
                className="btn-enter-circuit"
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.click();
                  setMenuView('circuit');
                }}
              >
                🗺️ ¡Entrar a la Aventura del Mouse! ➡
              </button>
            </div>

            {/* Tarjeta Misterio del Teclado (Próximamente) */}
            <div className="game-card locked">
              <div className="card-icon">⌨️</div>
              <h2>Misterio del Teclado</h2>
              <span className="card-tag" style={{ background: '#f1f5f9', color: '#64748b' }}>
                Próximamente
              </span>
              <p>Nuevas misiones y aventuras divertidas para aprender a escribir y dominar las teclas mágicas.</p>
              <button className="btn-locked" disabled>🔒 Próximamente</button>
            </div>
          </div>
        </>
      )}

      {/* VISTA 2: CIRCUITO INTERACTIVO (Accedido al hacer clic en Aventura del Mouse) */}
      {menuView === 'circuit' && (
        <div className="circuit-view-wrapper" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <header className="menu-header circuit-page-header" style={{ marginBottom: '1rem' }}>
            <img 
              src="/logo.png" 
              alt="Juega y Aprende" 
              style={{ maxWidth: '220px', width: '70%', height: 'auto', marginBottom: '0.4rem' }} 
            />
            <h2 style={{ color: 'var(--panama-blue)', margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.9rem' }}>
              🗺️ Circuito de la Aventura del Mouse
            </h2>
            <p className="subtitle" style={{ fontSize: '1rem', marginTop: '2px' }}>
              ¡Acompaña al ratoncito por las 19 estaciones de aprendizaje!
            </p>
          </header>

          {/* Banner de reanudación si tiene partida guardada */}
          {highestCompleted > 0 && (
            <div className="resume-hero-banner" style={{ maxWidth: '960px' }}>
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

          {/* El circuito interactivo con sus 19 estaciones */}
          <AdventureCircuit 
            currentLevel={currentLevel}
            difficulty={difficulty}
            onDifficultyChange={(newDiff) => setDifficulty(newDiff)}
            onSelectLevel={(levelIdx, diff) => onNavigate('mouse-game', diff, levelIdx)}
          />
        </div>
      )}

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
