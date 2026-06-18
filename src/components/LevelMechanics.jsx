import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/sounds';
import './LevelMechanics.css';

function getRandomPosition() {
  return {
    top: `${18 + Math.random() * 58}%`,
    left: `${12 + Math.random() * 68}%`,
  };
}

// Inline Tutorial Component
function InlineTutorial({ type, title, subtitle }) {
  const getAnimClass = () => {
    switch (type) {
      case 'hover': return 'anim-hover';
      case 'click': return 'anim-click';
      case 'doubleclick': return 'anim-doubleclick';
      case 'drag': return 'anim-drag';
      case 'scroll': return 'anim-scroll';
      default: return '';
    }
  };

  return (
    <div className="inline-tutorial">
      <div className={`tutorial-icon ${getAnimClass()}`}>
        🖱️
        <div className="click-effect"></div>
      </div>
      <p className="instruction">
        <strong>{title}</strong><br/>
        <span className="inst-sub">{subtitle}</span>
      </p>
    </div>
  );
}


// --- HOVER LEVEL ---
export function HoverLevel({ target, onComplete }) {
  const [hovered, setHovered] = useState(false);
  const [position] = useState(getRandomPosition);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (hovered) {
      const timer = setTimeout(() => {
        setBurst(true);
        sounds.taskComplete();
        setTimeout(() => onComplete(), 400);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hovered, onComplete]);

  return (
    <div className="mechanic-container hover-bg">
      <InlineTutorial 
        type="hover" 
        title="¡Pasa el mouse encima!" 
        subtitle="Mantén el cursor sobre el objeto por 1 segundo." 
      />

      <div
        className={`target-emoji ${hovered ? 'hovering' : 'idle-float'} ${burst ? 'burst' : ''}`}
        style={{ position: 'absolute', top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
        onMouseEnter={() => { setHovered(true); sounds.hover(); }}
        onMouseLeave={() => setHovered(false)}
      >
        {target}
        {hovered && <div className="ripple-ring" />}
      </div>

      {hovered && (
        <div className="loading-bar" style={{ position: 'absolute', bottom: '25px' }}>
          <div className="loading-fill" />
          <span className="loading-text">¡Aguanta! 🎯</span>
        </div>
      )}
    </div>
  );
}

// --- CLICK LEVEL ---
export function ClickLevel({ target, moving, onComplete }) {
  const [position, setPosition] = useState(getRandomPosition);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!moving) return;
    const moveInterval = setInterval(() => {
      setPosition(getRandomPosition());
    }, 1200);
    return () => clearInterval(moveInterval);
  }, [moving]);

  const handleClick = () => {
    sounds.click();
    setClicked(true);
    sounds.taskComplete();
    setTimeout(() => {
      setClicked(false);
      onComplete();
    }, 300);
  };

  return (
    <div className="mechanic-container click-bg">
      <InlineTutorial 
        type="click" 
        title={moving ? '¡Atrápalo con un clic!' : '¡Haz clic en el objeto!'} 
        subtitle={moving ? 'El objeto se mueve. ¡Sé rápido y preciso!' : 'Apunta y haz clic sobre el objeto para completarlo.'} 
      />

      <div
        className={`target-emoji target-clickable ${clicked ? 'burst' : 'idle-pulse'}`}
        style={{ top: position.top, left: position.left, position: 'absolute', transform: 'translate(-50%, -50%)', transition: moving ? 'top 0.4s, left 0.4s' : 'none' }}
        onClick={handleClick}
      >
        {target}
      </div>
    </div>
  );
}

// --- DOUBLE CLICK LEVEL ---
export function DoubleClickLevel({ target, onComplete }) {
  const [position, setPosition] = useState(getRandomPosition);
  const [flash, setFlash] = useState(false);

  const handleDoubleClick = () => {
    sounds.doubleClick();
    setFlash(true);
    sounds.taskComplete();
    setTimeout(() => {
      setFlash(false);
      setPosition(getRandomPosition());
      onComplete();
    }, 350);
  };

  return (
    <div className="mechanic-container double-bg">
      <InlineTutorial 
        type="doubleclick" 
        title="¡Doble clic rápido!" 
        subtitle="Haz DOS clics seguidos muy rápido sobre el objeto." 
      />

      <div
        className={`target-emoji target-clickable target-double ${flash ? 'burst' : 'idle-bounce'}`}
        style={{ position: 'absolute', top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
        onDoubleClick={handleDoubleClick}
      >
        {target}
        <div className="double-hint">2x</div>
      </div>
    </div>
  );
}

// --- DRAG & DROP LEVEL ---
export function DragDropLevel({ targets, bin, totalTasks, onProgress }) {
  const [items, setItems] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate items scattered on the left/center of the container
    const newItems = Array.from({ length: totalTasks }, (_, i) => ({
      id: i,
      emoji: targets[i % targets.length],
      // random position avoiding the extreme edges and right bin area
      x: 50 + Math.random() * (window.innerWidth * 0.4),
      y: 100 + Math.random() * (window.innerHeight * 0.4),
      dropped: false
    }));
    setItems(newItems);
  }, [targets, totalTasks]);

  const handleMouseDown = (e, item) => {
    if (item.dropped) return;
    sounds.drag();
    setDraggedId(item.id);
    setStartPos({ x: e.clientX - item.x, y: e.clientY - item.y });
  };

  const handleMouseMove = (e) => {
    if (draggedId !== null) {
      setItems(prev => prev.map(item => 
        item.id === draggedId ? { ...item, x: e.clientX - startPos.x, y: e.clientY - startPos.y } : item
      ));
    }
  };

  const handleMouseUp = () => {
    if (draggedId !== null) {
      const item = items.find(i => i.id === draggedId);
      // The bin is on the right side. We check if the item's x coordinate is far right enough.
      if (item.x > window.innerWidth * 0.5) {
        sounds.drop();
        setItems(prev => prev.map(i => i.id === draggedId ? { ...i, dropped: true } : i));
        onProgress();
      } else {
        sounds.error();
      }
      setDraggedId(null);
    }
  };

  return (
    <div className="mechanic-container drag-container drag-bg" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <InlineTutorial 
        type="drag" 
        title="¡Limpia la pantalla!" 
        subtitle="Arrastra todos los objetos hacia la zona de la derecha." 
      />

      <div className="drag-area" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        {items.map(item => !item.dropped && (
          <div
            key={item.id}
            className={`target-emoji draggable ${draggedId === item.id ? 'grabbing' : ''}`}
            style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${item.x}px, ${item.y}px)`, zIndex: draggedId === item.id ? 100 : 10 }}
            onMouseDown={(e) => handleMouseDown(e, item)}
          >
            {item.emoji}
          </div>
        ))}

        <div className="bin-emoji" style={{ position: 'absolute', right: '10%', top: '50%', transform: 'translateY(-50%)', fontSize: '10rem', opacity: 0.8, zIndex: 1 }}>
          {bin}
        </div>
      </div>
    </div>
  );
}

// --- SCROLL LEVEL ---
export function ScrollLevel({ target, onComplete }) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const progress = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    setScrollProgress(Math.min(progress, 100));

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      if (!scrolled) {
        sounds.taskComplete();
        setScrolled(true);
      }
    }
  };

  return (
    <div className="mechanic-container scroll-bg">
      <InlineTutorial 
        type="scroll" 
        title="¡Rueda del mouse hacia abajo!" 
        subtitle="Usa la ruedita del mouse para bajar hasta el final." 
      />

      <div className="scroll-progress-bar">
        <div className="scroll-progress-fill" style={{ width: `${scrollProgress}%` }} />
        <span>{scrollProgress}%</span>
      </div>

      <div className="scroll-box" onScroll={handleScroll}>
        <div className="scroll-content">
          <div className="scroll-start">🔼 Empieza aquí · Baja con la rueda del mouse 👇</div>
          <div className="scroll-mid">📖 Sigue bajando, hay mucho contenido por descubrir...</div>
          <div className="scroll-mid">🌊 ¡Ya falta poco! Sigue moviendo la rueda hacia ti.</div>
          <div className="scroll-end">
            <div className="target-emoji animate-bounce" style={{ fontSize: '5rem' }}>{target}</div>
            <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--tropical-green)', margin: '1rem 0' }}>
              {scrolled ? '¡Llegaste al final! 🎉' : '¡Aquí está el destino! 🏁'}
            </p>
            <button
              className="btn-primary"
              onClick={() => { sounds.click(); onComplete(); }}
              disabled={!scrolled}
              style={{ opacity: scrolled ? 1 : 0.5 }}
            >
              {scrolled ? '✅ ¡Lo lograste! Clic aquí' : '⬇️ Sigue bajando...'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CHECKBOX LEVEL ---
export function CheckboxLevel({ options, requiredCount, onComplete }) {
  const [checkedItems, setCheckedItems] = useState([]);

  const toggleCheck = (id) => {
    sounds.click();
    setCheckedItems(prev => {
      const isChecked = prev.includes(id);
      const newChecked = isChecked ? prev.filter(i => i !== id) : [...prev, id];
      
      if (newChecked.length === requiredCount) {
        sounds.taskComplete();
        setTimeout(() => onComplete(), 500);
      }
      return newChecked;
    });
  };

  return (
    <div className="mechanic-container checkbox-bg">
      <InlineTutorial 
        type="click" 
        title="¡Selecciona las opciones!" 
        subtitle={`Haz clic en las casillas para marcar ${requiredCount} opciones correctas.`} 
      />

      <div className="checkbox-grid">
        {options.map((opt) => (
          <div 
            key={opt.id} 
            className={`checkbox-item ${checkedItems.includes(opt.id) ? 'checked' : ''}`}
            onClick={() => toggleCheck(opt.id)}
          >
            <div className="checkbox-emoji">{opt.emoji}</div>
            <span style={{fontWeight: 'bold', color: '#333'}}>{opt.label}</span>
            <div className="checkbox-box">
              {checkedItems.includes(opt.id) ? '✓' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- RADIO LEVEL ---
export function RadioLevel({ options, correctId, onComplete }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    sounds.click();
    setSelectedId(id);
    if (id === correctId) {
      sounds.taskComplete();
      setTimeout(() => onComplete(), 600);
    } else {
      sounds.error();
    }
  };

  return (
    <div className="mechanic-container radio-bg">
      <InlineTutorial 
        type="click" 
        title="¡Elige solo una opción!" 
        subtitle="Haz clic en el círculo de la respuesta correcta." 
      />

      <div className="radio-grid">
        {options.map((opt) => (
          <div 
            key={opt.id} 
            className={`radio-item ${selectedId === opt.id ? 'selected' : ''}`}
            onClick={() => handleSelect(opt.id)}
          >
            <div className="checkbox-emoji" style={{fontSize: '3.5rem'}}>{opt.emoji}</div>
            <span style={{fontWeight: 'bold', color: '#333'}}>{opt.label}</span>
            <div className="radio-circle">
              <div className="radio-circle-inner" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- SEQUENCE CLICK LEVEL ---
export function SequenceClickLevel({ sequenceLength = 3, onComplete }) {
  const [sequence, setSequence] = useState([]);
  const [clickedIndexes, setClickedIndexes] = useState([]);

  useEffect(() => {
    const newSeq = Array.from({ length: sequenceLength }, (_, i) => ({
      id: i + 1,
      top: `${25 + Math.random() * 50}%`,
      left: `${15 + Math.random() * 60}%`
    }));
    setSequence(newSeq);
  }, [sequenceLength]);

  const handleClick = (id) => {
    const expectedId = clickedIndexes.length + 1;
    if (id === expectedId) {
      sounds.click();
      const newClicked = [...clickedIndexes, id];
      setClickedIndexes(newClicked);
      if (newClicked.length === sequenceLength) {
        sounds.taskComplete();
        setTimeout(() => onComplete(), 500);
      }
    } else {
      sounds.error();
    }
  };

  return (
    <div className="mechanic-container sequence-bg">
      <InlineTutorial 
        type="click" 
        title="¡Haz clic en orden!" 
        subtitle="Haz clic en los números en orden ascendente (1, 2, 3...)." 
      />

      <div className="sequence-area">
        {sequence.map((item) => (
          <div
            key={item.id}
            className={`sequence-btn ${clickedIndexes.includes(item.id) ? 'clicked' : ''}`}
            style={{ top: item.top, left: item.left }}
            onClick={() => handleClick(item.id)}
          >
            {item.id}
          </div>
        ))}
      </div>
    </div>
  );
}
