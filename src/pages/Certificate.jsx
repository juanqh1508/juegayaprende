import React, { useState } from 'react';
import './Certificate.css';

function Certificate({ onNavigate }) {
  const [name, setName] = useState('');
  const [generated, setGenerated] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (name.trim() !== '') {
      setGenerated(true);
      // Optional: trigger canvas-confetti here if it was installed successfully
      // For now we just use CSS animations
    }
  };

  return (
    <div className="certificate-page">
      {!generated ? (
        <div className="name-form-card">
          <h2>¡Felicidades, llegaste al final!</h2>
          <p>Has dominado el uso del mouse. Ingresa tu nombre para generar tu certificado.</p>
          <form onSubmit={handleGenerate} className="name-form">
            <input 
              type="text" 
              placeholder="Escribe tu nombre aquí..." 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
              className="name-input"
            />
            <button type="submit" className="btn-primary">Generar Diploma</button>
          </form>
        </div>
      ) : (
        <div className="certificate-container">
          <div className="certificate-border">
            <div className="certificate-content">
              <h3>Plataforma de Juegos Educativos</h3>
              <h1>Certificado de Excelencia</h1>
              <p className="cert-text">Se otorga el presente reconocimiento a:</p>
              <h2 className="cert-name">{name}</h2>
              <p className="cert-text">Por haber superado todos los ejercicios y demostrado gran destreza en el uso del ratón, completando con éxito la dinámica de aprendizaje.</p>
              
              <div className="cert-footer">
                <div className="cert-signature">
                  <div className="line"></div>
                  <p>Juega y Aprende</p>
                </div>
                <div className="cert-seal">🎖️</div>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => window.print()}>Imprimir / Guardar PDF</button>
            <button className="btn-secondary" onClick={() => onNavigate('menu')}>Volver al Menú</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Certificate;
