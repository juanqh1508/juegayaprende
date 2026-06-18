import React from 'react';
import './MainMenu.css';

function MainMenu({ onNavigate }) {
  return (
    <div className="main-menu">
      <header className="menu-header">
        <h1 className="title animate-bounce">Juega y Aprende</h1>
        <p className="subtitle">¡Aprende a usar la computadora jugando!</p>
        <h3 style={{ color: 'var(--panama-blue)', marginTop: '1rem', fontFamily: 'var(--font-heading)' }}>infoplazas AIP.</h3>
      </header>

      <div className="games-grid">
        <div className="game-card active" onClick={() => onNavigate('mouse-game')}>
          <div className="card-icon">🖱️</div>
          <h2>Aventura del Mouse</h2>
          <p>Domina el ratón superando divertidos retos interactivos.</p>
          <button className="btn-primary">¡Jugar Ahora!</button>
        </div>
        
        <div className="game-card locked">
          <div className="card-icon">⌨️</div>
          <h2>Misterio del Teclado</h2>
          <p>Próximamente...</p>
          <button className="btn-locked" disabled>Bloqueado</button>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;
