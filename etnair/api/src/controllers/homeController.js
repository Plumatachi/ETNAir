const homeService = require('../services/homeService');

const createHome = async (req, res) => {
    try {
        const { namehome, description, price } = req.body;

        if (!namehome || !description || !price) {
            return res.status(400).json({
                error: 'Nom du logement, description et prix requis'
            });
        }

        const iduser = req.user.id;

        const home = await homeService.create({
            namehome,
            description, 
            price, 
            iduser
        });

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

        const home = await homeService.findById(id);
        if (!home) {
            return res.status(404).json({
                error: 'Domicile non trouvé'
            });
        }

        res.json({ home });
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
}

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

module.exports = {
    createHome, 
    getAllHomes, 
    getHome, 
    editHome, 
    deleteHome
};