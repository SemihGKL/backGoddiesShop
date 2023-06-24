const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes')
const dbConnect = require("./database/connection");

app.use(express.json());
app.use(bodyParser.json());

// execute database connection
dbConnect();

// Routes des utilisateurs
app.use('/users', userRoutes);

// Gestion des autres routes

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3000);
console.log("attente de requete");