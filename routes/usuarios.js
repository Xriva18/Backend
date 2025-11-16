const express = require('express');
const { pool } = require('../config/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /usuarios - Solo rol 1 puede insertar
router.post('/usuarios', requireAuth([1]), async (req, res) => {
    try {
        const { name, passaword, rol } = req.body;

        // Validar campos requeridos
        if (!name || !passaword || !rol) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren los campos: name, passaword, rol'
            });
        }

        // Insertar nuevo usuario
        const [result] = await pool.execute(
            'INSERT INTO users (name, passaword, rol) VALUES (?, ?, ?)',
            [name, passaword, rol]
        );

        res.json({
            success: true,
            message: 'usuario con rol 1 inserto un nuevo usuario'
        });

    } catch (error) {
        console.error('Error al insertar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// GET /usuarios - Roles 1 y 2 pueden acceder
router.get('/usuarios', requireAuth([1, 2]), async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name, rol FROM users'
        );

        res.json({
            success: true,
            usuarios: rows
        });

    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// DELETE /usuario/:id - Solo rol 3 puede eliminar
router.delete('/usuario/:id', requireAuth([3]), async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si el usuario existe
        const [rows] = await pool.execute(
            'SELECT id FROM users WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Eliminar usuario
        await pool.execute(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

module.exports = router;

