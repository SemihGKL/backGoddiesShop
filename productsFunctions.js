const mongoose = require('mongoose');
const dbConnect = require('./database/connection');
const Products = require('./database/models/productModel');


// Fonction pour récupérer les produits depuis la base de données
async function getProductsFromDatabase() {
  await dbConnect();
  try {
    const products = await Products.find({});
    const productsWithImage = await Promise.all(products.map(async (product) => {
      let productWithImage = product.toJSON(); // Convertir le produit en objet JSON

      // Vérifier si la propriété image existe dans le produit
      if (productWithImage.image) {
        const imageBuffer = await productWithImage.image.buffer; // Accéder aux données binaires de l'image
        productWithImage = {
          ...productWithImage,
          picture: imageBuffer.toString('base64') // Conversion des données binaires en base64
        };
      }

      return productWithImage;
    }));

    return productsWithImage;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits depuis la base de données :', error);
    throw error;
  }
}
async function getProductByName(req, res) {
  const { productName } = req.params;

  try {
    await dbConnect();
    const product = await Products.findOne({ name: productName });

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Récupérer les données binaires de l'image du produit
    if (product.image) {
      const imageBuffer = await product.image.buffer; // Accéder aux données binaires de l'image
      product.image = imageBuffer;
    }

    return res.json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit :', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
}


  module.exports = {
    getProductsFromDatabase: getProductsFromDatabase,
    getProductByName: getProductByName
  };