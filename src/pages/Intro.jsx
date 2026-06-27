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
        <div className="animation-screen classroom-bg">

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

          {/* Talking Mouse Character */}
          <div className="mouse-character-container">
            <div className={`mouse-body-full ${isPlaying ? 'talking-anim' : ''}`}>
              {/* Tail */}
              <div className="mouse-tail"></div>

              {/* Ears */}
              <div className="mouse-ear left-ear">
                <div className="ear-inner"></div>
              </div>
              <div className="mouse-ear right-ear">
                <div className="ear-inner"></div>
              </div>

              {/* Head */}
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

                {/* Nose */}
                <div className="mouse-nose"></div>

                {/* Blush Cheeks */}
                <div className="blush-cheek left-cheek"></div>
                <div className="blush-cheek right-cheek"></div>

                {/* Snout Details */}
                <div className="mouse-snout"></div>

                {/* Whiskers */}
                <div className="whiskers left-whiskers">
                  <span></span>
                  <span></span>
                </div>
                <div className="whiskers right-whiskers">
                  <span></span>
                  <span></span>
                </div>

                {/* Mouth */}
                <div className={`mouse-mouth ${isPlaying ? 'talking-mouth' : ''}`}></div>
              </div>

              {/* Body / Shirt */}
              <div className="mouse-torso">
                <div className="shirt-logo">🎮</div>
              </div>

              {/* Hands */}
              <div className="mouse-hand left-hand"></div>
              <div className="mouse-hand right-hand wave-hand"></div>

              {/* Feet */}
              <div className="mouse-foot left-foot"></div>
              <div className="mouse-foot right-foot"></div>
            </div>
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
