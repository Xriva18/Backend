const express = require('express');
require('dotenv').config();
const passport = require('./config/passport');

const { pool } = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT;

// Middleware para parsear JSON
app.use(express.json());

// Inicializar Passport
app.use(passport.initialize());

// Rutas de autenticación
app.use('/auth', authRoutes);

// Endpoint que ejecuta SELECT 2+2 AS suma
app.get('/suma', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT 2+2 AS suma');
        res.json({ suma: rows[0].suma });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});

