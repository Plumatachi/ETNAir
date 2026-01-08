const { body, param, query, validationResult } = require('express-validator');

const validateBooking = [
    body('idhome')
        .notEmpty()
        .withMessage('Home ID is required')
        .isUUID()
        .withMessage('Invalid home ID format'),

    body('startdate')
        .notEmpty()
        .withMessage('Start date is required')
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((value) => {
            const date = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) {
                throw new Error('Start date cannot be in the past');
            }
            return true;
        }),

    body('enddate')
        .notEmpty()
        .withMessage('End date is required')
        .isISO8601()
        .withMessage('Invalid date format')
        .custom((value, { req }) => {
            const startDate = new Date(req.body.startdate);
            const endDate = new Date(value);
            if (endDate <= startDate) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];

const validateUpdateBooking = [
    param('idbooking')
        .isUUID()
        .withMessage('Le format de l\'identifiant de réservation est invalide'),

    body('startdate')
        .optional()
        .isISO8601()
        .withMessage('Le format de la date de début est invalide'),

    body('enddate')
        .optional()
        .isISO8601()
        .withMessage('Invalid end date format')
        .custom((value, { req }) => {
            if (req.body.startdate) {
                const startDate = new Date(req.body.startdate);
                const endDate = new Date(value);
                if (endDate <= startDate) {
                    throw new Error('La date de fin doit être après la date de début');
                }
            }
            return true;
        }),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    }
];

module.exports = {
    validateBooking,
    validateUpdateBooking
};