import React, { useState, useEffect, useRef } from 'react';
import './Intro.css';

function Intro({ onNavigate }) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState('¡Hola! Soy Ratoncito, tu guía. ¡Haz clic en Comenzar para iniciar!');
  
  const voiceAudioRef = useRef(null);
  const bgMusicRef = useRef(null);

  const startIntro = () => {
    setHasStarted(true);
    setIsPlaying(true);
    
    // Play background music softly
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.15;
      bgMusicRef.current.play().catch(e => console.log("BG Music playback failed:", e));
    }
    
    // Play the voice instruction
    if (voiceAudioRef.current) {
      voiceAudioRef.current.volume = 1.0;
      voiceAudioRef.current.play().catch(e => console.log("Voice audio playback failed:", e));
    }
  };

  const skipIntro = () => {
    // Stop all audio before navigating
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
    }
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }
    onNavigate('menu');
  };

  // Adjust subtitles as audio plays
  const handleTimeUpdate = () => {
    if (!voiceAudioRef.current) return;
    const time = voiceAudioRef.current.currentTime;
    
    // Subtitles timed dynamically based on typical audio duration
    if (time < 3) {
      setSubtitle('¡Hola, amiguito! Bienvenido a nuestra plataforma de Juega y Aprende. 🎉');
    } else if (time < 6) {
      setSubtitle('¡Aquí vamos a divertirnos mucho y a aprender a usar el ratón o mouse de la computadora! 🖱️');
    } else if (time < 9) {
      setSubtitle('¡Presta mucha atención a las instrucciones y completemos todas las tareas juntos! ⭐');
    } else {
      setSubtitle('¿Estás listo? ¡Haz clic en Saltar y empecemos la diversión! 🚀');
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup audio when component unmounts
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
      }
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, []);

  return (
    <div className="intro-container">
      {/* Audio elements */}
      <audio 
        ref={voiceAudioRef} 
        src="/sounds/bienvenida.mp3" 
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipIntro}
      />
      <audio 
        ref={bgMusicRef} 
        src="/sounds/fondo-juego.mp3" 
        loop 
      />

      {!hasStarted ? (
        <div className="welcome-screen">
          <div className="welcome-card animated-card">
            <img src="/logo.png" alt="Juega y Aprende" className="welcome-logo" style={{ maxWidth: '320px', width: '90%', height: 'auto', marginBottom: '1.5rem' }} />
            
            <button className="start-btn pulse-btn" onClick={startIntro}>
              ¡Comenzar! 🎮🐭
            </button>
          </div>
        </div>
      ) : (
        <div className="animation-screen">
          {/* Top Skip Button */}
          <button className="skip-btn" onClick={skipIntro}>
            Saltar Intro ➔
          </button>

          {/* Speech Bubble */}
          <div className="speech-bubble-container">
            <div className="speech-bubble">
              <p>{subtitle}</p>
            </div>
            <div className="speech-bubble-tip"></div>
          </div>

          <div className="mouse-character-container">
            <svg width="240" height="280" viewBox="0 0 240 280" className={`mouse-svg ${isPlaying ? 'talking-anim' : ''}`} style={{ filter: 'drop-shadow(0 10px 20px rgba(92, 107, 192, 0.2))' }}>
              <defs>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fff8e7" />
                  <stop offset="100%" stopColor="#f5e0bd" />
                </linearGradient>
                <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFCA28" />
                  <stop offset="100%" stopColor="#FF8F00" />
                </linearGradient>
                <linearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#b9c6fe" />
                  <stop offset="100%" stopColor="#8d9eff" />
                </linearGradient>
              </defs>

              {/* Tail */}
              <path d="M 120,230 Q 60,260 40,220" fill="none" stroke="#3f51b5" strokeWidth="5" strokeLinecap="round" />

              {/* Feet */}
              <ellipse cx="90" cy="245" rx="20" ry="12" fill="#B0BEC5" stroke="#3f51b5" strokeWidth="4" />
              <ellipse cx="150" cy="245" rx="20" ry="12" fill="#B0BEC5" stroke="#3f51b5" strokeWidth="4" />

              {/* Body (Shirt) */}
              <path d="M 80,180 C 70,240 170,240 160,180 Z" fill="url(#shirtGrad)" stroke="#3f51b5" strokeWidth="4" />
              {/* Controller Icon on Shirt */}
              <text x="120" y="215" fontSize="22" textAnchor="middle" style={{ userSelect: 'none' }}>🎮</text>

              {/* Left Hand */}
              <circle cx="65" cy="195" r="14" fill="#CFD8DC" stroke="#3f51b5" strokeWidth="4" />

              {/* Right Hand (Waving) */}
              <g className="wave-hand" style={{ transformOrigin: '175px 195px' }}>
                <circle cx="175" cy="195" r="14" fill="#CFD8DC" stroke="#3f51b5" strokeWidth="4" />
              </g>

              {/* Ears */}
              {/* Left Ear */}
              <g>
                <circle cx="70" cy="100" r="42" fill="url(#earGrad)" stroke="#3f51b5" strokeWidth="5" />
                <circle cx="70" cy="100" r="26" fill="#FF8A80" />
              </g>
              {/* Right Ear */}
              <g>
                <circle cx="170" cy="100" r="42" fill="url(#earGrad)" stroke="#3f51b5" strokeWidth="5" />
                <circle cx="170" cy="100" r="26" fill="#FF8A80" />
              </g>

              {/* Head */}
              <ellipse cx="120" cy="145" rx="66" ry="56" fill="url(#bodyGrad)" stroke="#3f51b5" strokeWidth="5" />

              {/* Blush Cheeks */}
              <ellipse cx="75" cy="160" rx="10" ry="6" fill="rgba(255, 64, 129, 0.45)" />
              <ellipse cx="165" cy="160" rx="10" ry="6" fill="rgba(255, 64, 129, 0.45)" />

              {/* Whiskers */}
              <line x1="65" y1="150" x2="40" y2="145" stroke="#263238" strokeWidth="3" strokeLinecap="round" />
              <line x1="65" y1="156" x2="42" y2="158" stroke="#263238" strokeWidth="3" strokeLinecap="round" />
              <line x1="175" y1="150" x2="200" y2="145" stroke="#263238" strokeWidth="3" strokeLinecap="round" />
              <line x1="175" y1="156" x2="198" y2="158" stroke="#263238" strokeWidth="3" strokeLinecap="round" />

              {/* Eyes */}
              <g>
                {/* Left Eye */}
                <ellipse cx="96" cy="135" rx="11" ry="16" fill="#263238" style={{ animation: 'blinkEyes 4s infinite', transformOrigin: '96px 135px' }} />
                <circle cx="100" cy="129" r="3" fill="#ffffff" />
                
                {/* Right Eye */}
                <ellipse cx="144" cy="135" rx="11" ry="16" fill="#263238" style={{ animation: 'blinkEyes 4s infinite', transformOrigin: '144px 135px' }} />
                <circle cx="148" cy="129" r="3" fill="#ffffff" />
              </g>

              {/* Nose */}
              <ellipse cx="120" cy="150" rx="13" ry="9" fill="#FF8A80" stroke="#3f51b5" strokeWidth="3" />

              {/* Mouth */}
              <ellipse 
                cx="120" 
                cy="172" 
                rx="14" 
                ry="6" 
                fill="#263238" 
                className={isPlaying ? 'talking-mouth-svg' : ''} 
                style={{ transformOrigin: '120px 172px', transition: 'all 0.1s ease' }} 
              />
            </svg>
          </div>

          {/* Play/Pause controls for voice */}
          <div className="voice-controls">
            <button 
              className="control-audio-btn" 
              onClick={() => {
                if (voiceAudioRef.current) {
                  if (isPlaying) {
                    voiceAudioRef.current.pause();
                  } else {
                    voiceAudioRef.current.play().catch(e => console.log(e));
                  }
                  setIsPlaying(!isPlaying);
                }
              }}
            >
              {isPlaying ? '⏸️ Pausar Audio' : '▶️ Escuchar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Intro;
