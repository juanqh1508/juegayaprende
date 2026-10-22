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

  useEffect(() => {
    if (isOpen && user) {
      setLoading(true);
      getProgress().then((data) => {
        setProgressList(data || []);
        setLoading(false);
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Obtener progreso por dificultad
  const easyProgress = progressList.find(p => p.difficulty === 1);
  const mediumProgress = progressList.find(p => p.difficulty === 2);
  const hardProgress = progressList.find(p => p.difficulty === 3);

  const highestAnyDifficulty = Math.max(
    easyProgress?.highest_level || 0,
    mediumProgress?.highest_level || 0,
    hardProgress?.highest_level || 0
  );

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-modal" onClick={(e) => e.stopPropagation()}>
        <button className="history-close-btn" onClick={onClose} title="Cerrar">✖</button>

        <div className="history-header">
          <div className="history-icon-bubble">📊</div>
          <h2>Historial de Actividades</h2>
          <p className="history-subtitle">
            {user 
              ? `Progreso guardado de ${user.fullName || user.username}`
              : 'Puedes jugar libremente sin cuenta o iniciar sesión para guardar tu historial'}
          </p>
        </div>

        {!user ? (
          /* MODO INVITADO / LIBRE */
          <div className="guest-history-card">
            <div className="guest-icon">🎮</div>
            <h3>¡Estás jugando en Modo Libre!</h3>
            <p>
              En esta plataforma <strong>no es obligatorio iniciar sesión</strong>. Puedes realizar todas las actividades, retos y generar tu diploma sin una cuenta.
            </p>
            <div className="guest-benefits">
              <h4>¿Por qué crear una cuenta o iniciar sesión?</h4>
              <ul>
                <li>⭐ Guardar los retos y niveles que vas completando.</li>
                <li>📜 Registro permanente de tus diplomas obtenidos.</li>
                <li>🚀 Continuar en el nivel donde te quedaste desde cualquier computadora.</li>
              </ul>
            </div>
            <div className="guest-actions">
              <button 
                className="btn-login-prompt"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
              >
                🔐 Iniciar Sesión / Registrarse
              </button>
              <button className="btn-continue-guest" onClick={onClose}>
                Seguir jugando como invitado
              </button>
            </div>
          </div>
        ) : (
          /* USUARIO AUTENTICADO */
          <div className="user-history-content">
            {loading ? (
              <div className="history-loading">Cargando tu progreso desde PostgreSQL... ⏳</div>
            ) : (
              <>
                {/* Tarjetas de Resumen por Dificultad */}
                <div className="difficulty-summary-grid">
                  <div className="diff-card easy">
                    <span className="diff-badge">🟢 Fácil</span>
                    <div className="diff-level">
                      {easyProgress ? `Nivel ${easyProgress.highest_level} / 19` : 'Sin iniciar'}
                    </div>
                    {easyProgress?.completed && <span className="diff-completed">🏆 ¡Completado!</span>}
                  </div>

                  <div className="diff-card medium">
                    <span className="diff-badge">🟡 Medio</span>
                    <div className="diff-level">
                      {mediumProgress ? `Nivel ${mediumProgress.highest_level} / 19` : 'Sin iniciar'}
                    </div>
                    {mediumProgress?.completed && <span className="diff-completed">🏆 ¡Completado!</span>}
                  </div>

                  <div className="diff-card hard">
                    <span className="diff-badge">🔴 Difícil</span>
                    <div className="diff-level">
                      {hardProgress ? `Nivel ${hardProgress.highest_level} / 19` : 'Sin iniciar'}
                    </div>
                    {hardProgress?.completed && <span className="diff-completed">🏆 ¡Completado!</span>}
                  </div>
                </div>

                {/* Desglose de secciones y lecciones */}
                <h4 className="sections-title">Lecciones del Mouse:</h4>
                <div className="sections-list">
                  {SECTIONS_INFO.map((sec, idx) => {
                    const isCompleted = sec.levels.every(lvl => highestAnyDifficulty >= lvl);
                    const isCurrent = sec.levels.some(lvl => highestAnyDifficulty === lvl);

                    return (
                      <div key={idx} className={`section-item ${isCompleted ? 'done' : (isCurrent ? 'current' : 'locked')}`}>
                        <div className="section-item-left">
                          <span className="sec-icon">{sec.icon}</span>
                          <div>
                            <strong>{sec.name}</strong>
                            <small>Retos {sec.levels[0]} al {sec.levels[sec.levels.length - 1]}</small>
                          </div>
                        </div>
                        <span className="sec-status">
                          {isCompleted ? '✅ Completado' : (isCurrent ? '⚡ En progreso' : '🔒 Pendiente')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {highestAnyDifficulty > 0 && onContinueLevel && (
                  <button 
                    className="btn-resume-game"
                    onClick={() => {
                      onClose();
                      onContinueLevel(1, Math.min(highestAnyDifficulty, 18));
                    }}
                  >
                    ▶️ Continuar desde el Reto {Math.min(highestAnyDifficulty + 1, 19)}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryModal;
