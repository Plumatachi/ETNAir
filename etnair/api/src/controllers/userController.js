const userService = require('../services/userService');

const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: 'Non authentifié'
            });
        }

        const user = await userService.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                error: 'Utilisateur non trouvé'
            });
        }

        res.json({ user });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

const editProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: 'Non authentifié'
            });
        }

        const id = req.user.id;
        const data = req.body;
        
        const updatedUser = await userService.update(id, data);
        if (!updatedUser) {
            return res.status(404).json({
                error: 'Utilisateur non trouvé'
            });
        }

        res.json({ user : updatedUser });
    } catch (error) {
        console.error('Erreur lors de la modification du profil:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

const deleteProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Non authentifié' });
        }

        const id = req.user.id;
        await userService.delete(id);

        res.json({ message: 'Profil supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du profil:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

module.exports = {
    getProfile,
    editProfile,
    deleteProfile
}