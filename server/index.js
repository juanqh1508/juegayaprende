import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { initDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
app.use(cors({
  origin: '*', // En producción puedes restringir a tu dominio ej. 'https://tudominio.com'
  credentials: true
}));

app.use(express.json());

// Ruta de comprobación de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend de Plataforma de Juegos funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Iniciar servidor e inicializar la base de datos PostgreSQL
app.listen(PORT, async () => {
  console.log(`🚀 Servidor backend escuchando en el puerto ${PORT} (http://localhost:${PORT})`);
  await initDb();
});
