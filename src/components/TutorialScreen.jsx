import React from 'react';
import './TutorialScreen.css';

function TutorialScreen({ mechanicType, onStart }) {
  let title = '';
  let description = '';
  let animationClass = '';

  switch (mechanicType) {
    case 'hover':
      title = '1. Mover el Mouse';
      description = 'Para seleccionar cosas, solo tienes que mover el ratón sobre ellas y esperar un momento. ¡Intenta no hacer clic todavía!';
      animationClass = 'anim-hover';
      break;
    case 'click':
      title = '2. Hacer Clic';
      description = 'Mueve el ratón sobre el objeto y presiona el botón izquierdo una sola vez rápido.';
      animationClass = 'anim-click';
      break;
    case 'doubleclick':
      title = '3. Doble Clic';
      description = 'Presiona el botón izquierdo dos veces muy rápido (¡Clic-Clic!) para abrir cosas cerradas.';
      animationClass = 'anim-doubleclick';
      break;
    case 'drag':
      title = '4. Arrastrar y Soltar';
      description = 'Haz clic en el objeto, mantén el botón presionado sin soltarlo, mueve el ratón y luego suéltalo en el lugar correcto.';
      animationClass = 'anim-drag';
      break;
    case 'scroll':
      title = '5. Rueda del Mouse';
      description = 'Usa la pequeña ruedita en el medio de tu ratón para bajar y subir en la página.';
      animationClass = 'anim-scroll';
      break;
    default:
      title = 'Aprende a usar el Mouse';
  }

  return (
    <div className="tutorial-container">
      <div className="tutorial-card">
        <h2>{title}</h2>
        
        <div className="animation-box">
          <div className={`mouse-icon ${animationClass}`}>
            🖱️
            <div className="click-effect"></div>
          </div>
          {mechanicType === 'drag' && <div className="drop-zone-icon">📥</div>}
        </div>
        
        <button className="btn-primary" onClick={onStart}>¡Entendido, a jugar!</button>
      </div>
    </div>
  );
}

export default TutorialScreen;
