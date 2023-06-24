const express = require('express');
const router = express.Router();
const { getStock, ajouterAuStock } = require('../routes/stockRoutes');

// Route pour récupérer le stock d'un produit
router.get('/stock/:nomProduit', async (req, res) => {
    const nomProduit = req.params.nomProduit;
    try {
        const stock = await getStock(nomProduit);
        res.json(stock);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du stock' });
    }
});

// Route pour ajouter au stock d'un produit
router.post('/stock/ajouter', async (req, res) => {
    const { nomProduit, quantiteAjoutee, reelOrReserve } = req.body;
    try {
        const stockModifie = await ajouterAuStock(nomProduit, quantiteAjoutee, reelOrReserve === 'reel');
        res.json({ stockModifie });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout au stock' });
    }
});


module.exports = router;
