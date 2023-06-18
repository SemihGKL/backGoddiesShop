
const { MongoClient } = require('mongodb');

// Méthode pour se connecter à MongoDB
async function connectToMongoDB() {
    const url = 'mongodb+srv://gokolsemih:4dCJJLHJBeTPcO1p@cluster0.jhfdk8e.mongodb.net/?retryWrites=true&w=majority';
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connecté à MongoDB');
        return client.db('Local_test');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB', error);
        throw error;
    }
}
//Méthode pour récuperer le stock d'un produit
async function getStock(nomProduit) {
    try {
        const db = await connectToMongoDB();
        const collection = db.collection('product');

        const filter = { name: nomProduit };
        const stock = await collection.findOne(filter);

        if (!stock) {
            throw new Error('Stock introuvable');
        }
        return stock;
    } catch (error) {
        console.error('Erreur lors de la récupération du stock', error);
        throw error;
    }
}


// Méthode pour ajouter du stock
async function ajouterAuStock(nomProduit, quantiteAjoutee) {
    try {
        if (typeof quantiteAjoutee !== 'number' || isNaN(quantiteAjoutee)) {
            throw new Error('La quantité ajoutée doit être un nombre');
        }
        const db = await connectToMongoDB();
        const collection = db.collection('product');

        const filter = { name: { $eq: nomProduit } };
        const produitInitial = await collection.findOne(filter);

        if (!produitInitial) {
            throw new Error('Produit introuvable');
        }

        let nouveauStockReel;
        if (quantiteAjoutee >= 0) {
            nouveauStockReel = produitInitial.quantity + quantiteAjoutee;
        } else {
            nouveauStockReel = produitInitial.quantity - Math.abs(quantiteAjoutee);
        }

        const updateFilter = { name: { $eq: nomProduit } };
        const update = {
            $set: {
                quantity: nouveauStockReel,
            },
        };

        await collection.updateOne(updateFilter, update);
        const updatedProduit = await collection.findOne(filter);
        return updatedProduit.quantity; // Retourne la quantité du produit modifié
    } catch (error) {
        console.error('Erreur lors de l\'ajout au stock', error);
        throw error;
    }
}



module.exports = {
    ajouterAuStock,
    getStock
};