const userService = require('../services/userService');
const { generateToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array().map(err => ({
                    champ: err.path,
                    message: err.msg
                }))
            });
        }

        const { email, password, username, usertype = 'LOCATOR' } = req.body;

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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Données invalides',
                details: errors.array().map(err => ({
                    champ: err.path,
                    message: err.msg
                }))
            });
        }

        const { email, password } = req.body;

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

module.exports = {
    register,
    login
};