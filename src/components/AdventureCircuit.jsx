import React from 'react';
import { CartoonMouseMascot } from './LevelMechanics';
import { sounds } from '../utils/sounds';
import './AdventureCircuit.css';

export const CIRCUIT_WORLDS = [
  {
    id: 1,
    name: 'Mundo del Movimiento',
    icon: '🌲',
    levels: [
      { id: 1, name: 'Números', icon: '🔢', hint: 'Atrapar números' },
      { id: 2, name: 'Plantas', icon: '🌻', hint: 'Regar jardín' },
      { id: 3, name: 'Manzanas', icon: '🍎', hint: 'Atrapar fruta' }
    ]
  },
  {
    id: 2,
    name: 'Mundo del Clic',
    icon: '🎯',
    levels: [
      { id: 4, name: 'Objetos', icon: '🚗', hint: 'Clic izquierdo' },
      { id: 5, name: 'Globos', icon: '🎈', hint: 'Explotar globos' },
      { id: 6, name: 'El Topo', icon: '🦡', hint: 'Atrapar al topo' }
    ]
  },
  {
    id: 3,
    name: 'Mundo del Doble Clic',
    icon: '⚡',
    levels: [
      { id: 7, name: 'Doble Clic', icon: '🔒', hint: 'Clic rápido x2' },
      { id: 8, name: 'El Huevo', icon: '🥚', hint: 'Romper huevo' },
      { id: 9, name: 'Carpetas', icon: '📁', hint: 'Abrir archivos' }
    ]
  },
  {
    id: 4,
    name: 'Mundo de Arrastrar',
    icon: '📦',
    levels: [
      { id: 10, name: 'Juguetes', icon: '🧸', hint: 'Guardar en caja' },
      { id: 11, name: 'Ropa', icon: '👕', hint: 'Canasta de ropa' },
      { id: 12, name: 'Laberinto', icon: '🌀', hint: 'Guiar archivo' },
      { id: 13, name: 'Reciclaje', icon: '♻️', hint: 'Cuidar planeta' }
    ]
  },
  {
    id: 5,
    name: 'Mundo del Scroll',
    icon: '📜',
    levels: [
      { id: 14, name: 'Bajar Rueda', icon: '🎯', hint: 'Ruedita del mouse' },
      { id: 15, name: 'Meta Scroll', icon: '🏆', hint: 'Scroll continuo' }
    ]
  },
  {
    id: 6,
    name: 'Mundo de Casillas',
    icon: '🗹',
    levels: [
      { id: 16, name: 'Letras', icon: '🔤', hint: 'Marcar letras' },
      { id: 17, name: 'Números', icon: '🔢', hint: 'Marcar números' }
    ]
  },
  {
    id: 7,
    name: 'Mundo de Opciones',
    icon: '🔘',
    levels: [
      { id: 18, name: 'La Suma', icon: '➕', hint: 'Botón correcto' },
      { id: 19, name: 'Multiplicar', icon: '✖️', hint: 'Reto final' }
    ]
  }
];

// Helper para obtener datos de un nivel específico
export function getLevelDetails(levelId) {
  for (const world of CIRCUIT_WORLDS) {
    const found = world.levels.find(l => l.id === levelId);
    if (found) return { ...found, worldName: world.name, worldIcon: world.icon };
  }
  return { id: levelId, name: `Reto ${levelId}`, icon: '🎯', hint: '', worldName: 'Aventura', worldIcon: '🖱️' };
}

function AdventureCircuit({ 
  currentLevel = 1, 
  difficulty = 1, 
  onSelectLevel, 
  onDifficultyChange,
  compact = false,
  previousLevel = null
}) {
  // Asegurar que currentLevel esté entre 1 y 19
  const activeLevel = Math.max(1, Math.min(Number(currentLevel) || 1, 19));
  const activeLevelInfo = getLevelDetails(activeLevel);

  // Modo compacto (para mostrar entre niveles en la pantalla de victoria)
  if (compact) {
    const fromLevel = previousLevel || Math.max(1, activeLevel - 1);
    const toLevel = activeLevel;
    const fromInfo = getLevelDetails(fromLevel);
    const toInfo = getLevelDetails(toLevel);

    return (
      <div className="circuit-mini-banner">
        <div className="circuit-mini-header">
          <span>🗺️</span>
          <span>¡El ratoncito avanza en el Circuito!</span>
        </div>
        <div className="circuit-mini-path">
          <div className="mini-node completed" title={`Superado: Reto ${fromLevel}`}>
            <span>{fromInfo.icon}</span>
            <span style={{ position: 'absolute', bottom: '-20px', fontSize: '0.75rem', color: '#166534', fontWeight: 'bold' }}>Reto {fromLevel}</span>
          </div>

          <div className="mini-road">
            <div className="mini-mouse-moving">
              <span style={{ fontSize: '2rem' }}>🐭</span>
            </div>
          </div>

          <div className="mini-node current" title={`Siguiente: Reto ${toLevel}`}>
            <span>{toInfo.icon}</span>
            <span style={{ position: 'absolute', bottom: '-20px', fontSize: '0.75rem', color: '#c2410c', fontWeight: 'bold' }}>Reto {toLevel}</span>
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.92rem', color: '#475569', marginTop: '1.6rem', marginBottom: '0.2rem' }}>
          ¡Excelente trabajo! Has completado el <strong>Reto {fromLevel}</strong> y desbloqueado el <strong>Reto {toLevel}: {toInfo.name}</strong>.
        </p>
      </div>
    );
  }

  // Modo completo (para el menú principal)
  return (
    <div className="adventure-circuit-container">
      <div className="circuit-header">
        <div className="circuit-title-row">
          <h2 className="circuit-title">🗺️ Circuito de la Aventura</h2>
          <span className="circuit-badge-progress">
            Reto {activeLevel} de 19
          </span>
        </div>
        <p className="circuit-subtitle">
          El ratoncito camina contigo en cada nivel. ¡Haz clic en tu reto actual o en los niveles superados para jugar!
        </p>
      </div>

      {/* Controles de Dificultad y Botón Continuar Rápido */}
      <div className="circuit-top-controls">
        <div className="circuit-diff-selector">
          <span className="circuit-diff-label">Dificultad:</span>
          <button 
            type="button"
            className={`diff-pill-btn easy ${difficulty === 1 ? 'active' : ''}`}
            onClick={() => { sounds.click(); onDifficultyChange && onDifficultyChange(1); }}
          >
            🟢 Fácil
          </button>
          <button 
            type="button"
            className={`diff-pill-btn medium ${difficulty === 2 ? 'active' : ''}`}
            onClick={() => { sounds.click(); onDifficultyChange && onDifficultyChange(2); }}
          >
            🟡 Medio
          </button>
          <button 
            type="button"
            className={`diff-pill-btn hard ${difficulty === 3 ? 'active' : ''}`}
            onClick={() => { sounds.click(); onDifficultyChange && onDifficultyChange(3); }}
          >
            🔴 Difícil
          </button>
        </div>

        <button 
          type="button"
          className="btn-hero-continue"
          onClick={() => {
            sounds.click();
            onSelectLevel && onSelectLevel(activeLevel - 1, difficulty);
          }}
        >
          <span>🚀 Continuar Reto {activeLevel}: {activeLevelInfo.name}</span>
          <span style={{ fontSize: '1.2rem' }}>➡</span>
        </button>
      </div>

      {/* Pista del Circuito (Mundos y Estaciones) */}
      <div className="circuit-track-wrapper">
        <div className="circuit-track">
          {CIRCUIT_WORLDS.map((world) => {
            const worldCompleted = world.levels.every(l => activeLevel > l.id);
            const worldActive = world.levels.some(l => activeLevel === l.id);

            return (
              <div 
                key={world.id} 
                className={`circuit-world-block ${worldCompleted ? 'completed' : (worldActive ? 'active' : '')}`}
              >
                <div className="circuit-world-header">
                  <div className="world-name">
                    <span>{world.icon}</span>
                    <span>{world.name}</span>
                  </div>
                  <span className={`world-status-tag ${worldCompleted ? 'done' : (worldActive ? 'current' : '')}`}>
                    {worldCompleted ? '✅ Mundo Superado' : (worldActive ? '⚡ En curso' : '🔒 Bloqueado')}
                  </span>
                </div>

                <div className="circuit-stations-row">
                  {world.levels.map((lvl) => {
                    const isCompleted = lvl.id < activeLevel;
                    const isCurrent = lvl.id === activeLevel;
                    const isLocked = lvl.id > activeLevel;

                    const handleClick = () => {
                      if (isLocked) {
                        sounds.error();
                        return;
                      }
                      sounds.click();
                      onSelectLevel && onSelectLevel(lvl.id - 1, difficulty);
                    };

                    return (
                      <div 
                        key={lvl.id}
                        className={`circuit-station ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
                        onClick={handleClick}
                        onMouseEnter={() => { if (!isLocked) sounds.hover(); }}
                        title={isLocked ? `Supera el Reto ${lvl.id - 1} para desbloquear` : `Jugar Reto ${lvl.id}: ${lvl.name}`}
                      >
                        {/* PERSONAJE: El ratoncito animado se posiciona sobre el reto actual */}
                        {isCurrent && (
                          <div className="mascot-avatar-container">
                            <div className="mascot-speech-bubble">
                              ¡Aquí estoy! 🐭
                            </div>
                            <div className="mascot-body">
                              <CartoonMouseMascot size={46} />
                            </div>
                          </div>
                        )}

                        <div className="station-node">
                          <span className="station-icon">{lvl.icon}</span>
                          <span className="station-number">Reto {lvl.id}</span>

                          {/* Medalla de estrella si ya lo completó */}
                          {isCompleted && (
                            <div className="station-star-badge" title="Reto completado">
                              ⭐
                            </div>
                          )}

                          {/* Candado si aún está bloqueado */}
                          {isLocked && (
                            <div className="station-lock-badge" title="Bloqueado">
                              🔒
                            </div>
                          )}
                        </div>

                        <div className="station-name">
                          {lvl.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leyenda explicativa */}
      <div className="circuit-legend">
        <div className="legend-item">
          <span>⭐</span>
          <span>Reto superado (puedes repetir)</span>
        </div>
        <div className="legend-item">
          <span>🐭</span>
          <span>Tu posición actual</span>
        </div>
        <div className="legend-item">
          <span>🔒</span>
          <span>Reto por desbloquear</span>
        </div>
      </div>
    </div>
  );
}

export default AdventureCircuit;
