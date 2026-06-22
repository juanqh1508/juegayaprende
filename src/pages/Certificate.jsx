import React, { useState } from 'react';
import { sounds } from '../utils/sounds';
import './Certificate.css';

function Certificate({ onNavigate }) {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
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
          <h2>¡Felicidades, llegaste al final!</h2>
          <p>Has dominado el uso del mouse. Ingresa tus datos para generar tu certificado.</p>
          <form onSubmit={handleGenerate} className="name-form">
            <input
              type="text"
              placeholder="✍️ Escribe tu nombre aquí..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="name-input"
            />
            <input
              type="text"
              placeholder="🏫 Escribe tu escuela (opcional)"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="name-input"
            />
            <button type="submit" className="btn-primary" onClick={() => sounds.click()}>
              🎓 Generar Diploma
            </button>
          </form>
        </div>
      ) : (
        <div className="certificate-wrapper">
          <div className="cert-outer">
            {/* Decorative corner elements */}
            <div className="cert-corner cert-corner-tl"></div>
            <div className="cert-corner cert-corner-tr"></div>
            <div className="cert-corner cert-corner-bl"></div>
            <div className="cert-corner cert-corner-br"></div>

            {/* Floating decorations */}
            <div className="cert-deco cert-deco-1">🖱️</div>
            <div className="cert-deco cert-deco-2">👆</div>
            <div className="cert-deco cert-deco-3">🖥️</div>
            <div className="cert-deco cert-deco-4">⌨️</div>
            <div className="cert-deco cert-deco-5">🖱️</div>
            <div className="cert-deco cert-deco-6">👋</div>

            {/* Wavy decorative bars */}
            <div className="cert-wave cert-wave-top"></div>
            <div className="cert-wave cert-wave-bottom"></div>

            <div className="cert-inner">
              {/* Header */}
              <div className="cert-header">
                <div className="cert-logo">
                  <span className="cert-logo-icon">🖱️</span>
                </div>
                <h1 className="cert-main-title">CERTIFICADO</h1>
                <div className="cert-sub-banner">
                  <span>DE DESTREZA DIGITAL</span>
                </div>
              </div>

              {/* Otorgado a */}
              <p className="cert-award-text">Otorgado a:</p>
              <div className="cert-name-box">
                <h2 className="cert-participant-name">{name}</h2>
                <div className="cert-name-line"></div>
              </div>

              {/* School & Number */}
              <div className="cert-details-row">
                <div className="cert-detail">
                  <span className="cert-detail-label">Escuela:</span>
                  <span className="cert-detail-value">{school || '___________________'}</span>
                </div>
                <div className="cert-detail">
                  <span className="cert-detail-label">Fecha:</span>
                  <span className="cert-detail-value">{dateStr}</span>
                </div>
              </div>

              {/* Main body */}
              <div className="cert-body">
                <p>Por su valiosa participación en las actividades realizadas durante el</p>
                <h3 className="cert-course-title">CURSO DEL MOUSE</h3>
                <p className="cert-body-sub">
                  Completó exitosamente los 20 niveles de destreza, demostrando dominio en el manejo
                  del cursor, clic, doble clic, arrastrar y soltar, y desplazamiento (scroll).
                </p>
              </div>

              {/* Motivational quote */}
              <p className="cert-quote">¡Cada clic te acerca más al futuro digital!</p>

              {/* Footer with signatures */}
              <div className="cert-footer">
                <div className="cert-signature">
                  <div className="cert-sig-line"></div>
                  <p className="cert-sig-title">Instructor(a)</p>
                  <p className="cert-sig-sub">Plataforma Educativa</p>
                </div>

                <div className="cert-seal-area">
                  <div className="cert-seal">🏅</div>
                </div>

                <div className="cert-signature">
                  <div className="cert-sig-line"></div>
                  <p className="cert-sig-title">Director(a)</p>
                  <p className="cert-sig-sub">Centro Educativo</p>
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
