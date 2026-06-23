import React, { useState } from 'react';
import { sounds } from '../utils/sounds';
import './Certificate.css';

function Certificate({ userName, difficulty = 1, onNavigate }) {
  const [name, setName] = useState('');
  const [generated, setGenerated] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString('es-PA', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const getDifficultyLabel = (diff) => {
    switch (diff) {
      case 1: return 'Nivel Básico (Fácil)';
      case 2: return 'Nivel Intermedio (Medio)';
      case 3: return 'Nivel Avanzado (Difícil)';
      default: return 'Nivel Básico';
    }
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    if (name.trim() !== '') {
      sounds.levelComplete();
      setGenerated(true);
    }
  };

  return (
    <div className="certificate-page">
      {!generated ? (
        <div className="name-form-card">
          <img src="/logo.png" alt="Juega y Aprende" style={{ maxWidth: '240px', width: '80%', height: 'auto', marginBottom: '1.5rem' }} />
          <h2>¡Felicidades, las lecciones han terminado!</h2>
          <p>Has dominado el uso del mouse. Escribe tu nombre para generar tu diploma.</p>
          <form onSubmit={handleGenerate} className="name-form">
            <input
              type="text"
              placeholder="✍️ Escribe tu nombre aquí..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="name-input"
            />
            <button type="submit" className="btn-primary" onClick={() => sounds.click()}>
              🎓 Generar Diploma
            </button>
          </form>
        </div>
      ) : (
        <div className="certificate-wrapper">
          <div className="cert-template-container" id="printable-certificate">
            <img src="/certificate-template.jpg" alt="Certificado" className="cert-template-img" />
            
            <div className="cert-student-name">
              {name}
            </div>
            
            <div className="cert-completion-date">
              {dateStr}
            </div>
          </div>

          <img src="/logo.png" alt="Juega y Aprende" className="certificate-screen-logo" style={{ height: '70px', width: 'auto', objectFit: 'contain', margin: '0.25rem 0' }} />

          <div className="action-buttons">
            <button className="btn-primary" onClick={() => { sounds.click(); window.print(); }}>
              🖨️ Imprimir / Guardar PDF
            </button>
            <button className="btn-secondary" onClick={() => { sounds.click(); onNavigate('menu'); }}>
              ⬅ Volver al Menú
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Certificate;
