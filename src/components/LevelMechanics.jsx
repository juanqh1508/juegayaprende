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
        <div className="mini-mouse-icon">
          <div className="mini-mouse-body">
            <div className={`mini-btn left-btn ${(type === 'click' || type === 'doubleclick' || type === 'drag') ? 'active-click' : ''}`}></div>
            <div className="mini-btn right-btn"></div>
            <div className={`mini-wheel ${type === 'scroll' ? 'active-wheel' : ''}`}></div>
          </div>
        </div>
      </div>
      <p className="instruction">
        <strong>{title}</strong><br/>
        <span className="inst-sub">{subtitle}</span>
      </p>
    </div>
  );
}


// --- HOVER LEVEL ---
export function HoverLevel({ target, isStatic, onComplete }) {
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
        className={`target-emoji ${hovered ? 'hovering' : (isStatic ? '' : 'idle-float')} ${burst ? 'burst' : ''}`}
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
        className={`target-emoji ${moving ? 'target-clickable' : ''} ${clicked ? 'burst' : 'idle-pulse'}`}
        style={{ 
          top: position.top, 
          left: position.left, 
          position: 'absolute', 
          transform: 'translate(-50%, -50%)', 
          transition: moving ? 'top 0.4s, left 0.4s' : 'none',
          cursor: 'pointer'
        }}
        onClick={handleClick}
      >
        {target}
      </div>
    </div>
  );
}

function CustomCursor({ image, size = 100, offsetX = 50, offsetY = 50, rotateOnClick = false }) {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [isClicked, setIsClicked] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const rotation = (rotateOnClick && isClicked) ? 'rotate(-35deg)' : 'rotate(0deg)';

  return (
    <div style={{
      position: 'fixed',
      left: pos.x,
      top: pos.y,
      width: size,
      height: size,
      transform: `translate(-${offsetX}px, -${offsetY}px) ${rotation}`,
      transition: rotateOnClick ? 'transform 0.05s ease' : 'none',
      transformOrigin: '70% 70%',
      pointerEvents: 'none',
      zIndex: 9999,
      backgroundImage: `url(${image})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
    }} />
  );
}

// --- WATERING LEVEL ---
export function WateringLevel({ targets, totalTasks, onProgress }) {
  const [plants, setPlants] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  
  useEffect(() => {
    const cols = Math.ceil(Math.sqrt(totalTasks * 1.5));
    const rows = Math.ceil(totalTasks / cols);
    const cellWidth = 80 / cols;
    const cellHeight = 60 / rows;
    
    const newPlants = Array.from({ length: totalTasks }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        id: i,
        targetEmoji: targets[i % targets.length] || '🌻',
        watered: false,
        progress: 0,
        x: 10 + col * cellWidth + Math.random() * (cellWidth * 0.5), 
        y: 20 + row * cellHeight + Math.random() * (cellHeight * 0.5)  
      };
    });
    setPlants(newPlants);
  }, [targets, totalTasks]);

  useEffect(() => {
    if (hoveredId === null) return;
    
    const interval = setInterval(() => {
      setPlants(prev => prev.map(p => {
        if (p.id === hoveredId && !p.watered) {
          const newProgress = p.progress + 5; 
          if (newProgress >= 100) {
            sounds.taskComplete();
            onProgress();
            return { ...p, progress: 100, watered: true }; 
          }
          return { ...p, progress: newProgress };
        }
        return p;
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [hoveredId, onProgress]);

  return (
    <div className="mechanic-container hover-bg" style={{ cursor: 'none' }}>
      <CustomCursor image="/watering-can.svg" size={140} offsetX={70} offsetY={70} />
      <InlineTutorial type="hover" title="¡Riega las plantas!" subtitle="Riega las plantas posando la Jarra de agua encima de ellas por dos segundos." />
      {plants.map(p => (
        <div key={p.id} 
             style={{ position: 'absolute', cursor: 'inherit', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
             onMouseEnter={() => setHoveredId(p.id)}
             onMouseLeave={() => setHoveredId(null)}>
           <div className={`target-emoji ${p.watered ? 'happy-pop' : ''}`} style={{ filter: p.watered ? 'none' : 'grayscale(0.8) opacity(0.8)', transition: 'filter 0.5s' }}>
             {p.watered ? p.targetEmoji : '🌱'}
           </div>
           {!p.watered && p.progress > 0 && (
             <div className="scroll-progress-bar" style={{ width: '80px', height: '12px', marginTop: '15px', border: '2px solid rgba(0,0,0,0.2)' }}>
               <div className="scroll-progress-fill" style={{ width: `${p.progress}%`, background: '#2196F3' }} />
             </div>
           )}
        </div>
      ))}
    </div>
  );
}

// --- FALLING APPLES LEVEL ---
export function FallingApplesLevel({ target, totalTasks, onProgress }) {
  const [apples, setApples] = useState([]);
  
  useEffect(() => {
    let idCounter = 0;
    const spawnInterval = setInterval(() => {
      setApples(prev => {
        const caughtCount = prev.filter(a => a.caught).length;
        if (caughtCount >= totalTasks) return prev;
        
        return [...prev, {
          id: idCounter++,
          x: 15 + Math.random() * 70,
          y: -15, 
          caught: false,
          missed: false
        }];
      });
    }, 1200); 
    return () => clearInterval(spawnInterval);
  }, [totalTasks]);

  useEffect(() => {
    const fallInterval = setInterval(() => {
      setApples(prev => prev.map(a => {
        if (a.caught || a.missed) return a;
        const newY = a.y + 1.2;
        if (newY > 110) return { ...a, missed: true };
        return { ...a, y: newY };
      }));
    }, 50);
    return () => clearInterval(fallInterval);
  }, []);

  const handleHover = (id) => {
    setApples(prev => prev.map(a => {
      if (a.id === id && !a.caught && !a.missed) {
        sounds.taskComplete();
        onProgress();
        return { ...a, caught: true };
      }
      return a;
    }));
  };

  const caughtCount = apples.filter(a => a.caught).length;

  return (
    <div className="mechanic-container hover-bg" style={{ overflow: 'hidden', cursor: 'none' }}>
      <CustomCursor image="/basket.svg" size={120} offsetX={60} offsetY={60} />
      <InlineTutorial type="hover" title="¡Atrapa las manzanas!" subtitle="Atrapa las manzanas con la cesta antes que se caigan." />
      
      <div style={{ position: 'absolute', top: '-25%', left: '50%', transform: 'translateX(-50%)', fontSize: '30rem', opacity: 0.15, pointerEvents: 'none', userSelect: 'none' }}>🌳</div>

      <div style={{ position: 'absolute', bottom: '20px', left: '30px', fontSize: '5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
        🧺 <span style={{ fontSize: '2rem', fontWeight: 'bold', background: 'rgba(255,255,255,0.8)', padding: '5px 15px', borderRadius: '20px' }}>{caughtCount} / {totalTasks}</span>
      </div>

      {apples.map(a => !a.caught && !a.missed && (
        <div key={a.id}
             onMouseEnter={() => handleHover(a.id)}
             style={{ position: 'absolute', left: `${a.x}%`, top: `${a.y}%`, fontSize: '4.5rem', cursor: 'inherit', transition: 'top 0.05s linear', transform: 'translateX(-50%)' }}>
          {target}
        </div>
      ))}
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
export function DragDropLevel({ targets, bin, totalTasks, onProgress, onComplete }) {
  const [items, setItems] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate items scattered around the center (bin)
    const newItems = Array.from({ length: totalTasks }, (_, i) => {
      // Angle from 0 to 2PI
      const angle = Math.random() * Math.PI * 2;
      // Distance from center (avoiding the exact center where the bin is)
      const radius = 150 + Math.random() * 200; 
      
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      return {
        id: i,
        emoji: targets[i % targets.length],
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        dropped: false
      };
    });
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
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      // Check distance to center bin
      const dist = Math.sqrt(Math.pow(item.x - cx, 2) + Math.pow(item.y - cy, 2));
      
      if (dist < 100) { // Dropped close enough to the bin
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
        title="¡Guarda los objetos en el centro!" 
        subtitle="Arrastra todos los objetos dispersos hacia el contenedor en el centro." 
      />

      <div className="drag-area" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, border: 'none', background: 'transparent' }}>
        {items.map(item => !item.dropped && (
          <div
            key={item.id}
            className={`target-emoji draggable idle-float ${draggedId === item.id ? 'grabbing' : ''}`}
            style={{ position: 'absolute', left: 0, top: 0, transform: `translate(${item.x}px, ${item.y}px)`, zIndex: draggedId === item.id ? 100 : 10 }}
            onMouseDown={(e) => handleMouseDown(e, item)}
          >
            {item.emoji}
          </div>
        ))}

        <div className="bin-emoji" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '10rem', opacity: 0.8, zIndex: 1 }}>
          {bin}
        </div>
      </div>
    </div>
  );
}

// --- SCROLL LEVEL ---
export function ScrollLevel({ target, multiple, onComplete }) {
  const [scrolledCount, setScrolledCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const requiredScrolls = multiple ? 3 : 1;

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const progress = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    setScrollProgress(Math.min(progress, 100));

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      if (scrolledCount < requiredScrolls) {
        sounds.taskComplete();
        setScrolledCount(prev => prev + 1);
        if (scrolledCount + 1 === requiredScrolls) {
           // Wait a bit, then finish
        } else {
           // Reset scroll to top for next exercise
           e.target.scrollTop = 0;
           setScrollProgress(0);
        }
      }
    }
  };

  return (
    <div className="mechanic-container scroll-bg">
      <InlineTutorial 
        type="scroll" 
        title="¡Rueda del mouse hacia abajo!" 
        subtitle={multiple ? `¡Baja hasta el final ${requiredScrolls} veces!` : "Usa la ruedita del mouse para bajar hasta el final."} 
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
              {scrolledCount >= requiredScrolls ? '¡Llegaste al final! 🎉' : `¡Aquí está el destino! (${scrolledCount}/${requiredScrolls})`}
            </p>
            <button
              className="btn-primary"
              onClick={() => { sounds.click(); onComplete(); }}
              disabled={scrolledCount < requiredScrolls}
              style={{ opacity: scrolledCount >= requiredScrolls ? 1 : 0.5 }}
            >
              {scrolledCount >= requiredScrolls ? '✅ ¡Lo lograste! Clic aquí' : '⬇️ Sigue bajando...'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CHECKBOX LEVEL ---
export function CheckboxLevel({ options, requiredCount, question, onComplete }) {
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
    <div className="mechanic-container checkbox-bg" style={{ position: 'relative' }}>
      <InlineTutorial 
        type="click" 
        title="Uso del CheckBox" 
        subtitle={`Los CheckBox (cuadraditos) te permiten seleccionar MÚLTIPLES opciones a la vez.`} 
      />

      <div className="checkbox-grid">
        {options.map((opt) => (
          <div 
            key={opt.id} 
            className={`checkbox-item ${checkedItems.includes(opt.id) ? 'checked' : ''} idle-float`}
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

      {question && (
        <div className="question-panel" style={{ position: 'absolute', bottom: '20px', background: 'rgba(255,255,255,0.9)', padding: '15px 30px', borderRadius: '50px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', fontSize: '1.3rem', fontWeight: 'bold' }}>
          ❓ {question}
        </div>
      )}
    </div>
  );
}

// --- RADIO LEVEL ---
export function RadioLevel({ options, correctId, question, onComplete }) {
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
    <div className="mechanic-container radio-bg" style={{ position: 'relative' }}>
      <InlineTutorial 
        type="click" 
        title="Uso del Radio Button" 
        subtitle="Los Radio Buttons (círculos) te permiten seleccionar SOLO UNA opción." 
      />

      <div className="radio-grid">
        {options.map((opt) => (
          <div 
            key={opt.id} 
            className={`radio-item ${selectedId === opt.id ? 'selected' : ''} idle-float`}
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

      {question && (
        <div className="question-panel" style={{ position: 'absolute', bottom: '20px', background: 'rgba(255,255,255,0.9)', padding: '15px 30px', borderRadius: '50px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', fontSize: '1.3rem', fontWeight: 'bold' }}>
          ❓ {question}
        </div>
      )}
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

// --- BALLOON POPPING LEVEL ---
export function BalloonPoppingLevel({ target, difficulty, onProgress, totalTasks }) {
  const [balloons, setBalloons] = useState([]);
  
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      setBalloons(prev => {
        if (prev.length > 6) return prev;
        return [...prev, { id: Date.now() + Math.random(), left: 10 + Math.random() * 80 }];
      });
    }, 800);
    return () => clearInterval(spawnInterval);
  }, []);

  const handlePop = (id) => {
    sounds.click();
    sounds.taskComplete();
    setBalloons(prev => prev.filter(b => b.id !== id));
    onProgress();
  };

  let animDuration = '6s';
  if (difficulty === 2) animDuration = '4s';
  if (difficulty === 3) animDuration = '2.5s';

  return (
    <div className="mechanic-container balloons-bg" style={{ position: 'relative', overflow: 'hidden', cursor: 'crosshair' }}>
      <InlineTutorial 
        type="click" 
        title="¡Pincha los globos!" 
        subtitle="Haz clic sobre los globos antes de que se escapen." 
      />
      {balloons.map(b => (
        <div
          key={b.id}
          className="balloon"
          style={{ left: `${b.left}%`, animationDuration: animDuration }}
          onMouseDown={() => handlePop(b.id)}
        >
          {target}
        </div>
      ))}
    </div>
  );
}

// --- WHACK-A-MOLE LEVEL ---
export function WhackAMoleLevel({ target, difficulty, onProgress, totalTasks }) {
  const [activeMole, setActiveMole] = useState(null);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setActiveMole(Math.floor(Math.random() * 6));
    }, 900);
    return () => clearInterval(moveInterval);
  }, []);

  const handleWhack = (index) => {
    if (activeMole === index) {
      sounds.click();
      sounds.taskComplete();
      setActiveMole(null);
      onProgress();
    }
  };

  return (
    <div className="mechanic-container mole-bg" style={{ cursor: 'none' }}>
      <CustomCursor image="/hammer.png" size={130} offsetX={65} offsetY={65} rotateOnClick={true} />
      <InlineTutorial 
        type="click" 
        title="¡Juego del Topo!" 
        subtitle="Haz clic rápido en el topo cuando se asome por un agujero." 
      />
      <div className="mole-grid">
        {[0, 1, 2, 3, 4, 5].map(index => (
          <div key={index} className="mole-hole">
            <div 
              className={`mole-character ${activeMole === index ? 'up' : 'down'}`}
              onMouseDown={() => handleWhack(index)}
            >
              <img src="/mole.png" alt="Topo" style={{ width: '200px', height: '200px', objectFit: 'contain' }} />
            </div>
            <div className="mole-dirt"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

