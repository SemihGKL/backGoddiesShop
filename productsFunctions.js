const mongoose = require('mongoose');
const dbConnect = require('./database/connection');
const Products = require('./database/productModel');


// Fonction pour récupérer les produits depuis la base de données
async function getProductsFromDatabase() {
  await dbConnect();
  try {
    const products = await Products.find({}); // Récupérer tous les produits
    console.log(products);
    return products;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits depuis la base de données :', error);
    throw error;
  } finally {
    
  }
}

  module.exports = {
    getProductsFromDatabase: getProductsFromDatabase
  };