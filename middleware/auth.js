const passport = require('passport');

// Middleware de autenticación JWT
const authenticate = passport.authenticate('jwt', { session: false });

// Middleware de autorización por roles
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'No autenticado'
            });
        }

        const userRol = req.user.rol;

        // Verificar si el rol del usuario está en los roles permitidos
        if (!allowedRoles.includes(userRol)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción'
            });
        }

        next();
    };
};

// Combinar autenticación y autorización
const requireAuth = (allowedRoles) => {
    return [authenticate, authorize(...allowedRoles)];
};

module.exports = {
    authenticate,
    authorize,
    requireAuth
};

