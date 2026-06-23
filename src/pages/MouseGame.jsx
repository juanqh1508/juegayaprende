import React, { useState, useEffect } from 'react';
import { 
  HoverLevel, ClickLevel, DoubleClickLevel, 
  DragDropLevel, ScrollLevel, CheckboxLevel, 
  RadioLevel, SequenceClickLevel,
  WateringLevel, FallingApplesLevel,
  BalloonPoppingLevel, WhackAMoleLevel
} from '../components/LevelMechanics';
import MouseInfographic from '../components/MouseInfographic';
import { sounds } from '../utils/sounds';
import './MouseGame.css';

// Función para seleccionar aleatoriamente un elemento
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const levelData = [
  // MOVER EL MOUSE
  { id: 1, type: 'hover', title: 'Nivel 1', targets: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], bg: 'bg-classroom', totalTasks: 10, isStatic: true,
    description: 'Posiciónate sobre los números para atraparlos.', msg: '¡Excelente! Atrapaste los números.' },
  { id: 2, type: 'watering', title: 'Nivel 2', targets: ['🌻', '🌹', '🌷', '🌼', '🌺', '🌸', '🪴', '🌵', '🌾', '🌴'], bg: 'bg-park', totalTasks: 10,
    description: 'Riega las plantas posando la Jarra de agua encima de ellas por dos segundos.', msg: '¡Muy bien! Las plantas están felices.' },
  { id: 3, type: 'falling_apples', title: 'Nivel 3', target: '🍎', bg: 'bg-forest', totalTasks: 10,
    description: 'Atrapa las manzanas pasando el mouse sobre ellas antes de que caigan.', msg: '¡Fantástico! Tienes unos reflejos geniales.' },

  // CLICK
  { id: 4, type: 'click', title: 'Nivel 4', targets: ['🚗', '🎈', '⭐', '💎'], bg: 'bg-classroom', totalTasks: 10,
    description: 'Haz clic rápido sobre los objetos que aparecen.', msg: '¡Correcto! Clic dominado.' },
  { id: 5, type: 'balloons', title: 'Nivel 5', target: '🎈', bg: 'bg-park', totalTasks: 10,
    description: '¡Pincha los globos flotantes haciéndoles clic!', msg: '¡Buen trabajo! Eres muy veloz.' },
  { id: 6, type: 'whack_a_mole', title: 'Nivel 6', target: '🦡', bg: 'bg-forest', totalTasks: 10,
    description: '¡Juego del Topo! Atrapa los topos antes de que se escondan.', msg: '¡Excelente reflejo!' },

  // DOBLE CLICK
  { id: 7, type: 'doubleclick', title: 'Nivel 7', targets: ['🔒', '🚪', '🧰'], bg: 'bg-classroom', totalTasks: 10,
    description: 'Abre los objetos haciendo doble clic.', msg: '¡Wow! Doble clic superado.' },
  { id: 8, type: 'doubleclick', title: 'Nivel 8', targets: ['📁', '📂'], bg: 'bg-park', totalTasks: 10,
    description: 'Haz doble clic para abrir las carpetas.', msg: '¡Genial! Identificaste cómo abrir archivos.' },
  { id: 9, type: 'doubleclick', title: 'Nivel 9', targets: ['🥚'], bg: 'bg-forest', totalTasks: 10,
    description: 'Haz doble clic rápido para romper el huevo y sacar al pollito.', msg: '🐥 ¡Pío Pío! Perfecto.' },

  // ARRASTRAR
  { id: 10, type: 'drag', title: 'Nivel 10', targets: ['🚗', '🧸', '🪁', '🧩', '🚂'], bin: '📦', bg: 'bg-classroom', totalTasks: 10,
    description: 'Guarda los juguetes arrastrándolos a la caja.', msg: '¡Gran trabajo! Habitación ordenada.' },
  { id: 11, type: 'drag', title: 'Nivel 11', targets: ['👕', '🧦', '👖', '👗', '🧢'], bin: '🧺', bg: 'bg-park', totalTasks: 10,
    description: 'Arrastra toda la ropa a la canasta.', msg: '¡Héroe de la limpieza!' },
  { id: 12, type: 'drag', title: 'Nivel 12', targets: ['A', 'E', 'I', 'O', 'U'], bin: '🔤', bg: 'bg-classroom', totalTasks: 10,
    description: 'Separa las vocales arrastrándolas al contenedor.', msg: '¡Muy bien, conoces las vocales!' },
  { id: 13, type: 'drag', title: 'Nivel 13', targets: ['🍌', '🍂', '🍎'], bin: '♻️', bg: 'bg-forest', totalTasks: 10,
    description: 'Arrastra los desechos biodegradables al contenedor de reciclaje.', msg: '¡Excelente! Mantengamos limpio el planeta.' },

  // SCROLL
  { id: 14, type: 'scroll', title: 'Nivel 14', target: '🎯', multiple: false, bg: 'bg-classroom', totalTasks: 1,
    description: 'Haz scroll hacia abajo para encontrar el objetivo.', msg: '¡Increíble! Así llegamos al final.' },
  { id: 15, type: 'scroll', title: 'Nivel 15', target: '🏆', multiple: true, bg: 'bg-park', totalTasks: 1,
    description: '¡Nivel avanzado! Haz scroll hasta el final varias veces seguidas.', msg: '¡Gran trabajo! Tienes mucha destreza.' },
  
  // CHECKBOX
  { id: 16, type: 'checkbox', title: 'Nivel 16', bg: 'bg-classroom', totalTasks: 1,
    description: 'Dale clic a las letras.', msg: '¡Correcto!', question: 'Selecciona todas las letras',
    options: [
      { id: 1, emoji: 'A', label: 'Letra A' },
      { id: 2, emoji: '2', label: 'Número 2' },
      { id: 3, emoji: 'Z', label: 'Letra Z' },
      { id: 4, emoji: '4', label: 'Número 4' }
    ], requiredCount: 2 },
  { id: 17, type: 'checkbox', title: 'Nivel 17', bg: 'bg-park', totalTasks: 1,
    description: 'Click a los números.', msg: '¡Muy observador!', question: 'Selecciona todos los números',
    options: [
      { id: 1, emoji: 'E', label: 'Vocal E' },
      { id: 2, emoji: '7', label: 'Número 7' },
      { id: 3, emoji: 'O', label: 'Vocal O' },
      { id: 4, emoji: '9', label: 'Número 9' }
    ], requiredCount: 2 },

  // RADIO BUTTONS
  { id: 18, type: 'radio', title: 'Nivel 18', bg: 'bg-forest', totalTasks: 1,
    description: 'Resuelve el problema matemático.', msg: '¡Exacto! Buen cálculo.', question: '¿Cuánto es 5 + 3?',
    options: [
      { id: 1, emoji: '6', label: 'Seis' },
      { id: 2, emoji: '8', label: 'Ocho' },
      { id: 3, emoji: '10', label: 'Diez' }
    ], correctId: 2 },
  { id: 19, type: 'radio', title: 'Nivel 19', bg: 'bg-classroom', totalTasks: 1,
    description: 'Selecciona el resultado correcto.', msg: '¡Muy bien!', question: '¿Cuánto es 3 x 4?',
    options: [
      { id: 1, emoji: '7', label: 'Siete' },
      { id: 2, emoji: '12', label: 'Doce' },
      { id: 3, emoji: '9', label: 'Nueve' }
    ], correctId: 2 }
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

function MouseGame({ difficulty = 1, startLevel = 0, onNavigate, onFinish }) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(startLevel);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfographic, setShowInfographic] = useState(true);
  const [isLevelStarted, setIsLevelStarted] = useState(false);
  const [currentTarget, setCurrentTarget] = useState(null);

  const level = levelData[currentLevelIndex];
  
  const getTasksByDifficulty = (levelId, baseTasks, diff) => {
    if (levelId === 2) { // Plantas
      if (diff === 1) return 10;
      if (diff === 2) return 20;
      if (diff === 3) return 30;
    }
    if (levelId === 3 || levelId === 5) { // Manzanas y Globos
      if (diff === 1) return 20;
      if (diff === 2) return 40;
      if (diff === 3) return 60;
    }
    if (levelId === 4 || levelId === 6) { // Click objetos y Topo
      if (diff === 1) return 10;
      if (diff === 2) return 20;
      if (diff === 3) return 30;
    }
    
    if (baseTasks === 1) return 1; // Scroll, checkbox and radio are single tasks
    if (diff === 1) return Math.max(1, Math.round(baseTasks * 0.5)); // 5 tasks
    if (diff === 2) return Math.max(1, Math.round(baseTasks * 0.8)); // 8 tasks
    return baseTasks; // 10 tasks
  };
  const totalTasksPerLevel = getTasksByDifficulty(level.id, level.totalTasks || 1, difficulty);

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
    setIsLevelStarted(false);
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
        return <HoverLevel key={tasksCompleted} target={currentTarget} isStatic={level.isStatic} onComplete={() => handleTaskComplete(1)} />;
      case 'watering':
        return <WateringLevel key={currentLevelIndex} targets={level.targets} totalTasks={totalTasksPerLevel} onProgress={() => handleTaskComplete(1)} />;
      case 'falling_apples':
        return <FallingApplesLevel key={currentLevelIndex} target={level.target} totalTasks={totalTasksPerLevel} onProgress={() => handleTaskComplete(1)} />;
      case 'click':
        return <ClickLevel key={tasksCompleted} target={currentTarget} moving={level.moving} onComplete={() => handleTaskComplete(1)} />;
      case 'balloons':
        return <BalloonPoppingLevel key={currentLevelIndex} target={level.target} difficulty={difficulty} totalTasks={totalTasksPerLevel} onProgress={() => handleTaskComplete(1)} />;
      case 'whack_a_mole':
        return <WhackAMoleLevel key={currentLevelIndex} target={level.target} difficulty={difficulty} totalTasks={totalTasksPerLevel} onProgress={() => handleTaskComplete(1)} />;
      case 'doubleclick':
        return <DoubleClickLevel key={tasksCompleted} target={currentTarget} onComplete={() => handleTaskComplete(1)} />;
      case 'drag':
        // Le pasamos todo el array de targets y la cantidad total de tareas. DragDropLevel maneja la colección.
        return <DragDropLevel key={currentLevelIndex} targets={level.targets} bin={level.bin} totalTasks={totalTasksPerLevel} onProgress={() => handleTaskComplete(1)} onComplete={() => {}} />;
      case 'scroll':
        return <ScrollLevel key={tasksCompleted} target={level.target} multiple={level.multiple} onComplete={() => handleTaskComplete(1)} />;
      case 'checkbox':
        return <CheckboxLevel key={tasksCompleted} options={level.options} requiredCount={level.requiredCount} question={level.question} onComplete={() => handleTaskComplete(1)} />;
      case 'radio':
        return <RadioLevel key={tasksCompleted} options={level.options} correctId={level.correctId} question={level.question} onComplete={() => handleTaskComplete(1)} />;
      case 'sequence':
        return <SequenceClickLevel key={tasksCompleted} sequenceLength={level.sequenceLength} onComplete={() => handleTaskComplete(1)} />;
      default:
        return <div>Nivel no encontrado</div>;
    }
  };

  const progressPercent = ((currentLevelIndex) / levelData.length) * 100;
  const taskProgressPercent = (tasksCompleted / totalTasksPerLevel) * 100;
  const containerClass = `mouse-game-container`;

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
              {level.title}
            </h2>
          </div>
          
          {totalTasksPerLevel > 1 && (
            <div className="task-mini-bar">
              <div className="task-mini-fill" style={{ width: `${taskProgressPercent}%` }} />
            </div>
          )}

          <div className="level-mechanic-box">
            {!isLevelStarted ? (
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.95)', padding: '3rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', maxWidth: '500px', animation: 'popIn 0.4s ease-out' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--panama-blue)' }}>{level.title}</h2>
                
                <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0 2rem 0' }}>
                  {level.type === 'watering' ? (
                    <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <div style={{ fontSize: '4rem', lineHeight: 1 }}>🌱</div>
                      <img 
                        src="/watering-can.svg" 
                        alt="Regadera" 
                        className="anim-hover" 
                        style={{ position: 'absolute', top: '-20px', right: '-20px', width: '60px', height: '60px', transformOrigin: 'bottom left' }} 
                      />
                    </div>
                  ) : (
                    <div className={`tutorial-icon ${
                      ['hover', 'falling_apples'].includes(level.type) ? 'anim-hover' :
                      ['click', 'balloons', 'whack_a_mole', 'checkbox', 'radio', 'sequence'].includes(level.type) ? 'anim-click' :
                      level.type === 'doubleclick' ? 'anim-doubleclick' :
                      level.type === 'drag' ? 'anim-drag' :
                      level.type === 'scroll' ? 'anim-scroll' : ''
                    }`} style={{ transform: 'scale(1.5)' }}>
                      <div className="mini-mouse-icon">
                        <div className="mini-mouse-body">
                          <div className={`mini-btn left-btn ${['click', 'doubleclick', 'drag', 'checkbox', 'radio', 'sequence', 'balloons', 'whack_a_mole'].includes(level.type) ? 'active-click' : ''}`}></div>
                          <div className="mini-btn right-btn"></div>
                          <div className={`mini-wheel ${level.type === 'scroll' ? 'active-wheel' : ''}`}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <p style={{ fontSize: '1.3rem', marginBottom: '2rem', color: '#555' }}>{level.description}</p>
                <button 
                  className="btn-primary" 
                  onClick={() => { sounds.click(); setIsLevelStarted(true); }}
                  style={{ fontSize: '1.5rem', padding: '15px 40px' }}
                >
                  ¡Empezar Nivel!
                </button>
              </div>
            ) : (
              renderLevelComponent()
            )}
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
          <div className="success-buttons" style={{ display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={() => { sounds.click(); setShowSuccess(false); setTasksCompleted(0); setIsLevelStarted(false); }} style={{ fontSize: '1.2rem', padding: '12px 28px', borderRadius: '50px', border: '3px solid var(--violet)', background: 'white', color: 'var(--violet)', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', transition: 'all 0.3s' }}>
              🔁 Repetir Nivel
            </button>
            <button className="btn-primary btn-next" onClick={() => { sounds.click(); nextLevel(); }}>
              {currentLevelIndex + 1 === levelData.length ? '🏅 Reclamar Diploma' : 'Siguiente Nivel ➡'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MouseGame;
