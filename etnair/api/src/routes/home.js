const express = require('express');
const { createHome, getAllHomes } = require('../controllers/homeController');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

router.post('/homes', authenticate, createHome ); // add a home
router.get('/homes', getAllHomes ); // see all homes
// router.get('/homes/:id', ); // see one home by id 
// router.put('/homes/:id') // modify one home by id 
// router.delete('/home/:id', ) // delete one home by id 

module.exports = router;