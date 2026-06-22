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
        <div className="game-card active">
          <div className="card-icon">🖱️</div>
          <h2>Aventura del Mouse</h2>
          <p>Elige tu nivel de dificultad para comenzar:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn-primary" onClick={() => onNavigate('mouse-game', 1)}>🟢 Nivel 1 (Fácil)</button>
            <button className="btn-primary" onClick={() => onNavigate('mouse-game', 2)} style={{ background: 'var(--panama-blue)' }}>🟡 Nivel 2 (Medio)</button>
            <button className="btn-primary" onClick={() => onNavigate('mouse-game', 3)} style={{ background: 'var(--panama-red)' }}>🔴 Nivel 3 (Difícil)</button>
          </div>
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
