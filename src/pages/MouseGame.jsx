import React, { useState, useEffect } from 'react';
import { HoverLevel, ClickLevel, DoubleClickLevel, DragDropLevel, ScrollLevel, CheckboxLevel, RadioLevel, SequenceClickLevel } from '../components/LevelMechanics';
import MouseInfographic from '../components/MouseInfographic';
import { sounds } from '../utils/sounds';
import './MouseGame.css';

// Función para seleccionar aleatoriamente un elemento
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const levelData = [
  // HOVER (Vocales y Números)
  { id: 1, type: 'hover', title: 'Nivel 1: Atrapa las vocales', targets: ['A', 'E', 'I', 'O', 'U'], bg: 'bg-classroom', totalTasks: 10,
    description: 'Pasa el cursor sobre la letra y mantenlo por un segundo.', msg: '¡Excelente! Atrapaste las vocales.' },
  { id: 2, type: 'hover', title: 'Nivel 2: Los números', targets: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], bg: 'bg-park', totalTasks: 10,
    description: 'Mueve el cursor hacia cada número.', msg: '¡Muy bien! Sigue practicando.' },
  { id: 3, type: 'hover', title: 'Nivel 3: Mezcla', targets: ['A', '5', 'U', '8', 'E', '3', 'M', 'P'], bg: 'bg-forest', totalTasks: 10,
    description: 'Encuentra las letras y números.', msg: '¡Fantástico! Tienes un pulso muy firme.' },
  { id: 4, type: 'hover', title: 'Nivel 4: Letras perdidas', targets: ['X', 'Y', 'Z', 'W', 'K', 'Q'], bg: 'bg-classroom', totalTasks: 10,
    description: 'Mantén el ratón sobre cada letra.', msg: '¡Súper! Vas mejorando mucho.' },

  // CLICK
  { id: 5, type: 'click', title: 'Nivel 5: Sumas rápidas', targets: ['2', '4', '6', '8', '10', '12'], bg: 'bg-park', totalTasks: 10,
    description: 'Haz clic sobre las respuestas correctas a sumas que imagines.', msg: '¡Correcto! Clic dominado.' },
  { id: 6, type: 'click', title: 'Nivel 6: Busca las letras', targets: ['M', 'P', 'S', 'L', 'T', 'R'], bg: 'bg-forest', totalTasks: 10,
    description: 'Haz clic una sola vez sobre cada letra.', msg: '¡Bien hecho! El clic izquierdo es muy útil.' },
  { id: 7, type: 'click', title: 'Nivel 7: Vocales voladoras', targets: ['A', 'E', 'I', 'O', 'U'], moving: true, bg: 'bg-classroom', totalTasks: 10,
    description: '¡Las vocales se escapan! Síguelas y haz clic en el momento exacto.', msg: '¡Qué puntería!' },
  { id: 8, type: 'click', title: 'Nivel 8: Números saltarines', targets: ['1', '3', '5', '7', '9'], moving: true, bg: 'bg-park', totalTasks: 10,
    description: 'Los números impares están saltando. Haz clic sobre ellos.', msg: '¡Buen trabajo! Eres muy veloz.' },
  { id: 9, type: 'click', title: 'Nivel 9: Clic veloz', targets: ['10', '20', '30', '40', '50'], moving: true, bg: 'bg-forest', totalTasks: 10,
    description: 'Atrapa los números grandes antes de que desaparezcan.', msg: '¡Excelente reflejo!' },

  // DOUBLE CLICK
  { id: 10, type: 'doubleclick', title: 'Nivel 10: Abre los cofres', targets: ['🎁', '📦', '🧰'], bg: 'bg-classroom', totalTasks: 10,
    description: 'Para abrir, necesitas hacer DOS clics muy rápidos seguidos.', msg: '¡Wow! Doble clic superado.' },
  { id: 11, type: 'doubleclick', title: 'Nivel 11: Números pares', targets: ['2', '4', '6', '8', '10'], bg: 'bg-park', totalTasks: 10,
    description: 'Haz doble clic sobre los números pares.', msg: '¡Genial! Identificaste todos los pares.' },
  { id: 12, type: 'doubleclick', title: 'Nivel 12: Números impares', targets: ['1', '3', '5', '7', '9'], bg: 'bg-forest', totalTasks: 10,
    description: 'Están bloqueados. Haz doble clic antes de que salten.', msg: '¡Perfecto! Tus dedos son muy rápidos.' },
  { id: 13, type: 'doubleclick', title: 'Nivel 13: Despierta las letras', targets: ['Z', 'W', 'M'], bg: 'bg-classroom', totalTasks: 10,
    description: 'Despierta a las letras haciendo doble clic.', msg: '¡Increíble! Dominas el doble clic.' },

  // DRAG (All at once)
  { id: 14, type: 'drag', title: 'Nivel 14: Guarda los juguetes', targets: ['🚗', '🧸', '🪁', '🧩', '🚂', '⚽'], bin: '📦', bg: 'bg-classroom', totalTasks: 10,
    description: 'Arrastra TODOS los juguetes hacia la caja.', msg: '¡Gran trabajo! Habitación ordenada.' },
  { id: 15, type: 'drag', title: 'Nivel 15: Bota la basura', targets: ['🥤', '🍌', '🥫', '🍂', '🗞️'], bin: '🗑️', bg: 'bg-park', totalTasks: 10,
    description: 'Arrastra todos los desechos al basurero.', msg: '¡Excelente! Mantengamos limpio el planeta.' },
  { id: 16, type: 'drag', title: 'Nivel 16: Ropa sucia', targets: ['👕', '🧦', '👖', '👗', '🧢'], bin: '🧺', bg: 'bg-classroom', totalTasks: 10,
    description: 'Arrastra toda la ropa a la canasta de lavandería.', msg: '¡Héroe de la limpieza!' },
  { id: 17, type: 'drag', title: 'Nivel 17: Útiles escolares', targets: ['✏️', '📓', '✂️', '🖍️', '📏'], bin: '🎒', bg: 'bg-classroom', totalTasks: 10,
    description: 'Guarda los útiles escolares en la mochila.', msg: '¡Todo listo para aprender!' },
  { id: 18, type: 'drag', title: 'Nivel 18: Comida al refrigerador', targets: ['🍎', '🥕', '🧀', '🥩', '🥚', '🥛'], bin: '🧊', bg: 'bg-classroom', totalTasks: 10,
    description: 'Guarda la comida arrastrándola al refrigerador.', msg: '¡Maravilloso!' },

  // SCROLL (Multiple mini-scrolls or one big scroll?)
  { id: 19, type: 'scroll', title: 'Nivel 19: Bajando la colina', target: '⬇️', bg: 'bg-forest', totalTasks: 1, // Scroll is special
    description: 'Usa la rueda del mouse (scroll) o la barra lateral para desplazarte hacia abajo.', msg: '¡Fuerza! Sigue bajando.' },
  { id: 20, type: 'scroll', title: 'Nivel 20: Explorador', target: '🔎', bg: 'bg-classroom', totalTasks: 1,
    description: 'Practica el scroll suave y controlado para encontrar el objetivo.', msg: '¡Increíble! Así llegamos al final de los textos largos.' },
  { id: 21, type: 'scroll', title: 'Nivel 21: Llegada a la meta', target: '🏁', bg: 'bg-park', totalTasks: 1,
    description: '¡Último nivel de scroll! Haz scroll hasta el final para ganar.', msg: '¡Gran trabajo! Tienes mucha destreza.' },
  
  // CHECKBOX
  { id: 22, type: 'checkbox', title: 'Nivel 22: Busca los números', bg: 'bg-classroom', totalTasks: 1,
    description: 'Selecciona solo los 3 números haciendo clic en sus casillas.', msg: '¡Correcto!',
    options: [
      { id: 1, emoji: 'A', label: 'Letra A' },
      { id: 2, emoji: '2', label: 'Número Dos' },
      { id: 3, emoji: '4', label: 'Número Cuatro' },
      { id: 4, emoji: 'Z', label: 'Letra Z' },
      { id: 5, emoji: '9', label: 'Número Nueve' }
    ], requiredCount: 3 },
  { id: 23, type: 'checkbox', title: 'Nivel 23: Encuentra las vocales', bg: 'bg-park', totalTasks: 1,
    description: 'Marca las 2 vocales que veas en la lista.', msg: '¡Muy observador!',
    options: [
      { id: 1, emoji: 'E', label: 'Vocal E' },
      { id: 2, emoji: 'X', label: 'Consonante X' },
      { id: 3, emoji: 'O', label: 'Vocal O' },
      { id: 4, emoji: 'T', label: 'Consonante T' }
    ], requiredCount: 2 },

  // RADIO BUTTONS
  { id: 24, type: 'radio', title: 'Nivel 24: ¡Resuelve 5 + 5!', bg: 'bg-forest', totalTasks: 1,
    description: 'Selecciona el resultado correcto de esta suma.', msg: '¡Exacto! 5 + 5 es 10.',
    options: [
      { id: 1, emoji: '5', label: 'Cinco' },
      { id: 2, emoji: '10', label: 'Diez' },
      { id: 3, emoji: '15', label: 'Quince' }
    ], correctId: 2 },
  { id: 25, type: 'radio', title: 'Nivel 25: La vocal perdida', bg: 'bg-classroom', totalTasks: 1,
    description: 'Selecciona la vocal que falta: A, E, I, __, U.', msg: '¡Muy bien! Falta la O.',
    options: [
      { id: 1, emoji: 'X', label: 'La X' },
      { id: 2, emoji: 'O', label: 'La O' },
      { id: 3, emoji: 'M', label: 'La M' }
    ], correctId: 2 },

  // SEQUENCE
  { id: 26, type: 'sequence', title: 'Nivel 26: El Gran Final (1 al 10)', bg: 'bg-forest', totalTasks: 1,
    description: 'Demuestra todo lo que has aprendido. Haz clic en orden del 1 al 10 lo más rápido que puedas.', msg: '¡Felicidades! Has dominado el mouse a la perfección.', sequenceLength: 10 }
];

function Confetti() {
  const pieces = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    delay: `${Math.random() * 0.8}s`,
    color: ['#FFD600','#00BCD4','#E53935','#7C4DFF','#69F0AE','#FF4081','#FF6D00'][i % 7],
    size: `${0.6 + Math.random() * 0.8}rem`,
  }));
  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece"
          style={{ left: p.left, animationDelay: p.delay, background: p.color, width: p.size, height: p.size }} />
      ))}
    </div>
  );
}

function MouseGame({ onNavigate, onFinish }) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfographic, setShowInfographic] = useState(true);
  const [currentTarget, setCurrentTarget] = useState(null);

  const level = levelData[currentLevelIndex];
  const totalTasksPerLevel = level.totalTasks || 1;

  // Actualizar el objetivo aleatorio cuando cambia el nivel o se completa una tarea
  useEffect(() => {
    if (level.targets) {
      setCurrentTarget(getRandomItem(level.targets));
    } else {
      setCurrentTarget(level.target);
    }
  }, [currentLevelIndex, tasksCompleted, level]);

  const handleTaskComplete = (count = 1) => {
    setTasksCompleted((prev) => {
      const newCount = prev + count;
      if (newCount >= totalTasksPerLevel) {
        sounds.levelComplete();
        setShowSuccess(true);
        return totalTasksPerLevel;
      }
      return newCount;
    });
  };

  const nextLevel = () => {
    setShowSuccess(false);
    setTasksCompleted(0);
    if (currentLevelIndex + 1 < levelData.length) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    } else {
      onFinish('Estrella del Mouse');
    }
  };

  if (showInfographic) {
    return <MouseInfographic onComplete={() => setShowInfographic(false)} />;
  }

  const renderLevelComponent = () => {
    switch (level.type) {
      case 'hover':
        return <HoverLevel key={tasksCompleted} target={currentTarget} onComplete={() => handleTaskComplete(1)} />;
      case 'click':
        return <ClickLevel key={tasksCompleted} target={currentTarget} moving={level.moving} onComplete={() => handleTaskComplete(1)} />;
      case 'doubleclick':
        return <DoubleClickLevel key={tasksCompleted} target={currentTarget} onComplete={() => handleTaskComplete(1)} />;
      case 'drag':
        // Le pasamos todo el array de targets y la cantidad total de tareas. DragDropLevel maneja la colección.
        return <DragDropLevel key={currentLevelIndex} targets={level.targets} bin={level.bin} totalTasks={totalTasksPerLevel} onProgress={() => handleTaskComplete(1)} onComplete={() => {}} />;
      case 'scroll':
        return <ScrollLevel key={tasksCompleted} target={level.target} onComplete={() => handleTaskComplete(1)} />;
      case 'checkbox':
        return <CheckboxLevel key={tasksCompleted} options={level.options} requiredCount={level.requiredCount} onComplete={() => handleTaskComplete(1)} />;
      case 'radio':
        return <RadioLevel key={tasksCompleted} options={level.options} correctId={level.correctId} onComplete={() => handleTaskComplete(1)} />;
      case 'sequence':
        return <SequenceClickLevel key={tasksCompleted} sequenceLength={level.sequenceLength} onComplete={() => handleTaskComplete(1)} />;
      default:
        return <div>Nivel no encontrado</div>;
    }
  };

  const progressPercent = ((currentLevelIndex) / levelData.length) * 100;
  const taskProgressPercent = (tasksCompleted / totalTasksPerLevel) * 100;
  const containerClass = `mouse-game-container ${level.bg || 'bg-park'}`;

  return (
    <div className={containerClass}>
      <header className="game-header">
        <button onClick={() => { sounds.click(); onNavigate('menu'); }} className="btn-back">⬅ Menú</button>

        <div className="header-progress">
          <div className="progress-label">Nivel {currentLevelIndex + 1} / {levelData.length}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        
        <div className="task-badge">
          <span className="task-badge-icon">🎯</span>
          <span>{tasksCompleted}/{totalTasksPerLevel}</span>
        </div>
      </header>

      {!showSuccess ? (
        <div className="level-area">
          <div className="level-header-row">
            <h2 className="level-title">
              {level.id === 24 ? <strong>{level.title}</strong> : level.title}
            </h2>
          </div>
          
          {totalTasksPerLevel > 1 && (
            <div className="task-mini-bar">
              <div className="task-mini-fill" style={{ width: `${taskProgressPercent}%` }} />
            </div>
          )}

          <div className="level-mechanic-box">
            {renderLevelComponent()}
          </div>
        </div>
      ) : (
        <div className="success-screen">
          <Confetti />
          <div className="success-emoji animate-bounce">🎉</div>
          <h2 className="success-title">¡Nivel Superado!</h2>
          <div className="message-box">
            <p>{level.msg}</p>
          </div>
          <div className="success-stats">
            <span>✅ {totalTasksPerLevel} {totalTasksPerLevel === 1 ? 'ejercicio completado' : 'ejercicios completados'}</span>
          </div>
          <button className="btn-primary btn-next" onClick={() => { sounds.click(); nextLevel(); }}>
            {currentLevelIndex + 1 === levelData.length ? '🏅 Reclamar Diploma' : 'Siguiente Nivel ➡'}
          </button>
        </div>
      )}
    </div>
  );
}

export default MouseGame;
