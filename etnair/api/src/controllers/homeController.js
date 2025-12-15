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

module.exports = {
    createHome, 
    getAllHomes,
};