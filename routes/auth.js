const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
require('dotenv').config();

const router = express.Router();

// Endpoint de login
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validar que se envíen los campos requeridos
    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere nombre de usuario y contraseña'
      });
    }

    // Buscar usuario en la base de datos
    const [rows] = await pool.execute(
      'SELECT id, name, passaword, rol FROM users WHERE name = ?',
      [name]
    );

    // Verificar si el usuario existe
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = rows[0];

    // Comparar contraseña en texto plano
    if (user.passaword !== password) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar JWT con el payload
    const payload = {
      id: user.id,
      name: user.name,
      rol: user.rol
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Devolver el token
    res.json({
      success: true,
      token: token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;

