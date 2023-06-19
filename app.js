const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

// require database connection 
const dbConnect = require("./database/connection");

// Import data models
const Users = require('./database/models/userModel');
const { getProductsFromDatabase } = require('./productsFunctions');
const Invoices = require('./database/models/invoiceModel');

// execute database connection 
dbConnect();

// app.get('/new_user', (req, res) => {
//     console.log("test account page");
// })

//API Routes
app.post('/new_user', (req, res) => {
    console.log('ok newUser')
    console.log(req.body);
    const newUser = new Users({
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        email: req.body.email,
        pwd: req.body.pwd,
        address: req.body.address,
        phone: req.body.phone
    });
  
    newUser.save() 
      .then(() => {
        res.status(201).json({ message: 'Account creation success.' });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Error when creating user account.' });
      });
  });

app.get('/products', async (req, res) => {
    try {
        const products = await getProductsFromDatabase();
        res.json(products);
    } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
    }
});

app.listen(3000);
console.log("attente de requete");