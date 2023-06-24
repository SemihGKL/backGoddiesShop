const mongoose = require("mongoose");
require('dotenv').config()

async function dbConnect() {
    try {
        const options = { wtimeoutMS: 30000 }; // Augmente le délai d'attente à 30 secondes
        await mongoose.connect(process.env.MONGO_URL, options);
        console.log('Connecté à MongoDB !');

    } catch (error) {
        console.error('Erreur lors de la connexion à MongoDB :', error);
    }
}

module.exports = dbConnect;