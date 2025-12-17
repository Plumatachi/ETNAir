const { body } = require('express-validator');

const registerValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('L\'email est requis')
        .isEmail()
        .withMessage('Format d\'email invalide')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est requis')
        .isLength({ min: 8 })
        .withMessage('Le mot de passe doit contenir au moins 8 caractères')
        .matches(/[A-Z]/)
        .withMessage('Le mot de passe doit contenir au moins une majuscule')
        .matches(/[a-z]/)
        .withMessage('Le mot de passe doit contenir au moins une minuscule')
        .matches(/[0-9]/)
        .withMessage('Le mot de passe doit contenir au moins un chiffre')
        .matches(/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/;'`~]/)
        .withMessage('Le mot de passe doit contenir au moins un caractère spécial'),

    body('username')
        .trim()
        .notEmpty()
        .withMessage('Le nom d\'utilisateur est requis')
        .isLength({ min: 3, max: 30 })
        .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères'),

    body('usertype')
        .optional()
        .isIn(['LOCATOR', 'OWNER', 'ADMIN'])
        .withMessage('Type d\'utilisateur invalide. Valeurs autorisées: LOCATOR, OWNER, ADMIN')
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('L\'email est requis')
        .isEmail()
        .withMessage('Format d\'email invalide')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est requis')
];

module.exports = {
    registerValidation,
    loginValidation
};