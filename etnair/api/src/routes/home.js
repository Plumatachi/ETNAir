const express = require('express');
const multer = require('multer');
const { createHome, getAllHomes, getHome, editHome, deleteHome, addHomeImages, deleteHomeImage, reorderHomeImages } = require('../controllers/homeController');
const { authenticate, requireRole } = require('../middlewares/auth');

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Seules les images sont autorisées'), false);
        }
    }
});

const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Fichier trop volumineux (max 10MB)' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ error: 'Trop de fichiers (max 10)' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ error: 'Champ de fichier inattendu. Utilisez "images"' });
        }
        return res.status(400).json({ error: err.message });
    }
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
};

router.post('/home', authenticate, requireRole(['OWNER', 'ADMIN']), upload.array('images', 10), handleMulterError, createHome); // add a home, protected
router.get('/homes', getAllHomes); // see all homes
router.get('/homes/:id', getHome); // see one home by id
router.put('/homes/:id', authenticate, requireRole(['OWNER', 'ADMIN']), editHome); // modify one home by id, protected
router.delete('/homes/:id', authenticate, requireRole(['OWNER', 'ADMIN']), deleteHome); // delete one home by id, protected

// Gestion des images
router.post('/homes/:id/images', authenticate, requireRole(['OWNER', 'ADMIN']), upload.array('images', 10), handleMulterError, addHomeImages);
router.delete('/homes/:id/images/:idimage', authenticate, requireRole(['OWNER', 'ADMIN']), deleteHomeImage);
router.put('/homes/:id/images/reorder', authenticate, requireRole(['OWNER', 'ADMIN']), reorderHomeImages);

module.exports = router;