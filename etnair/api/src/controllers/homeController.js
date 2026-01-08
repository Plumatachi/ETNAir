const homeService = require('../services/homeService');

const createHome = async (req, res) => {
    try {
        const { namehome, description, price, address, city, postalcode, country, propertyType } = req.body;

        if (!namehome || !description || !price || !address || !city || !postalcode || !country || !propertyType) {
            return res.status(400).json({
                error: 'Nom du logement, description, prix, adresse, ville, code postal, pays et type de propriété requis'
            });
        }

        const iduser = req.user.id;

        const files = req.files ? req.files.map(f => ({
            buffer: f.buffer,
            originalName: f.originalname,
            mimeType: f.mimetype
        })) : [];

        let home;
        if (files.length > 0) {
            home = await homeService.createWithImages({
                namehome,
                description,
                price,
                address,
                city,
                postalcode,
                country,
                propertytype: propertyType,
                iduser
            }, files);
        } else {
            home = await homeService.create({
                namehome,
                description,
                price,
                address,
                city,
                postalcode,
                country,
                propertytype: propertyType,
                iduser
            });
        }

        res.status(201).json({
            message: 'Enregistrement du logement réussi',
            home
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du nouveau logement', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const getAllHomes = async (req, res) => {
    try {
        const homes = await homeService.findAll();

        res.status(200).json({
            homes
        });
    } catch (error) {
        console.log('Erreur lors de la récupération des logements', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const getHome = async (req, res) => {
    try {
        const id = req.params.id;

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return res.status(400).json({
                error: 'ID invalide'
            });
        }

        const home = await homeService.findById(id);
        if (!home) {
            return res.status(404).json({
                error: 'Domicile non trouvé'
            });
        }

        res.json(home);
    } catch (error) {
        console.error('Erreur lors de la récupération du domicile:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const editHome = async (req, res) => {
    try {
        const id = req.params.id;
        const iduser = req.user.id;
        const data = req.body;

        const home = await homeService.findById(id);
        if (!home) {
            return res.status(404).json({ error: 'Logement non trouvé' });
        }
        if (req.user.role === 'OWNER' && home.iduser !== iduser) {
            return res.status(403).json({ error: 'Non autorisé' });
        }

        const updatedHome = await homeService.update(id, data);
        res.json({ home: updatedHome });
    } catch (error) {
        console.error('Erreur lors de la modification du logement:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const deleteHome = async (req, res) => {
    try {
        const id = req.params.id;
        const iduser = req.user.id;

        const home = await homeService.findById(id);
        if (!home) {
            return res.status(404).json({ error: 'Logement non trouvé' });
        }
        if (req.user.role === 'OWNER' && home.iduser !== iduser) {
            return res.status(403).json({ error: 'Non autorisé' });
        }

        await homeService.delete(id);
        res.json({ message: 'Logement supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du logement:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const addHomeImages = async (req, res) => {
    try {
        const id = req.params.id;
        const iduser = req.user.id;

        const home = await homeService.findById(id);
        if (!home) {
            return res.status(404).json({ error: 'Logement non trouvé' });
        }
        if (req.user.role === 'OWNER' && home.iduser !== iduser) {
            return res.status(403).json({ error: 'Non autorisé' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Aucune image fournie' });
        }

        const files = req.files.map(f => ({
            buffer: f.buffer,
            originalName: f.originalname,
            mimeType: f.mimetype
        }));

        const updatedHome = await homeService.addImages(id, files);
        res.json({
            message: 'Images ajoutées avec succès',
            home: updatedHome
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout des images:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const deleteHomeImage = async (req, res) => {
    try {
        const { id, idimage } = req.params;
        const iduser = req.user.id;

        const home = await homeService.findById(id);
        if (!home) {
            return res.status(404).json({ error: 'Logement non trouvé' });
        }
        if (req.user.role === 'OWNER' && home.iduser !== iduser) {
            return res.status(403).json({ error: 'Non autorisé' });
        }

        await homeService.deleteImage(idimage);
        res.json({ message: 'Image supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const reorderHomeImages = async (req, res) => {
    try {
        const id = req.params.id;
        const iduser = req.user.id;
        const { imageOrders } = req.body; // [{ idimage, ordernum }, ...]

        const home = await homeService.findById(id);
        if (!home) {
            return res.status(404).json({ error: 'Logement non trouvé' });
        }
        if (req.user.role === 'OWNER' && home.iduser !== iduser) {
            return res.status(403).json({ error: 'Non autorisé' });
        }

        if (!imageOrders || !Array.isArray(imageOrders)) {
            return res.status(400).json({ error: 'Format de données invalide' });
        }

        const updatedHome = await homeService.reorderImages(id, imageOrders);
        res.json({
            message: 'Ordre des images mis à jour',
            home: updatedHome
        });
    } catch (error) {
        console.error('Erreur lors de la réorganisation des images:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    createHome,
    getAllHomes,
    getHome,
    editHome,
    deleteHome,
    addHomeImages,
    deleteHomeImage,
    reorderHomeImages
};