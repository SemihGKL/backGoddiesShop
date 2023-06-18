const mongoose = require("mongoose");
require('dotenv').config()

async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connecté à MongoDB !');

        // Vous pouvez maintenant interagir avec votre base de données

        mongoose.connection.close();
        console.log('Déconnecté de MongoDB !');
    } catch (error) {
        console.error('Erreur lors de la connexion à MongoDB :', error);
    }

}

module.exports = dbConnect;