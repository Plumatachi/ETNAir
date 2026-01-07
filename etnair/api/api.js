const express = require('express');
const cors = require('cors');
require('dotenv').config();
const prisma = require('./src/config/database');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const homeRoutes = require('./src/routes/home');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/swagger/swagger.config');

console.log('🚀 Démarrage de l\'api...');
console.log('📦 Variables d\'environnement chargées');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.NEXT_URL,
  credentials: true
}));

app.use((req, res, next) => {
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/user/', userRoutes);
app.use('/api/', homeRoutes);
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Documentation API'
}));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});



app.use((req, res) => {
  console.log(`⚠️ Route 404: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route non trouvée' });
});

app.listen(PORT, async () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);

  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1); 
  }
});

// set interval to stop node from exiting on Linux and give it an actif handle, not necessary on Windows
setInterval(() => {}, 1 << 30);

module.exports = app;