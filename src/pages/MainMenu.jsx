import React from 'react';
import './MainMenu.css';

function MainMenu({ onNavigate }) {
  return (
    <div className="main-menu">
      <header className="menu-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/logo.png" alt="Juega y Aprende" className="main-logo animate-bounce" style={{ maxWidth: '340px', width: '90%', height: 'auto', marginBottom: '1rem' }} />
        <p className="subtitle">¡Aprende a usar la computadora jugando!</p>
        <h3 style={{ color: 'var(--panama-blue)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>infoplazas AIP.</h3>
      </header>

      <div className="games-grid">
        <div className="game-card active">
          <div className="card-icon">🖱️</div>
          <h2>Aventura del Mouse</h2>
          <p>Elige tu nivel inicial y dificultad:</p>
          <div style={{ margin: '1rem 0' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Nivel de Inicio:</label>
            <select 
              id="startLevelSelect" 
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '2px solid var(--ocean-cyan)', fontSize: '1.1rem', fontFamily: 'var(--font-heading)', cursor: 'pointer' }}
            >
              {[...Array(19)].map((_, i) => (
                <option key={i} value={i}>Reto {i + 1}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn-primary" onClick={() => onNavigate('mouse-game', 1, parseInt(document.getElementById('startLevelSelect').value))}>🟢 Dificultad Fácil</button>
            <button className="btn-primary" onClick={() => onNavigate('mouse-game', 2, parseInt(document.getElementById('startLevelSelect').value))} style={{ background: 'var(--panama-blue)' }}>🟡 Dificultad Media</button>
            <button className="btn-primary" onClick={() => onNavigate('mouse-game', 3, parseInt(document.getElementById('startLevelSelect').value))} style={{ background: 'var(--panama-red)' }}>🔴 Dificultad Difícil</button>
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
