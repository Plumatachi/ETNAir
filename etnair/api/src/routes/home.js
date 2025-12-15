const express = require('express');
const { createHome, getAllHomes, getHome, editHome, deleteHome } = require('../controllers/homeController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.post('/home', authenticate, createHome ); // add a home, protected
router.get('/homes', getAllHomes ); // see all homes
router.get('/homes/:id', getHome); // see one home by id 
router.put('/homes/:id', authenticate, editHome) // modify one home by id, protected
router.delete('/homes/:id', authenticate, deleteHome ) // delete one home by id, protected

module.exports = router;