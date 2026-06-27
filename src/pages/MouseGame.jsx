import React, { useState, useEffect, useRef } from 'react';
import { 
  HoverLevel, ClickLevel, DoubleClickLevel, 
  DragDropLevel, ScrollLevel, CheckboxLevel, 
  RadioLevel, SequenceClickLevel,
  WateringLevel, FallingApplesLevel,
  BalloonPoppingLevel, WhackAMoleLevel,
  EggBreakLevel, FolderOpenLevel,
  CartoonMouseMascot, MazeLevel
} from '../components/LevelMechanics';
import MouseInfographic from '../components/MouseInfographic';
import { sounds } from '../utils/sounds';
import './MouseGame.css';

// Función para seleccionar aleatoriamente un elemento
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const sections = [
  {
    startLevelIndex: 0,
    title: "Mover el Mouse 🖱️",
    description: "Desliza el mouse suavemente sobre la mesa. Mueve el cursor en la pantalla para tocar y seguir los objetos sin presionar ningún botón.",
    voiceText: "¡Hola! En esta sección vamos a aprender a mover el mouse. Deslízalo suavemente sobre la mesa y posiciona el cursor sobre los objetos para interactuar con ellos. ¡Inténtalo!",
    audioSrc: "/sounds/mover-el-mouse.mp3",
    icon: "🖱️"
  },
  {
    startLevelIndex: 3,
    title: "Hacer Clic 🎯",
    description: "Presiona el botón izquierdo del mouse una sola vez usando tu dedo índice. Úsalo para seleccionar cosas y atrapar los objetos.",
    voiceText: "¡Excelente! Ahora aprenderemos a hacer clic. Presiona una sola vez el botón izquierdo del mouse con tu dedo índice para presionar botones, reventar globos y atrapar al topo. ¡Tú puedes!",
    audioSrc: "/sounds/click.mp3",
    icon: "🎯"
  },
  {
    startLevelIndex: 6,
    title: "Doble Clic ⚡",
    description: "Presiona el botón izquierdo del mouse dos veces seguidas muy rápido. ¡Pompón! Sirve para abrir carpetas y abrir programas.",
    voiceText: "¡Genial! Ahora viene el doble clic. Presiona el botón izquierdo dos veces seguidas muy rápido. ¡Pompón! Úsalo para romper los huevos y abrir las carpetas en la pantalla.",
    audioSrc: "/sounds/doble-click.mp3",
    icon: "⚡"
  },
  {
    startLevelIndex: 9,
    title: "Arrastrar y Soltar 📦",
    description: "Mantén presionado el botón izquierdo sobre un objeto, muévelo a otro lugar, y luego suelta el botón para dejarlo caer.",
    voiceText: "¡Muy bien! Vamos a arrastrar y soltar. Haz clic en un juguete o ropa, mantén el botón presionado mientras lo mueves y suéltalo dentro de la caja o canasta.",
    audioSrc: "/sounds/arrastrar-y-soltar.mp3",
    icon: "📦"
  },
  {
    startLevelIndex: 13,
    title: "Desplazamiento (Scroll) 📜",
    description: "Usa la ruedita en el medio del mouse para deslizarte hacia arriba o hacia abajo en la pantalla.",
    voiceText: "¡Excelente! Ahora usaremos la ruedita del mouse, llamada scroll. Gírala hacia abajo con tu dedo medio para descubrir objetos que están ocultos abajo en la pantalla.",
    audioSrc: "/sounds/scroll.mp3",
    icon: "📜"
  },
  {
    startLevelIndex: 15,
    title: "Casillas de Selección 🗹",
    description: "Haz clic en los cuadros para seleccionar una o varias respuestas correctas.",
    voiceText: "¡Gran trabajo! Ahora aprenderemos a usar las casillas de selección. Haz clic en los cuadritos para marcar una o más respuestas correctas y completar la tarea.",
    audioSrc: "/sounds/checkbox.mp3",
    icon: "🗹"
  },
  {
    startLevelIndex: 17,
    title: "Botones de Opción 🔘",
    description: "Haz clic en los círculos para seleccionar una sola respuesta de las opciones disponibles.",
    voiceText: "¡Finalmente, aprenderemos los botones de opción! Haz clic en el círculo de la respuesta correcta. Recuerda que aquí solo puedes seleccionar una opción.",
    audioSrc: "/sounds/boton-de-seleccion.mp3",
    icon: "🔘"
  }
];

const levelData = [
  // MOVER EL MOUSE
  { id: 1, type: 'hover', title: 'Nivel 1', targets: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], bg: 'bg-classroom', totalTasks: 10, isStatic: true,
    description: 'Posiciónate sobre los números para atraparlos.', msg: '¡Excelente! Atrapaste los números.' },
  { id: 2, type: 'watering', title: 'Nivel 2', targets: ['🌻', '🌹', '🌷', '🌼', '🌺', '🌸', '🪴', '🌵', '🌾', '🌴'], bg: 'bg-park', totalTasks: 10,
    description: 'Riega las plantas posando la Jarra de agua encima de ellas por dos segundos.', msg: '¡Muy bien! Las plantas están felices.' },
  { id: 3, type: 'falling_apples', title: 'Nivel 3', target: '🍎', bg: 'bg-forest', totalTasks: 10,
    description: 'Atrapa las manzanas con la cesta antes que se caigan.', msg: '¡Fantástico! Tienes unos reflejos geniales.' },

  // CLICK
  { id: 4, type: 'click', title: 'Nivel 4', targets: ['🚗', '🎈', '⭐', '💎'], bg: 'bg-classroom', totalTasks: 10,
    description: 'Haz click sobre los objetos, presionando el botón izquierdo.', msg: '¡Correcto! Clic dominado.' },
  { id: 5, type: 'balloons', title: 'Nivel 5', target: '🎈', bg: 'bg-park', totalTasks: 10,
    description: '¡Pincha los globos flotantes haciéndoles clic con el botón izquierdo!', msg: '¡Buen trabajo! Eres muy veloz.' },
  { id: 6, type: 'whack_a_mole', title: 'Nivel 6', target: '🦡', bg: 'bg-forest', totalTasks: 10,
    description: '¡Juego del Topo! Atrapa los topos antes de que se escondan.', msg: '¡Excelente reflejo!' },

  // DOBLE CLICK
  { id: 7, type: 'doubleclick', title: 'Nivel 7', targets: ['🔒', '🚪', '🧰'], bg: 'bg-classroom', totalTasks: 10, isStatic: true,
    description: 'Dale Doble Click a los objetos con el botón izquierdo. Importante: Los click tienes que darlo rápido.', msg: '¡Wow! Doble clic superado.' },
  { id: 8, type: 'egg_break', title: 'Nivel 8', target: '🥚', bg: 'bg-forest', totalTasks: 10,
    description: 'Haz doble clic rápido para romper el huevo y sacar al pollito.', msg: '🐥 ¡Pío Pío! Perfecto.' },
  { id: 9, type: 'folder_open', title: 'Nivel 9', targets: ['📁'], bg: 'bg-park', totalTasks: 10,
    description: 'El doble clic sirve para abrir carpetas y programas en la computadora. Para lograrlo, debes presionar el botón izquierdo del mouse dos veces seguidas muy rápido.', msg: '¡Genial! Identificaste cómo abrir carpetas y programas en una computadora.' },

  // ARRASTRAR
  { id: 10, type: 'drag', title: 'Nivel 10', targets: ['🚗', '🧸', '🪁', '🧩', '🚂'], bin: '📦', bg: 'bg-classroom', totalTasks: 10,
    description: 'Guarda los juguetes arrastrándolos a la caja.', msg: '¡Gran trabajo! Habitación ordenada.' },
  { id: 11, type: 'drag', title: 'Nivel 11', targets: ['👕', '🧦', '👖', '👗', '🧢'], bin: '🧺', bg: 'bg-park', totalTasks: 10,
    description: 'Arrastra toda la ropa a la canasta.', msg: '¡Héroe de la limpieza!' },
  { id: 12, type: 'maze', title: 'Nivel 12', targets: ['🚗', '🚲', '🚀', '✈️', '⛵'], bg: 'bg-classroom', totalTasks: 5,
    description: 'Cruza el laberinto arrastrando los objetos desde el Inicio hasta la Meta sin tocar las paredes.', msg: '¡Excelente! Cruzaste el laberinto sin tocar las paredes.' },
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

function MouseGame({ difficulty = 1, startLevel = 0, onNavigate, setIsMusicPlaying, onFinish }) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(startLevel);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfographic, setShowInfographic] = useState(true);
  const [isLevelStarted, setIsLevelStarted] = useState(false);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [showSectionIntro, setShowSectionIntro] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const voiceAudioRef = useRef(null);

  const activeSection = sections.find(s => s.startLevelIndex === currentLevelIndex);

  useEffect(() => {
    if (setIsMusicPlaying) {
      setIsMusicPlaying(false);
    }
    if (activeSection) {
      setShowSectionIntro(true);
      setIsLevelStarted(false);
    }
  }, [currentLevelIndex]);

  const speakInstruction = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith('es'));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      
      utterance.pitch = 1.15;
      utterance.rate = 0.95;
      
      utterance.onstart = () => setIsTalking(true);
      utterance.onend = () => setIsTalking(false);
      utterance.onerror = () => setIsTalking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const playSectionAudio = () => {
    if (!activeSection) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
    }

    const audio = new Audio(activeSection.audioSrc);
    voiceAudioRef.current = audio;

    audio.onplay = () => setIsTalking(true);
    audio.onended = () => setIsTalking(false);
    audio.onerror = () => {
      speakInstruction(activeSection.voiceText);
    };

    audio.play().catch(e => {
      console.log("Audio play failed, falling back to TTS:", e);
      speakInstruction(activeSection.voiceText);
    });
  };

  useEffect(() => {
    if (showSectionIntro && activeSection) {
      const timer = setTimeout(() => {
        playSectionAudio();
      }, 600);
      return () => {
        clearTimeout(timer);
        if (voiceAudioRef.current) {
          voiceAudioRef.current.pause();
        }
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, [showSectionIntro, activeSection]);

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
    if (levelId === 8) { // Huevos
      if (diff === 1) return 15;
      if (diff === 2) return 20;
      if (diff === 3) return 30;
    }
    if (levelId === 9) { // Carpetas
      if (diff === 1) return 10;
      if (diff === 2) return 15;
      if (diff === 3) return 20;
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
        if (setIsMusicPlaying) setIsMusicPlaying(false);
        return totalTasksPerLevel;
      }
      return newCount;
    });
  };

  const nextLevel = () => {
    setShowSuccess(false);
    setTasksCompleted(0);
    setIsLevelStarted(false);
    if (setIsMusicPlaying) setIsMusicPlaying(false);
    if (currentLevelIndex + 1 < levelData.length) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    } else {
      onFinish('Estrella del Mouse');
    }
  };

  if (showInfographic) {
    return <MouseInfographic onComplete={() => setShowInfographic(false)} />;
  }

  if (showSectionIntro && activeSection) {
    return (
      <div className="section-intro-overlay">
        <div className="section-intro-card anim-pop-in">
          <span className="section-intro-icon-large">{activeSection.icon}</span>
          <h2 className="section-intro-title">{activeSection.title}</h2>
          
          <div className="section-speech-bubble-container">
            <div className="section-speech-bubble">
              <p>{activeSection.description}</p>
            </div>
            <div className="section-speech-bubble-tip"></div>
          </div>

          <div className="section-mouse-mascot-container">
            <div className={`section-mouse-mascot ${isTalking ? 'talking-anim' : ''}`}>
              {/* Tail */}
              <div className="mouse-tail"></div>
              
              <div className="mouse-ear left-ear"><div className="ear-inner"></div></div>
              <div className="mouse-ear right-ear"><div className="ear-inner"></div></div>
              
              <div className="mouse-head">
                {/* Eyebrows */}
                <div className="eyebrows">
                  <div className="eyebrow left-eyebrow"></div>
                  <div className="eyebrow right-eyebrow"></div>
                </div>

                {/* Eyes */}
                <div className="mouse-eyes">
                  <div className="mouse-eye">
                    <div className="pupil"></div>
                    <div className="pupil-shine"></div>
                  </div>
                  <div className="mouse-eye">
                    <div className="pupil"></div>
                    <div className="pupil-shine"></div>
                  </div>
                </div>
                
                <div className="mouse-nose"></div>
                
                {/* Blush Cheeks */}
                <div className="blush-cheek left-cheek"></div>
                <div className="blush-cheek right-cheek"></div>
                
                {/* Snout Details */}
                <div className="mouse-snout"></div>

                <div className="whiskers left-whiskers"><span></span><span></span></div>
                <div className="whiskers right-whiskers"><span></span><span></span></div>
                <div className={`mouse-mouth ${isTalking ? 'talking-mouth' : ''}`}></div>
              </div>
              <div className="mouse-torso">
                <div className="shirt-logo">🖱️</div>
              </div>
              <div className="mouse-hand left-hand"></div>
              <div className="mouse-hand right-hand wave-hand"></div>
              <div className="mouse-foot left-foot"></div>
              <div className="mouse-foot right-foot"></div>
            </div>
          </div>

          <div className="section-intro-buttons" style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
            <button 
              className="btn-secondary" 
              onClick={playSectionAudio}
              style={{ fontSize: '1.2rem', padding: '12px 28px', borderRadius: '50px' }}
            >
              🔊 Escuchar
            </button>
            <button 
              className="btn-primary pulse-btn" 
              onClick={() => {
                if (voiceAudioRef.current) {
                  voiceAudioRef.current.pause();
                }
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setIsTalking(false);
                setShowSectionIntro(false); 
              }}
              style={{ fontSize: '1.4rem', padding: '12px 36px', borderRadius: '50px' }}
            >
              ¡Entendido! 🎮
            </button>
          </div>
        </div>
      </div>
    );
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
        return <DoubleClickLevel key={tasksCompleted} target={currentTarget} isStatic={level.isStatic} onComplete={() => handleTaskComplete(1)} />;
      case 'egg_break':
        return <EggBreakLevel key={currentLevelIndex} totalTasks={totalTasksPerLevel} onProgress={() => handleTaskComplete(1)} />;
      case 'folder_open':
        return <FolderOpenLevel key={currentLevelIndex} totalTasks={totalTasksPerLevel} onProgress={() => handleTaskComplete(1)} />;
      case 'drag':
        // Le pasamos todo el array de targets y la cantidad total de tareas. DragDropLevel maneja la colección.
        return <DragDropLevel key={currentLevelIndex} targets={level.targets} bin={level.bin} totalTasks={totalTasksPerLevel} onProgress={() => handleTaskComplete(1)} onComplete={() => {}} />;
      case 'maze':
        return <MazeLevel key={currentLevelIndex} targets={level.targets} totalTasks={totalTasksPerLevel} difficulty={difficulty} onProgress={() => handleTaskComplete(1)} />;
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => { sounds.click(); onNavigate('menu'); }} className="btn-back">⬅ Menú</button>
          <img src="/logo.png" alt="Juega y Aprende Logo" className="header-logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
        </div>

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
            {isLevelStarted && (
              <div className="level-instruction-banner">
                <div className="banner-mascot">
                  <div className="avatar-ear left"></div>
                  <div className="avatar-ear right"></div>
                  <div className="avatar-head">
                    <div className="avatar-eye left"></div>
                    <div className="avatar-eye right"></div>
                    <div className="avatar-nose"></div>
                    <div className="avatar-blush left"></div>
                    <div className="avatar-blush right"></div>
                  </div>
                </div>
                <div className="banner-speech">
                  <div className="banner-icon-container">
                    <div className={`tutorial-icon ${
                      ['hover'].includes(level.type) ? 'anim-hover' :
                      ['click', 'checkbox', 'radio', 'sequence'].includes(level.type) ? 'anim-click' :
                      level.type === 'doubleclick' ? 'anim-doubleclick' :
                      level.type === 'drag' ? 'anim-drag' :
                      level.type === 'scroll' ? 'anim-scroll' : ''
                    }`}>
                      <div className="mini-mouse-icon">
                        <div className="mini-mouse-body">
                          <div className={`mini-btn left-btn ${['click', 'doubleclick', 'drag', 'checkbox', 'radio', 'sequence', 'balloons', 'whack_a_mole'].includes(level.type) ? 'active-click' : ''}`}></div>
                          <div className="mini-btn right-btn"></div>
                          <div className={`mini-wheel ${level.type === 'scroll' ? 'active-wheel' : ''}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="banner-text"><strong>¡Instrucción!</strong> {level.description}</p>
                </div>
              </div>
            )}
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
                    <div className="instruction-watering-container">
                      <div className="instruction-plant"></div>
                      <img 
                        src="/watering-can.svg" 
                        alt="Regadera" 
                        className="instruction-jar" 
                      />
                    </div>
                  ) : level.type === 'falling_apples' ? (
                    <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <div className="idle-bounce" style={{ position: 'absolute', top: '10px', fontSize: '3.5rem', zIndex: 1 }}>🍎</div>
                      <img 
                        src="/basket.svg" 
                        alt="Cesta" 
                        className="anim-hover"
                        style={{ position: 'absolute', bottom: '-10px', width: '70px', height: '70px', zIndex: 2 }} 
                      />
                    </div>
                  ) : level.type === 'balloons' ? (
                    <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="idle-float" style={{ position: 'absolute', top: '0px', fontSize: '4.5rem', zIndex: 1 }}>🎈</div>
                      <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', transform: 'scale(1.2)', zIndex: 2 }}>
                        <div className="mini-mouse-icon anim-click">
                          <div className="mini-mouse-body">
                            <div className="mini-btn left-btn active-click"></div>
                            <div className="mini-btn right-btn"></div>
                            <div className="mini-wheel"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : level.type === 'whack_a_mole' ? (
                    <div className="instruction-mole-container">
                      <img src="/mole.png" alt="Topo" className="instruction-mole" />
                      <img src="/hammer.png" alt="Martillo" className="instruction-hammer" />
                    </div>
                  ) : level.type === 'doubleclick' ? (
                    <div className="instruction-doubleclick-container">
                      <div className="instruction-object">🧰</div>
                      <div className="instruction-mouse-cursor">
                        <div className="mini-mouse-icon">
                          <div className="mini-mouse-body">
                            <div className="mini-btn left-btn active-double-click"></div>
                            <div className="mini-btn right-btn"></div>
                            <div className="mini-wheel"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : level.type === 'egg_break' ? (
                    <div className="instruction-egg-container">
                      <div className="instruction-egg"></div>
                      <div className="instruction-mouse-cursor">
                        <div className="mini-mouse-icon">
                          <div className="mini-mouse-body">
                            <div className="mini-btn left-btn active-double-click"></div>
                            <div className="mini-btn right-btn"></div>
                            <div className="mini-wheel"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : level.type === 'folder_open' ? (
                    <div className="instruction-folder-container">
                      <div className="instruction-folder"></div>
                      <div className="instruction-window">
                        <div className="instruction-window-title"></div>
                        <div className="instruction-window-body">📄</div>
                      </div>
                      <div className="instruction-mouse-cursor">
                        <div className="mini-mouse-icon">
                          <div className="mini-mouse-body">
                            <div className="mini-btn left-btn active-double-click"></div>
                            <div className="mini-btn right-btn"></div>
                            <div className="mini-wheel"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`tutorial-icon ${
                      ['hover'].includes(level.type) ? 'anim-hover' :
                      ['click', 'checkbox', 'radio', 'sequence'].includes(level.type) ? 'anim-click' :
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
                  onClick={() => { 
                    sounds.click(); 
                    setIsLevelStarted(true); 
                    if (setIsMusicPlaying) setIsMusicPlaying(true);
                  }}
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
