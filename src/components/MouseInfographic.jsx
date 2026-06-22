import React from 'react';
import './MouseInfographic.css';
import { sounds } from '../utils/sounds';

function MouseInfographic({ onComplete }) {
  const handleStart = () => {
    if (sounds.click) sounds.click();
    onComplete();
  };

  return (
    <div className="infographic-container">
      <div className="infographic-card">
        <h1 className="info-title animate-bounce">¡Conoce a tu amigo el Mouse! 🖱️</h1>
        <p className="info-subtitle">Antes de jugar, vamos a aprender cómo usarlo.</p>

        <div className="mouse-anatomy">
          <div className="mouse-diagram">
            <div className="mouse-body">
              <div className="mouse-btn left-btn pulse-glow">
                <span className="tooltip left-tooltip">Clic Izquierdo</span>
              </div>
              <div className="mouse-btn right-btn">
                <span className="tooltip right-tooltip">Clic Derecho</span>
              </div>
              <div className="mouse-wheel">
                <span className="tooltip wheel-tooltip">Rueda (Scroll)</span>
              </div>
            </div>
          </div>

          <div className="info-sections">
            <div className="info-item" style={{ borderLeftColor: '#9C27B0' }}>
              <div className="info-icon">✋</div>
              <div className="info-text">
                <h3>Postura de la Mano</h3>
                <p>Descansa tu palma suavemente sobre el ratón. Tu <strong>dedo índice</strong> va en el botón izquierdo y tu <strong>dedo medio</strong> en el derecho.</p>
                <img src="/hand_on_mouse.png" alt="Cómo colocar la mano" style={{ width: '100%', maxWidth: '250px', borderRadius: '15px', marginTop: '15px', display: 'block', border: '3px solid #eee', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon click-anim">👆</div>
              <div className="info-text">
                <h3>Clic Izquierdo</h3>
                <p>Úsalo para <strong>seleccionar</strong>, <strong>arrastrar</strong> y <strong>hacer doble clic</strong>. ¡Es el botón que más usarás!</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon wheel-anim">↕️</div>
              <div className="info-text">
                <h3>Rueda (Scroll)</h3>
                <p>Gírala hacia arriba o hacia abajo para <strong>mover la pantalla</strong> cuando hay mucho contenido.</p>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon right-click-anim">📝</div>
              <div className="info-text">
                <h3>Clic Derecho</h3>
                <p>Sirve para ver opciones especiales, aunque en este juego usaremos más el izquierdo.</p>
              </div>
            </div>
          </div>
        </div>

        <button className="btn-primary start-btn" onClick={handleStart}>
          ¡Entendido, a jugar! 🚀
        </button>
      </div>
    </div>
  );
}

export default MouseInfographic;
