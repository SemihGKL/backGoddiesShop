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
const { getProductsFromDatabase, getProductByName, getProductById,getProductPrice, getProductPriceById, getProductIdByName, getProductIdStripeByName } = require('./productsFunctions');
const Invoices = require('./database/models/invoiceModel');
const stripe = require('stripe')('sk_test_51NP5c9DiixA1W26bjnVBaySv087MOhpDmB7JfYPT4CTXec2qYBHhURB0I4f47UY8pta8wp1hd2RBXvFSYf7cWWUV00kJaWzed4');
const fetch = require('node-fetch');
const { format } = require('util');


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

const calculateOrderAmount = async (productName, quantity) => {
    try {
        console.log(productName); // Vérifiez que productName est défini
        const productPriceResponse = await fetch(`http://localhost:3000/products/${encodeURIComponent(productName)}`);
        const productPriceData = await productPriceResponse.json();
        if (!productPriceData.price) {
            throw new Error('Produit non trouvé');
        }

        const productPrice = parseInt(productPriceData.price, 10);
        const totalAmount = productPrice * quantity * 100;
        return totalAmount;
    } catch (error) {
        console.error('Erreur lors du calcul du montant de la commande :', error);
        throw error;
    }
};

app.post("/create-checkout-session", async (req, res) => {
    const { name, quantity } = req.body;

    try {
        const productId = await getProductIdStripeByName(name);
        const productPrice = await getProductPriceById(productId);

        if (!productPrice) {
            return res.status(404).json({ error: "Produit non trouvé" });
        }

        const totalAmount = parseInt(productPrice, 10) * quantity * 100;

        // Créer une session de paiement avec Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product: productId, // Utilisez l'ID du produit récupéré depuis Stripe
                        unit_amount: totalAmount,
                    },
                    quantity: quantity,
                },
            ],
            mode: "payment",
            success_url: "http://localhost:3001/shop",
            cancel_url: "http://localhost:3001",
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error("Erreur lors de la création de la session de paiement :", error);
        return res
            .status(500)
            .json({ error: "Erreur lors de la création de la session de paiement" });
    }
});









app.listen(3000);
console.log("attente de requete");