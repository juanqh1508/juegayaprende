import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './HistoryModal.css';

const SECTIONS_INFO = [
  { name: 'Mover el Mouse', icon: '🖱️', levels: [1, 2, 3] },
  { name: 'Hacer Clic', icon: '🎯', levels: [4, 5, 6] },
  { name: 'Doble Clic', icon: '⚡', levels: [7, 8, 9] },
  { name: 'Arrastrar y Soltar', icon: '📦', levels: [10, 11, 12, 13] },
  { name: 'Desplazamiento (Scroll)', icon: '📜', levels: [14, 15] },
  { name: 'Casillas de Selección', icon: '🗹', levels: [16, 17] },
  { name: 'Botones de Opción', icon: '🔘', levels: [18, 19] },
];

function HistoryModal({ isOpen, onClose, onOpenAuth, onContinueLevel }) {
  const { user, getProgress } = useAuth();
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDiff, setSelectedDiff] = useState('all'); // 'all', 1, 2, 3

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      if (getProgress) {
        getProgress().then((data) => {
          setProgressList(data || []);
          setLoading(false);
        }).catch(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Obtener progreso por dificultad
  const easyProgress = progressList.find(p => Number(p.difficulty) === 1);
  const mediumProgress = progressList.find(p => Number(p.difficulty) === 2);
  const hardProgress = progressList.find(p => Number(p.difficulty) === 3);

  const highestAnyDifficulty = Math.max(
    Number(easyProgress?.highest_level) || 0,
    Number(mediumProgress?.highest_level) || 0,
    Number(hardProgress?.highest_level) || 0
  );

  // Nivel activo según la dificultad seleccionada
  const activeLevel = selectedDiff === 'all'
    ? highestAnyDifficulty
    : (selectedDiff === 1 ? (Number(easyProgress?.highest_level) || 0)
      : (selectedDiff === 2 ? (Number(mediumProgress?.highest_level) || 0)
        : (Number(hardProgress?.highest_level) || 0)));

  const handleDiffCardClick = (diff) => {
    setSelectedDiff(prev => (prev === diff ? 'all' : diff));
  };

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-modal" onClick={(e) => e.stopPropagation()}>
        <button className="history-close-btn" onClick={onClose} title="Cerrar">✖</button>

        <div className="history-header">
          <div className="history-icon-bubble">📊</div>
          <h2>Historial y Retos</h2>
          <p className="history-subtitle">
            {user 
              ? `Progreso de ${user.fullName || user.username}`
              : 'Progreso guardado en este equipo'}
          </p>
        </div>

        {/* Banner informativo de modo libre vs cuenta en la nube */}
        {!user ? (
          <div style={{
            background: '#eff6ff',
            border: '1.5px solid #93c5fd',
            borderRadius: '14px',
            padding: '10px 14px',
            marginBottom: '1.2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#1e40af' }}>
              <span style={{ fontSize: '1.3rem' }}>🎮</span>
              <div>
                <strong>Modo Libre Activo:</strong>
                <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>Tus niveles completados quedan guardados en este navegador.</div>
              </div>
            </div>
            <button
              onClick={() => { onClose(); onOpenAuth(); }}
              style={{
                background: 'var(--panama-blue)',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(21,101,192,0.2)'
              }}
            >
              🔐 Iniciar Sesión (Nube)
            </button>
          </div>
        ) : (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '12px',
            padding: '8px 14px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            color: '#166534'
          }}>
            <span>☁️</span>
            <span>Progreso sincronizado en la nube para <strong>{user.fullName || user.username}</strong></span>
          </div>
        )}

        <div className="user-history-content">
          {loading ? (
            <div className="history-loading">Cargando tu progreso... ⏳</div>
          ) : (
            <>
              {/* Resumen del circuito y posición del ratoncito */}
              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '10px 14px', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.8rem' }}>🐭</span>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#1e293b', display: 'block' }}>
                      {activeLevel === 0 ? 'Listo para empezar: Reto 1' : `Posición en Circuito: Reto ${Math.min(activeLevel + 1, 19)}`}
                    </strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {activeLevel} de 19 retos superados
                    </div>
                  </div>
                </div>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.82rem' }}>
                  {Math.round((activeLevel / 19) * 100)}% del circuito
                </span>
              </div>

              {/* Tarjetas de Resumen por Dificultad (interactivas) */}
              <div className="difficulty-summary-grid">
                <div 
                  className={`diff-card easy ${selectedDiff === 1 ? 'selected' : ''}`}
                  onClick={() => handleDiffCardClick(1)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s', transform: selectedDiff === 1 ? 'scale(1.03)' : 'none', boxShadow: selectedDiff === 1 ? '0 4px 10px rgba(0,0,0,0.1)' : 'none' }}
                  title="Haz clic para ver retos de Fácil"
                >
                  <span className="diff-badge">🟢 Fácil</span>
                  <div className="diff-level">
                    {easyProgress && easyProgress.highest_level > 0 ? `Nivel ${easyProgress.highest_level} / 19` : 'Sin iniciar'}
                  </div>
                  {easyProgress?.completed && <span className="diff-completed">🏆 ¡Completado!</span>}
                </div>

                <div 
                  className={`diff-card medium ${selectedDiff === 2 ? 'selected' : ''}`}
                  onClick={() => handleDiffCardClick(2)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s', transform: selectedDiff === 2 ? 'scale(1.03)' : 'none', boxShadow: selectedDiff === 2 ? '0 4px 10px rgba(0,0,0,0.1)' : 'none' }}
                  title="Haz clic para ver retos de Medio"
                >
                  <span className="diff-badge">🟡 Medio</span>
                  <div className="diff-level">
                    {mediumProgress && mediumProgress.highest_level > 0 ? `Nivel ${mediumProgress.highest_level} / 19` : 'Sin iniciar'}
                  </div>
                  {mediumProgress?.completed && <span className="diff-completed">🏆 ¡Completado!</span>}
                </div>

                <div 
                  className={`diff-card hard ${selectedDiff === 3 ? 'selected' : ''}`}
                  onClick={() => handleDiffCardClick(3)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s', transform: selectedDiff === 3 ? 'scale(1.03)' : 'none', boxShadow: selectedDiff === 3 ? '0 4px 10px rgba(0,0,0,0.1)' : 'none' }}
                  title="Haz clic para ver retos de Difícil"
                >
                  <span className="diff-badge">🔴 Difícil</span>
                  <div className="diff-level">
                    {hardProgress && hardProgress.highest_level > 0 ? `Nivel ${hardProgress.highest_level} / 19` : 'Sin iniciar'}
                  </div>
                  {hardProgress?.completed && <span className="diff-completed">🏆 ¡Completado!</span>}
                </div>
              </div>

              {selectedDiff !== 'all' && (
                <div style={{ textAlign: 'right', marginTop: '-0.8rem', marginBottom: '0.8rem' }}>
                  <button 
                    onClick={() => setSelectedDiff('all')} 
                    style={{ background: 'none', border: 'none', color: 'var(--panama-blue)', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
                  >
                    Ver progreso general (todas las dificultades) ↺
                  </button>
                </div>
              )}

              {/* Desglose de secciones y lecciones */}
              <h4 className="sections-title">
                Lecciones del Mouse {selectedDiff === 1 ? '(Fácil)' : (selectedDiff === 2 ? '(Medio)' : (selectedDiff === 3 ? '(Difícil)' : '(General)'))}:
              </h4>
              <div className="sections-list">
                {SECTIONS_INFO.map((sec, idx) => {
                  const completedInSec = sec.levels.filter(lvl => activeLevel >= lvl).length;
                  const totalInSec = sec.levels.length;
                  const isCompleted = completedInSec === totalInSec;

                  // Desbloqueado si:
                  // 1. Es la sección inicial (idx === 0), O
                  // 2. El próximo reto por jugar pertenece a esta sección, O
                  // 3. Ya se completó algún reto de esta sección
                  const isCurrent = !isCompleted && (
                    idx === 0 ||
                    sec.levels.includes(activeLevel + 1) ||
                    completedInSec > 0
                  );

                  return (
                    <div key={idx} className={`section-item ${isCompleted ? 'done' : (isCurrent ? 'current' : 'locked')}`}>
                      <div className="section-item-left">
                        <span className="sec-icon">{sec.icon}</span>
                        <div>
                          <strong>{sec.name}</strong>
                          <small>
                            Retos {sec.levels[0]} al {sec.levels[sec.levels.length - 1]}
                            {isCompleted 
                              ? ` • ¡Completado! (${totalInSec}/${totalInSec})` 
                              : (isCurrent 
                                ? ` • En curso (${completedInSec}/${totalInSec} superados)` 
                                : ` • Bloqueado (Supera el reto ${sec.levels[0] - 1} para desbloquear)`)}
                          </small>
                        </div>
                      </div>
                      <span className="sec-status">
                        {isCompleted ? '✅ Completado' : (isCurrent ? '⚡ En progreso' : '🔒 Pendiente')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {onContinueLevel && (
                <button 
                  className="btn-resume-game"
                  onClick={() => {
                    onClose();
                    const targetDiff = selectedDiff !== 'all' ? selectedDiff : (hardProgress?.highest_level >= highestAnyDifficulty && highestAnyDifficulty > 0 ? 3 : (mediumProgress?.highest_level >= highestAnyDifficulty && highestAnyDifficulty > 0 ? 2 : 1));
                    onContinueLevel(targetDiff, Math.min(activeLevel, 18));
                  }}
                >
                  {activeLevel > 0 
                    ? `▶️ Continuar desde el Reto ${Math.min(activeLevel + 1, 19)}` 
                    : '▶️ Empezar desde el Reto 1'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryModal;
