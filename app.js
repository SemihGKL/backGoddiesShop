const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const userRoutes = require('./routes/userRoutes')
const dbConnect = require("./database/connection");
const { getStock, ajouterAuStock } = require("./controllers/stockController");
// Import data models
const Users = require('./database/models/userModel');
const { getProductsFromDatabase, getProductByName} = require('./productsFunctions');
const Invoices = require('./database/models/invoiceModel');
const { getProductsByName   } = require('./productsFunctions');

app.use(express.json());
app.use(bodyParser.json());

// execute database connection
dbConnect();

// Routes des utilisateurs
app.use('/users', userRoutes);

//API Routes
app.get('/products', async (req, res) => {
    try {
        const products = await getProductsFromDatabase();
        const productsWithBase64Image = products.map(product => ({
            ...product,
            picture: product.picture.toString('base64') // Conversion des données binaires en base64
        }));
        res.json(productsWithBase64Image);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
});

app.get('/products/:productName', async (req, res) => {
    try {
        await getProductByName(req, res);
    } catch (error) {
        console.error('Erreur lors de la récupération du produit :', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
    }
});


app.get('/stock/:nomProduit', async (req, res) => {
    const nomProduit = req.params.nomProduit;
    try {
        const stock = await getStock(nomProduit);
        res.json(stock);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du stock' });
    }
});

app.post('/stock/ajouter', async (req, res) => {
    const { nomProduit, quantiteAjoutee, reelOrReserve } = req.body;
    try {
        const stockModifie = await ajouterAuStock(nomProduit, quantiteAjoutee, reelOrReserve === 'reel');
        res.json({ stockModifie });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout au stock' });
    }
});


app.listen(3000);
console.log("attente de requete");