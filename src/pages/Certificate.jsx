import React, { useState } from 'react';
import { sounds } from '../utils/sounds';
import './Certificate.css';

function Certificate({ onNavigate }) {
  const [name, setName] = useState('');
  const [generated, setGenerated] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString('es-PA', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

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
          <div className="form-icon">🏆</div>
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
            <img src="/certificate-template.png" alt="Certificado" className="cert-template-img" />
            
            <div className="cert-student-name">
              {name}
            </div>
            
            <div className="cert-completion-date">
              {dateStr}
            </div>
          </div>

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
