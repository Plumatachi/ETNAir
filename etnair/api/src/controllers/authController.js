const userService = require('../services/userService');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
    try {
        console.log('🔍 req.body:', req.body);
        console.log('🔍 req.headers:', req.headers);

        const { email, password, username, usertype = 'LOCATOR' } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({
                error: 'Email, mot de passe et nom d\'utilisateur requis'
            });
        }

        const emailExists = await userService.emailExists(email);
        if (emailExists) {
            return res.status(400).json({
                error: 'Cet email est déjà utilisé'
            });
        }

        const user = await userService.create({
            email,
            password,
            username,
            usertype,
        });

        const token = generateToken({
            id: user.iduser,
            email: user.email
        });

        res.status(201).json({
            message: 'Inscription réussie',
            user,
            token,
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email et mot de passe requis'
            });
        }

        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                error: 'Identifiants invalides'
            });
        }

        const isPasswordValid = await userService.verifyPassword(
            password,
            user.password
        );
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Identifiants invalides'
            });
        }

        const token = generateToken({
            id: user.iduser,
            email: user.email
        });

        res.json({
            message: 'Connexion réussie',
            user: {
                id: user.iduser,
                email: user.email,
                username: user.username,
                usertype: user.usertype,
            },
            token,
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: 'Non authentifié'
            });
        }

        const user = await userService.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                error: 'Utilisateur non trouvé'
            });
        }

        res.json({ user });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    register,
    login,
    getProfile
};