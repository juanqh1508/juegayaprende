import React, { useState, useEffect } from 'react';
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
  const activeLevel = Math.max(1, Math.min(Number(currentLevel) || 1, 19));
  const activeLevelInfo = getLevelDetails(activeLevel);

  // MODO COMPACTO / PANTALLA DE VICTORIA: ANIMACIÓN DEL RATÓN AVANZANDO AL SIGUIENTE RETO
  if (compact) {
    const fromLevel = previousLevel || Math.max(1, activeLevel - 1);
    const toLevel = activeLevel;
    const isGameFinished = fromLevel >= 19;
    const fromInfo = getLevelDetails(fromLevel);
    const toInfo = isGameFinished 
      ? { id: 20, name: '¡Gran Diploma!', icon: '🏅', hint: 'Completado' }
      : getLevelDetails(toLevel);

    const [animStage, setAnimStage] = useState(0); // 0: inicio, 1: caminando, 2: llegada
    const [showFullMap, setShowFullMap] = useState(false);

    useEffect(() => {
      setAnimStage(0);
      // Etapa 0 -> 1: El ratoncito empieza a caminar (a los 450ms)
      const timer1 = setTimeout(() => {
        setAnimStage(1);
        try { sounds.hover(); } catch (e) {}
      }, 450);

      // Etapa 1 -> 2: El ratoncito llega a la nueva estación (a los 1750ms)
      const timer2 = setTimeout(() => {
        setAnimStage(2);
        try { sounds.taskComplete(); } catch (e) {}
      }, 1750);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }, [fromLevel, toLevel]);

    return (
      <div className="circuit-advance-card">
        <div className="circuit-advance-header">
          <span className="advance-header-icon">🗺️</span>
          <div>
            <h3 className="advance-header-title">¡El ratoncito avanza en el circuito!</h3>
            <p className="advance-header-sub">
              {animStage < 2 ? 'Caminando hacia el siguiente nivel...' : '¡Ha llegado a su nuevo reto!'}
            </p>
          </div>
        </div>

        {/* Pista de avance animada */}
        <div className="advance-track-area">
          {/* Estación de salida (Superada) */}
          <div className="advance-station-box">
            <div className="advance-station-circle completed">
              <span className="advance-icon">{fromInfo.icon}</span>
              <span className="advance-badge-star" title="¡Superado!">⭐</span>
            </div>
            <strong className="advance-station-name">Reto {fromLevel}</strong>
            <small className="advance-station-sub">{fromInfo.name}</small>
            <span className="advance-tag done">¡Superado!</span>
          </div>

          {/* Camino con el ratoncito corriendo de izquierda a derecha */}
          <div className="advance-pathway">
            <div className={`advance-road-fill stage-${animStage}`} />
            <div className={`advance-mouse-runner stage-${animStage}`}>
              <div className="runner-bubble">
                {animStage === 0 && '¡Listo! 🐾'}
                {animStage === 1 && '¡Avanzando! 💨'}
                {animStage === 2 && '¡Llegamos! 🐭🎉'}
              </div>
              <div className="runner-mouse">
                <CartoonMouseMascot size={52} />
              </div>
            </div>
          </div>

          {/* Estación de llegada (Desbloqueada) */}
          <div className="advance-station-box">
            <div className={`advance-station-circle ${animStage === 2 ? 'arrived' : ''}`}>
              <span className="advance-icon">{toInfo.icon}</span>
              {animStage === 2 && <span className="advance-badge-unlocked" title="¡Desbloqueado!">✨</span>}
            </div>
            <strong className="advance-station-name">
              {isGameFinished ? 'Meta' : `Reto ${toLevel}`}
            </strong>
            <small className="advance-station-sub">{toInfo.name}</small>
            <span className={`advance-tag ${animStage === 2 ? 'active' : 'pending'}`}>
              {animStage === 2 ? '¡Desbloqueado!' : 'Siguiente'}
            </span>
          </div>
        </div>

        <div className="advance-celebration-banner">
          {animStage === 2 ? (
            <p className="advance-text">
              🌟 ¡Fantástico! Has completado el <strong>Reto {fromLevel}: {fromInfo.name}</strong> y tu ratoncito avanzó al <strong>Reto {toLevel}: {toInfo.name}</strong>.
            </p>
          ) : (
            <p className="advance-text-wait">
              🐾 El ratoncito está caminando por el circuito hacia el siguiente reto...
            </p>
          )}
        </div>

        {/* Botón para expandir el mapa completo */}
        <div style={{ marginTop: '0.8rem', textAlign: 'center' }}>
          <button 
            type="button"
            className="btn-toggle-full-map"
            onClick={() => setShowFullMap(!showFullMap)}
          >
            {showFullMap ? '🔼 Ocultar Mapa Completo' : '🗺️ Ver Mapa Completo del Circuito (19 Retos)'}
          </button>
        </div>

        {showFullMap && (
          <div style={{ marginTop: '1.2rem', textAlign: 'left' }}>
            <AdventureCircuit 
              currentLevel={toLevel}
              difficulty={difficulty}
              onSelectLevel={onSelectLevel}
              onDifficultyChange={onDifficultyChange}
              compact={false}
            />
          </div>
        )}
      </div>
    );
  }

  // MODO COMPLETO (PANTALLA DEL CIRCUITO EN EL MENÚ)
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
          <span>🚀 Jugar Reto {activeLevel}: {activeLevelInfo.name}</span>
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
