const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token manquant ou invalide' });
        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = {
            id: decoded.id,
            email: decoded.email,
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token invalide' });
        }

        return res.status(500).json({ error: 'Erreur serveur' });
    }
};

const optionalAuthenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = {
                id: decoded.id,
                email: decoded.email,
            };
        }

        next();
    } catch (error) {
        next();
    }
};

module.exports = { authenticate, optionalAuthenticate };