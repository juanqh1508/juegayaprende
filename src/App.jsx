import React, { useState, useEffect, useRef } from 'react';
import MainMenu from './pages/MainMenu';
import MouseGame from './pages/MouseGame';
import Certificate from './pages/Certificate';
import Intro from './pages/Intro';

function App() {
  const [currentView, setCurrentView] = useState('intro'); // 'intro', 'menu', 'mouse-game', 'certificate'
  const [userName, setUserName] = useState('');
  const [difficulty, setDifficulty] = useState(1); // 1: Fácil, 2: Medio, 3: Difícil
  const [startLevel, setStartLevel] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isMusicPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio autoplay prevented"));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isMusicPlaying]);

  const navigateTo = (view, selectedDifficulty = 1, selectedLevel = 0) => {
    if (view === 'mouse-game') {
      setDifficulty(selectedDifficulty);
      setStartLevel(selectedLevel);
      setIsMusicPlaying(true); // Auto-play music when game starts
    } else if (view === 'menu' || view === 'certificate') {
      setIsMusicPlaying(false);
    }
    setCurrentView(view);
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className="app-container">
      {/* Background Music - 8-bit Arcade / Mario Style */}
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/01/21/audio_31743c58be.mp3?filename=arcade-music-loop-110041.mp3" />
      
      {currentView !== 'menu' && (
        <button 
          onClick={toggleMusic} 
          style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000, background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
          title={isMusicPlaying ? "Pausar música" : "Reproducir música"}
        >
          {isMusicPlaying ? '🔊' : '🔇'}
        </button>
      )}

      {currentView === 'intro' && <Intro onNavigate={navigateTo} />}
      {currentView === 'menu' && <MainMenu onNavigate={navigateTo} />}
      {currentView === 'mouse-game' && <MouseGame difficulty={difficulty} startLevel={startLevel} onNavigate={navigateTo} onFinish={(name) => { setUserName(name); navigateTo('certificate'); }} />}
      {currentView === 'certificate' && <Certificate userName={userName} difficulty={difficulty} onNavigate={navigateTo} />}
    </div>
  );
}

export default App;
