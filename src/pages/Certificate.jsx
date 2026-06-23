import React, { useState } from 'react';
import { sounds } from '../utils/sounds';
import './Certificate.css';

function Certificate({ userName, difficulty = 1, onNavigate }) {
  const [name, setName] = useState(userName || '');
  const [generated, setGenerated] = useState(!!userName);

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
          <div className="cert-outer" id="printable-certificate">
            {/* Wavy colorful bars top and bottom */}
            <div className="cert-wave cert-wave-top"></div>
            <div className="cert-wave cert-wave-bottom"></div>

            {/* Playful Floating Emojis */}
            <div className="cert-deco cert-deco-1">🖱️</div>
            <div className="cert-deco cert-deco-2">✨</div>
            <div className="cert-deco cert-deco-3">🖥️</div>
            <div className="cert-deco cert-deco-4">⭐</div>
            <div className="cert-deco cert-deco-5">🎉</div>
            <div className="cert-deco cert-deco-6">👋</div>

            <div className="cert-inner">
              {/* Logo / Header */}
              <div className="cert-logo-row">
                <span className="logo-emoji">🎮</span>
                <h2 className="logo-title">Juega y Aprende</h2>
              </div>

              <h1 className="cert-main-title">Certificado de Logro</h1>
              <p className="cert-award-text">Se otorga con orgullo a:</p>

              {/* Student Name */}
              <div className="cert-name-box">
                <h2 className="cert-participant-name">{name}</h2>
                <div className="cert-name-line"></div>
              </div>

              {/* Achievement Body */}
              <div className="cert-body">
                <p>Por haber completado exitosamente el</p>
                <h3 className="cert-course-title">Curso de Uso del Mouse</h3>
                <p className="cert-difficulty-box">
                  Demostrando dominio y destreza en el: <strong>{getDifficultyLabel(difficulty)}</strong>
                </p>
                <p className="cert-body-sub">
                  Completando todas las dinámicas interactivas de movimiento de cursor,
                  hacer clic, doble clic rápido, arrastrar y soltar objetos y desplazamiento de pantalla.
                </p>
              </div>

              {/* Footer Section */}
              <div className="cert-footer">
                <div className="cert-footer-column">
                  <div className="cert-sig-line"></div>
                  <p className="cert-sig-title">Fecha de Emisión</p>
                  <p className="cert-sig-value">{dateStr}</p>
                </div>

                <div className="cert-seal-area">
                  <div className="cert-seal">🏅</div>
                  <div className="cert-seal-text">¡LOGRO DIGITAL!</div>
                </div>

                <div className="cert-footer-column">
                  <div className="cert-sig-line"></div>
                  <p className="cert-sig-title">Firma del Director</p>
                  <p className="cert-sig-value">Juega y Aprende</p>
                </div>
              </div>
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
