const express = require('express');
const { getProfile, editProfile, deleteProfile } = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, editProfile);
router.delete('/profile', authenticate, deleteProfile);

module.exports = router;