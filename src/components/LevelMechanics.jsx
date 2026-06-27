import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/sounds';
import './LevelMechanics.css';

function getRandomPosition() {
  return {
    top: `${18 + Math.random() * 58}%`,
    left: `${12 + Math.random() * 68}%`,
  };
}

// Cartoon Mouse Mascot Component (Cute vector mouse caricatured for kids)
export function CartoonMouseMascot({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="cartoon-mouse-svg" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>
      {/* Ears */}
      <circle cx="25" cy="35" r="18" fill="#a0aab2" />
      <circle cx="25" cy="35" r="11" fill="#ffa6c9" />
      <circle cx="75" cy="35" r="18" fill="#a0aab2" />
      <circle cx="75" cy="35" r="11" fill="#ffa6c9" />
      
      {/* Body / Hands pointing */}
      <path d="M 30 80 Q 50 70 70 80 L 75 100 L 25 100 Z" fill="#8e99a2" />
      <circle cx="28" cy="82" r="5" fill="#a0aab2" />
      <circle cx="72" cy="82" r="5" fill="#a0aab2" />
      
      {/* Head */}
      <circle cx="50" cy="58" r="26" fill="#b0bac2" />
      
      {/* Cheeks */}
      <circle cx="35" cy="64" r="5" fill="#ffccd5" opacity="0.9" />
      <circle cx="65" cy="64" r="5" fill="#ffccd5" opacity="0.9" />
      
      {/* Eyes */}
      <circle cx="42" cy="50" r="4.5" fill="#2d3748" />
      <circle cx="41" cy="48" r="1.5" fill="#ffffff" />
      <circle cx="43" cy="51" r="0.8" fill="#ffffff" />
      
      <circle cx="58" cy="50" r="4.5" fill="#2d3748" />
      <circle cx="57" cy="48" r="1.5" fill="#ffffff" />
      <circle cx="59" cy="51" r="0.8" fill="#ffffff" />
      
      {/* Nose */}
      <ellipse cx="50" cy="60" rx="4" ry="2.8" fill="#ff758f" />
      
      {/* Mouth */}
      <path d="M 46 65 Q 50 69 54 65" fill="none" stroke="#2d3748" strokeWidth="2" strokeLinecap="round" />
      
      {/* Whiskers */}
      <line x1="28" y1="60" x2="16" y2="58" stroke="#4a5568" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="27" y1="64" x2="14" y2="65" stroke="#4a5568" strokeWidth="1.2" strokeLinecap="round" />
      
      <line x1="72" y1="60" x2="84" y2="58" stroke="#4a5568" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="73" y1="64" x2="86" y2="65" stroke="#4a5568" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// Inline Tutorial Component
function InlineTutorial({ type, title, subtitle }) {
  return null;
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
export function DoubleClickLevel({ target, isStatic, onComplete }) {
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
        className={`target-emoji target-double ${isStatic ? 'target-clickable-static' : 'target-clickable idle-bounce'} ${flash ? 'burst' : ''}`}
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
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width || window.innerWidth * 0.8;
    const height = rect.height || window.innerHeight * 0.6;
    
    // Approximate size of the emoji element
    const emojiSize = 110;
    
    // Generate items scattered around the edges (left and right sides)
    const newItems = [];
    
    for (let i = 0; i < totalTasks; i++) {
      let x, y;
      let attempts = 0;
      let valid = false;
      
      while (!valid && attempts < 150) {
        attempts++;
        
        // Alternate items between left side and right side of the screen
        if (i % 2 === 0) {
          // Left column: from 120px (left safety) to 28% of container width (far from center)
          const minLeft = 120;
          const maxLeft = Math.max(minLeft + 10, width * 0.28 - emojiSize);
          x = minLeft + Math.random() * (maxLeft - minLeft);
        } else {
          // Right column: from 72% of container width (far from center) to width - 200px (right safety)
          const minRight = width * 0.72;
          const maxRight = Math.max(minRight + 10, width - 200);
          x = minRight + Math.random() * (maxRight - minRight);
        }
        
        // Height: avoid the top tutorial bubble (first 180px) and the bottom boundary (last 130px)
        const minTop = 180;
        const maxTop = Math.max(minTop + 10, height - 130 - emojiSize);
        y = minTop + Math.random() * (maxTop - minTop);
        
        // Verify this position doesn't overlap any previously placed items (at least 95px distance)
        valid = true;
        for (const item of newItems) {
          const dist = Math.sqrt(Math.pow(x - item.x, 2) + Math.pow(y - item.y, 2));
          if (dist < 95) {
            valid = false;
            break;
          }
        }
      }
      
      newItems.push({
        id: i,
        emoji: targets[i % targets.length],
        x,
        y,
        dropped: false
      });
    }
    setItems(newItems);
  }, [targets, totalTasks]);

  const handleMouseDown = (e, item) => {
    if (item.dropped) return;
    sounds.drag();
    setDraggedId(item.id);
    setStartPos({ x: e.clientX - item.x, y: e.clientY - item.y });
  };

  const handleMouseMove = (e) => {
    if (draggedId !== null && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let newX = e.clientX - startPos.x;
      let newY = e.clientY - startPos.y;
      
      // Constrain inside container bounds with safety margins
      newX = Math.max(40, Math.min(newX, rect.width - 150));
      newY = Math.max(160, Math.min(newY, rect.height - 140));

      setItems(prev => prev.map(item => 
        item.id === draggedId ? { ...item, x: newX, y: newY } : item
      ));
    }
  };

  const handleMouseUp = () => {
    if (draggedId !== null && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const item = items.find(i => i.id === draggedId);
      
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      
      // Check distance to center bin relative to container center
      const dist = Math.sqrt(Math.pow(item.x - cx, 2) + Math.pow(item.y - cy, 2));
      
      if (dist < 110) { // Dropped close enough to the bin
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
    <div ref={containerRef} className="mechanic-container drag-container drag-bg" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
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
            style={{ position: 'absolute', left: `${item.x}px`, top: `${item.y}px`, zIndex: draggedId === item.id ? 100 : 10 }}
            onMouseDown={(e) => handleMouseDown(e, item)}
          >
            {item.emoji}
          </div>
        ))}

        <div className="bin-emoji" style={{ position: 'absolute', left: '50%', top: '55%', transform: 'translate(-50%, -50%)', fontSize: '10rem', opacity: 0.8, zIndex: 1 }}>
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
    let speed = 1650; // Básico (más lento para niños)
    if (difficulty === 2) speed = 1000; // Intermedio
    if (difficulty === 3) speed = 650;  // Avanzado

    const moveInterval = setInterval(() => {
      setActiveMole(prev => {
        let nextMole = Math.floor(Math.random() * 6);
        while (nextMole === prev) {
          nextMole = Math.floor(Math.random() * 6);
        }
        return nextMole;
      });
    }, speed);
    return () => clearInterval(moveInterval);
  }, [difficulty]);

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

// --- EGG BREAK LEVEL ---
export function EggBreakLevel({ totalTasks, onProgress }) {
  const [eggs, setEggs] = useState([]);
  
  useEffect(() => {
    const cols = Math.ceil(Math.sqrt(totalTasks * 1.5));
    const rows = Math.ceil(totalTasks / cols);
    const cellWidth = 80 / cols;
    const cellHeight = 60 / rows;
    
    const newEggs = Array.from({ length: totalTasks }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        id: i,
        isBroken: false,
        x: 10 + col * cellWidth + Math.random() * (cellWidth * 0.4),
        y: 20 + row * cellHeight + Math.random() * (cellHeight * 0.4)
      };
    });
    setEggs(newEggs);
  }, [totalTasks]);

  const handleDoubleClick = (id) => {
    setEggs(prev => prev.map(egg => {
      if (egg.id === id && !egg.isBroken) {
        sounds.doubleClick();
        sounds.taskComplete();
        onProgress();
        return { ...egg, isBroken: true };
      }
      return egg;
    }));
  };

  return (
    <div className="mechanic-container double-bg">
      <InlineTutorial 
        type="doubleclick" 
        title="¡Rompe los huevos!" 
        subtitle="Haz doble clic rápido sobre cada huevo para que nazca el pollito en su cascarón." 
      />

      {eggs.map(egg => (
        <div
          key={egg.id}
          style={{ 
            position: 'absolute', 
            left: `${egg.x}%`, 
            top: `${egg.y}%`, 
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div
            className={`target-emoji target-clickable-static ${egg.isBroken ? 'happy-pop' : ''}`}
            style={{ 
              fontSize: '7.5rem',
              userSelect: 'none',
              cursor: 'pointer'
            }}
            onDoubleClick={() => handleDoubleClick(egg.id)}
          >
            {egg.isBroken ? '🐣' : '🥚'}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- FOLDER OPEN LEVEL (Level 9) ---
export function FolderOpenLevel({ totalTasks, onProgress }) {
  const [openedItem, setOpenedItem] = useState(null);
  const [openedIds, setOpenedIds] = useState([]);

  const desktopItems = [
    { id: 1, type: 'folder', name: 'Imágenes', icon: '📁', content: '🖼️ Paisaje.png 🐱 Gato.jpg 🌸 Flor.png' },
    { id: 2, type: 'program', name: 'Paint 🎨', icon: '🎨', content: '🖌️ Dibujando un sol... ☀️' },
    { id: 3, type: 'folder', name: 'Documentos', icon: '📁', content: '📄 Tarea.docx 📄 Cuento.pdf 📄 Notas.txt' },
    { id: 4, type: 'program', name: 'Juegos 🎮', icon: '🎮', content: '👾 ¡Cargando marcianitos! 🚀' },
    { id: 5, type: 'program', name: 'Internet 🌐', icon: '🌐', content: '🔍 Google - Buscar... 🖥️' },
    { id: 6, type: 'folder', name: 'Videos', icon: '📁', content: '🎥 DibujosAnimados.mp4 🎥 Cancion.mp4' },
    { id: 7, type: 'program', name: 'Calculadora 🧮', icon: '🧮', content: '1 + 1 = 2 🎯 5 + 5 = 10' },
    { id: 8, type: 'folder', name: 'Papelera', icon: '🗑️', content: '🗑️ Papelera vacía' },
    { id: 9, type: 'program', name: 'Notas 📝', icon: '📝', content: '📝 Hola amigo! Bienvenido' },
    { id: 10, type: 'folder', name: 'Música', icon: '📁', content: '🎵 Canción.mp3 🎵 Piano.wav 🎵 Melodía.mp3' },
    // Next 5 for medium difficulty (totalTasks = 15)
    { id: 11, type: 'folder', name: 'Descargas', icon: '📁', content: '⬇️ Instalador.exe ⬇️ FotoDeFondo.png' },
    { id: 12, type: 'program', name: 'Cámara 📷', icon: '📷', content: '📷 ¡Sonríe para la foto! 📸' },
    { id: 13, type: 'program', name: 'Correo ✉️', icon: '✉️', content: '📧 Tienes 3 correos nuevos! 📬' },
    { id: 14, type: 'folder', name: 'Tareas', icon: '📁', content: '📝 Matemáticas 📝 Ciencias 📝 Inglés' },
    { id: 15, type: 'program', name: 'Calendario 📅', icon: '📅', content: '📅 Junio 2026 - ¡Día de juegos!' },
    // Next 5 for advanced difficulty (totalTasks = 20)
    { id: 16, type: 'program', name: 'Música 🎧', icon: '🎧', content: '🎧 Sonando: Música Tropical 🎶' },
    { id: 17, type: 'folder', name: 'Dibujos', icon: '📁', content: '🎨 Carro.png 🎨 Casa.png 🎨 Castillo.png' },
    { id: 18, type: 'program', name: 'Mapas 🧭', icon: '🧭', content: '🗺️ Mapa de la isla del tesoro 🏴‍☠️' },
    { id: 19, type: 'folder', name: 'Libros', icon: '📁', content: '📖 El Principito 📖 Don Quijote' },
    { id: 20, type: 'program', name: 'Reloj ⏰', icon: '⏰', content: '⏰ ¡Hora de jugar y aprender! ☀️' }
  ];

  const handleDoubleClick = (item) => {
    if (openedItem) return;
    sounds.doubleClick();
    setOpenedItem(item);
    if (!openedIds.includes(item.id)) {
      setOpenedIds(prev => [...prev, item.id]);
    }

    // Auto-close after exactly 2 seconds (2000ms)
    setTimeout(() => {
      setOpenedItem(null);
      sounds.taskComplete();
      onProgress();
    }, 2000);
  };

  const visibleItems = desktopItems.slice(0, Math.min(totalTasks, desktopItems.length));

  return (
    <div className="desktop-container">
      <InlineTutorial 
        type="doubleclick" 
        title="¡Explorador y Programas!" 
        subtitle={`Haz doble clic rápido en las carpetas y programas para abrirlos. ¡Completa los ${totalTasks}!`} 
      />

      <div className="desktop-grid">
        {visibleItems.map(item => {
          const isOpened = openedIds.includes(item.id);
          return (
            <div 
              key={item.id} 
              className="desktop-icon"
              style={{ opacity: isOpened ? 0.4 : 1, transition: 'opacity 0.3s' }}
              onDoubleClick={() => handleDoubleClick(item)}
            >
              <div className="desktop-icon-emoji">
                {openedItem?.id === item.id && item.type === 'folder' ? '📂' : item.icon}
              </div>
              <div className="desktop-icon-label">{item.name}</div>
            </div>
          );
        })}
      </div>

      {openedItem && (
        <div className="windows-window">
          <div className="windows-titlebar">
            <span>{openedItem.icon}</span>
            <span className="windows-title">
              {openedItem.type === 'folder' ? 'Carpeta' : 'Programa'}: {openedItem.name}
            </span>
            <div className="windows-controls">
              <button className="windows-btn" disabled>_</button>
              <button className="windows-btn close-btn" disabled>✕</button>
            </div>
          </div>
          <div className="windows-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', color: '#0078D7', background: '#fff', textAlign: 'center', padding: '30px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '15px' }}>{openedItem.icon}</div>
            <div>{openedItem.content}</div>
            <div style={{ fontSize: '0.9rem', color: '#999', marginTop: '25px', fontWeight: 'normal' }}>
              ⏱️ Cerrando automáticamente...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- MAZE LEVEL ---
export function MazeLevel({ targets, totalTasks, difficulty = 1, onProgress, onComplete }) {
  const [round, setRound] = useState(0);
  const [items, setItems] = useState([]);
  const [draggedId, setDraggedId] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [collisionActive, setCollisionActive] = useState(false);
  const containerRef = useRef(null);

  // Maze board dimensions in virtual coordinates
  const BOARD_WIDTH = 800;
  const BOARD_HEIGHT = 500;

  const getLayoutType = (r) => {
    if (difficulty === 1) {
      if (r === 0) return 'D';
      if (r === 1) return 'A';
      return 'B';
    } else if (difficulty === 2) {
      if (r === 0) return 'A';
      if (r === 1) return 'B';
      return 'C';
    } else {
      if (r === 0) return 'B';
      if (r === 1) return 'C';
      return 'E';
    }
  };

  const layoutType = getLayoutType(round);

  // Start Zone is always at top-left
  const START_ZONE = { x: 20, y: 20, width: 140, height: 120 };

  // Finish Zone (Folder) is bottom-left for Laberinto 2 (round 1), and bottom-right for Laberintos 1 & 3 (rounds 0 & 2)
  const FINISH_ZONE = round === 1
    ? { x: 20, y: 350, width: 140, height: 130 }
    : { x: 640, y: 350, width: 140, height: 130 };

  const itemSize = 65; // Emojis size (65px)

  // Dynamic wall structures based on difficulty and round
  const getWallsForRound = (r) => {
    const boundaries = [
      { x: 0, y: 0, width: BOARD_WIDTH, height: 20, id: 'boundary-top' },
      { x: 0, y: BOARD_HEIGHT - 20, width: BOARD_WIDTH, height: 20, id: 'boundary-bottom' },
      { x: 0, y: 0, width: 20, height: BOARD_HEIGHT, id: 'boundary-left' },
      { x: BOARD_WIDTH - 20, y: 0, width: 20, height: BOARD_HEIGHT, id: 'boundary-right' },
    ];

    const currentLayout = getLayoutType(r);

    if (currentLayout === 'A') {
      // 1 horizontal wall (leaves gap on the RIGHT)
      return [
        ...boundaries,
        { x: 20, y: 240, width: 620, height: 25, id: 'wall-mid-1' }
      ];
    } else if (currentLayout === 'B') {
      // 2 horizontal walls (S-shape, first gap on right, second gap on left)
      return [
        ...boundaries,
        { x: 20, y: 160, width: 620, height: 25, id: 'wall-mid-1' },  // gap on right
        { x: 160, y: 310, width: 620, height: 25, id: 'wall-mid-2' }  // gap on left
      ];
    } else if (currentLayout === 'C') {
      // 3 vertical walls (Comb)
      return [
        ...boundaries,
        { x: 180, y: 20, width: 25, height: 340, id: 'wall-hard-1' },
        { x: 370, y: 140, width: 25, height: 340, id: 'wall-hard-2' },
        { x: 550, y: 20, width: 25, height: 340, id: 'wall-hard-3' }
      ];
    } else if (currentLayout === 'D') {
      // Center box obstacle (Ring path) - simplified for easy passage
      return [
        ...boundaries,
        { x: 260, y: 140, width: 280, height: 220, id: 'wall-center-box' }
      ];
    } else {
      // 3 horizontal walls layout creating a 4-corridor S-shape path (gaps: right, left, right)
      return [
        ...boundaries,
        { x: 20, y: 130, width: 620, height: 20, id: 'wall-hybrid-1' },  // gap on right
        { x: 160, y: 250, width: 620, height: 20, id: 'wall-hybrid-2' }, // gap on left
        { x: 20, y: 370, width: 620, height: 20, id: 'wall-hybrid-3' }   // gap on right
      ];
    }
  };

  const WALLS = getWallsForRound(round);

  const getEmojisForRound = (r) => {
    const startIdx = r * 2;
    return targets.slice(startIdx, startIdx + 2);
  };

  useEffect(() => {
    // Generate initial items scattered in the START_ZONE for the current round
    const roundEmojis = getEmojisForRound(round);
    const newItems = roundEmojis.map((emoji, index) => {
      const cols = 2;
      const startX = START_ZONE.x + 15 + (index % cols) * 55;
      const startY = START_ZONE.y + 15 + Math.floor(index / cols) * 55;
      return {
        id: index,
        emoji,
        startX,
        startY,
        x: startX,
        y: startY,
        dropped: false
      };
    });
    setItems(newItems);
  }, [round, targets]);

  const handlePointerDown = (e, item) => {
    if (item.dropped) return;
    sounds.drag();
    setDraggedId(item.id);
    e.currentTarget.setPointerCapture(e.pointerId);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setStartPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handlePointerMove = (e) => {
    if (draggedId === null || !containerRef.current) return;

    const containerRect = containerRef.current.querySelector('.maze-board').getBoundingClientRect();
    
    // Scale mapping between actual rendered size and virtual size (800x500)
    const scaleX = containerRect.width / BOARD_WIDTH;
    const scaleY = containerRect.height / BOARD_HEIGHT;

    let newX = (e.clientX - containerRect.left) / scaleX - startPos.x;
    let newY = (e.clientY - containerRect.top) / scaleY - startPos.y;

    // Constrain inside container bounds allowing overlap with borders for collision detection
    newX = Math.max(0, Math.min(newX, BOARD_WIDTH - itemSize));
    newY = Math.max(0, Math.min(newY, BOARD_HEIGHT - itemSize));

    // Bounding box collision detection
    const itemBox = { x: newX, y: newY, width: itemSize, height: itemSize };
    let collided = false;

    for (const wall of WALLS) {
      if (
        itemBox.x < wall.x + wall.width &&
        itemBox.x + itemBox.width > wall.x &&
        itemBox.y < wall.y + wall.height &&
        itemBox.y + itemBox.height > wall.y
      ) {
        collided = true;
        break;
      }
    }

    if (collided) {
      sounds.error();
      setCollisionActive(true);
      setTimeout(() => setCollisionActive(false), 400);

      // Reset item to start position and end drag
      setItems(prev => prev.map(item => 
        item.id === draggedId ? { ...item, x: item.startX, y: item.startY } : item
      ));
      setDraggedId(null);
      return;
    }

    // Check if center of the item reached the meta (Finish Zone)
    const centerX = newX + itemSize / 2;
    const centerY = newY + itemSize / 2;
    const reachedFinish = 
      centerX >= FINISH_ZONE.x &&
      centerX <= FINISH_ZONE.x + FINISH_ZONE.width &&
      centerY >= FINISH_ZONE.y &&
      centerY <= FINISH_ZONE.y + FINISH_ZONE.height;

    if (reachedFinish) {
      sounds.drop();
      const dropX = FINISH_ZONE.x + 10 + (draggedId % 2) * 60;
      const dropY = FINISH_ZONE.y + 10 + Math.floor(draggedId / 2) * 55;
      
      const updatedItems = items.map(item => 
        item.id === draggedId ? { ...item, x: dropX, y: dropY, dropped: true } : item
      );
      setItems(updatedItems);
      setDraggedId(null);

      // Check if all items in this round are dropped
      const allDropped = updatedItems.every(item => item.dropped);
      if (allDropped) {
        onProgress();
        if (round < 2) {
          setTimeout(() => {
            setRound(prev => prev + 1);
          }, 800);
        }
      }
      return;
    }

    // Move item if safe
    setItems(prev => prev.map(item => 
      item.id === draggedId ? { ...item, x: newX, y: newY } : item
    ));
  };

  const handlePointerUp = (e) => {
    if (draggedId !== null) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDraggedId(null);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`mechanic-container drag-bg ${collisionActive ? 'maze-screen-shake' : ''}`}
    >
      <div className={`maze-board ${collisionActive ? 'maze-board-collision' : ''}`}>
        {/* Round Counter Overlay */}
        <div style={{
          position: 'absolute',
          top: '25px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '2px solid #3182ce',
          borderRadius: '24px',
          padding: '6px 18px',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          color: '#2b6cb0',
          boxShadow: '0 4px 10px rgba(49, 130, 206, 0.15)',
          zIndex: 5
        }}>
          Laberinto {round + 1} de 3
        </div>

        {/* Start Zone */}
        <div className="maze-zone maze-start-zone" style={{
          left: START_ZONE.x,
          top: START_ZONE.y,
          width: START_ZONE.width,
          height: START_ZONE.height
        }}>
          <span className="maze-zone-label" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.85rem' }}>
            <span>INICIO</span>
            <span style={{ fontSize: '1.8rem', marginTop: '2px' }}>💻</span>
          </span>
        </div>

        {/* Finish Zone */}
        <div className="maze-zone maze-finish-zone" style={{
          left: FINISH_ZONE.x,
          top: FINISH_ZONE.y,
          width: FINISH_ZONE.width,
          height: FINISH_ZONE.height
        }}>
          <span className="maze-zone-label" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.85rem' }}>
            <span>CARPETA</span>
            <span style={{ fontSize: '2.5rem', marginTop: '2px' }}>📁</span>
          </span>
        </div>

        {/* Walls */}
        {WALLS.map(wall => (
          <div 
            key={wall.id} 
            className={`maze-wall ${collisionActive ? 'maze-wall-flash' : ''}`} 
            style={{
              left: wall.x,
              top: wall.y,
              width: wall.width,
              height: wall.height
            }} 
          />
        ))}

        {/* Maze Items */}
        {items.map(item => (
          <div
            key={item.id}
            className={`maze-item target-emoji ${item.dropped ? 'dropped success-bounce' : 'draggable'} ${draggedId === item.id ? 'grabbing' : ''}`}
            style={{
              left: item.x,
              top: item.y,
              width: itemSize,
              height: itemSize,
              fontSize: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              zIndex: draggedId === item.id ? 100 : 10,
              cursor: item.dropped ? 'default' : 'grab',
              userSelect: 'none',
              touchAction: 'none'
            }}
            onPointerDown={(e) => handlePointerDown(e, item)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {!item.dropped && item.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}



