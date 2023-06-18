
const { MongoClient } = require('mongodb');

// Méthode pour se connecter à MongoDB
async function connectToMongoDB() {
    const url = 'mongodb+srv://gokolsemih:4dCJJLHJBeTPcO1p@cluster0.jhfdk8e.mongodb.net/?retryWrites=true&w=majority';
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connecté à MongoDB');
        return client.db('local');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB', error);
        throw error;
    }
}

// Méthode pour ajouter du stock
async function ajouterAuStock(nomProduit,quantiteAjoutee) {
    try {
        const db = await connectToMongoDB();
        const collection = db.collection('product');

        // Récupérer le document stock à partir de la base de données en utilisant un filtre approprié
        const filter = { name: nomProduit };
        const stockExist = await collection.findOne(filter);

        if (!stockExist) {
            throw new Error('Produit introuvable');
        }

        // Mettre à jour le stock réel en ajoutant la quantité ajoutée
        const nouveauStockReel = stockInitial.quantity + quantiteAjoutee;

        // Mettre à jour le document stock avec la nouvelle quantité
        const update = {
            $set: {
                quantity: nouveauStockReel
            }
        };

        const options = { returnOriginal: false };
        const updatedStock = await collection.findOneAndUpdate(filter, update, options);
        console.log(updatedStock);
        return updatedStock.value; // Retourne le stock modifié
    } catch (error) {
        console.error('Erreur lors de l\'ajout au stock', error);
        throw error;
    }
}

module.exports = {
    ajouterAuStock,
};