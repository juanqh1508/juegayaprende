import React, { useState } from 'react';
import MainMenu from './pages/MainMenu';
import MouseGame from './pages/MouseGame';
import Certificate from './pages/Certificate';

function App() {
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'mouse-game', 'certificate'
  const [userName, setUserName] = useState('');
  const [startLevel, setStartLevel] = useState(0);

  const navigateTo = (view, level = 0) => {
    setStartLevel(level);
    setCurrentView(view);
  };

  return (
    <div className="app-container">
      {currentView === 'menu' && <MainMenu onNavigate={navigateTo} />}
      {currentView === 'mouse-game' && <MouseGame startLevel={startLevel} onNavigate={navigateTo} onFinish={(name) => { setUserName(name); navigateTo('certificate'); }} />}
      {currentView === 'certificate' && <Certificate userName={userName} onNavigate={navigateTo} />}
    </div>
  );
}

export default App;
