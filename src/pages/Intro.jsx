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
              <path d="M 120,200 Q 60,230 40,190" fill="none" stroke="#3f51b5" strokeWidth="5" strokeLinecap="round" />

              {/* Legs (connected to torso) */}
              {/* Left Leg */}
              <line x1="100" y1="190" x2="100" y2="230" stroke="#3f51b5" strokeWidth="14" strokeLinecap="round" />
              <line x1="100" y1="190" x2="100" y2="230" stroke="#a7b8ff" strokeWidth="6" strokeLinecap="round" />
              
              {/* Right Leg */}
              <line x1="140" y1="190" x2="140" y2="230" stroke="#3f51b5" strokeWidth="14" strokeLinecap="round" />
              <line x1="140" y1="190" x2="140" y2="230" stroke="#a7b8ff" strokeWidth="6" strokeLinecap="round" />

              {/* Feet */}
              <path d="M 82,242 C 82,222 112,222 112,242 Z" fill="#B0BEC5" stroke="#3f51b5" strokeWidth="4" />
              <path d="M 128,242 C 128,222 158,222 158,242 Z" fill="#B0BEC5" stroke="#3f51b5" strokeWidth="4" />

              {/* Torso / Shirt (centered and connected to legs) */}
              <path d="M 95,140 C 75,210 165,210 145,140 Z" fill="url(#shirtGrad)" stroke="#3f51b5" strokeWidth="4" />
              {/* Controller Icon on Shirt */}
              <text x="120" y="180" fontSize="18" textAnchor="middle" style={{ userSelect: 'none' }}>🎮</text>

              {/* Arms (connected to body) */}
              {/* Left Arm & Hand */}
              <g>
                <path d="M 95,150 Q 60,160 60,185" fill="none" stroke="#3f51b5" strokeWidth="14" strokeLinecap="round" />
                <path d="M 95,150 Q 60,160 60,185" fill="none" stroke="#fff8e7" strokeWidth="6" strokeLinecap="round" />
                <circle cx="60" cy="185" r="10" fill="#fff8e7" stroke="#3f51b5" strokeWidth="4" />
              </g>

              {/* Right Arm & Hand (Waving) */}
              <g className="wave-hand" style={{ transformOrigin: '145px 150px' }}>
                <path d="M 145,150 Q 180,140 180,115" fill="none" stroke="#3f51b5" strokeWidth="14" strokeLinecap="round" />
                <path d="M 145,150 Q 180,140 180,115" fill="none" stroke="#fff8e7" strokeWidth="6" strokeLinecap="round" />
                <circle cx="180" cy="115" r="10" fill="#fff8e7" stroke="#3f51b5" strokeWidth="4" />
              </g>

              {/* Ears (behind head) */}
              {/* Left Ear */}
              <g>
                <circle cx="70" cy="65" r="38" fill="url(#earGrad)" stroke="#3f51b5" strokeWidth="5" />
                <circle cx="70" cy="65" r="23" fill="#FF8A80" />
              </g>
              {/* Right Ear */}
              <g>
                <circle cx="170" cy="65" r="38" fill="url(#earGrad)" stroke="#3f51b5" strokeWidth="5" />
                <circle cx="170" cy="65" r="23" fill="#FF8A80" />
              </g>

              {/* Head (sits on top of the shirt/neck) */}
              <ellipse cx="120" cy="105" rx="58" ry="50" fill="url(#bodyGrad)" stroke="#3f51b5" strokeWidth="5" />

              {/* Blush Cheeks */}
              <ellipse cx="75" cy="120" rx="9" ry="5" fill="rgba(255, 64, 129, 0.45)" />
              <ellipse cx="165" cy="120" rx="9" ry="5" fill="rgba(255, 64, 129, 0.45)" />

              {/* Whiskers */}
              <line x1="65" y1="110" x2="40" y2="105" stroke="#263238" strokeWidth="3" strokeLinecap="round" />
              <line x1="65" y1="116" x2="42" y2="118" stroke="#263238" strokeWidth="3" strokeLinecap="round" />
              <line x1="175" y1="110" x2="200" y2="105" stroke="#263238" strokeWidth="3" strokeLinecap="round" />
              <line x1="175" y1="116" x2="198" y2="118" stroke="#263238" strokeWidth="3" strokeLinecap="round" />

              {/* Eyes */}
              <g>
                {/* Left Eye */}
                <ellipse cx="96" cy="95" rx="10" ry="15" fill="#263238" style={{ animation: 'blinkEyes 4s infinite', transformOrigin: '96px 95px' }} />
                <circle cx="100" cy="89" r="3" fill="#ffffff" />
                
                {/* Right Eye */}
                <ellipse cx="144" cy="95" rx="10" ry="15" fill="#263238" style={{ animation: 'blinkEyes 4s infinite', transformOrigin: '144px 95px' }} />
                <circle cx="148" cy="89" r="3" fill="#ffffff" />
              </g>

              {/* Nose */}
              <ellipse cx="120" cy="110" rx="12" ry="8" fill="#FF8A80" stroke="#3f51b5" strokeWidth="3" />

              {/* Mouth */}
              <ellipse 
                cx="120" 
                cy="132" 
                rx="12" 
                ry="5" 
                fill="#263238" 
                className={isPlaying ? 'talking-mouth-svg' : ''} 
                style={{ transformOrigin: '120px 132px', transition: 'all 0.1s ease' }} 
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
