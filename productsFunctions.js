const mongoose = require('mongoose');
const dbConnect = require('./database/connection');
const Products = require('./database/models/productModel');
const stripe = require('stripe')('sk_test_51NP5c9DiixA1W26bjnVBaySv087MOhpDmB7JfYPT4CTXec2qYBHhURB0I4f47UY8pta8wp1hd2RBXvFSYf7cWWUV00kJaWzed4');


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

// Controller back:
async function getProductPrice(req, res) {
  const { productName } = req.params;

  try {
    await dbConnect();
    const product = await Products.findOne({ name: name });

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    return res.json({ price: product.price });
  } catch (error) {
    console.error('Erreur lors de la récupération du prix du produit :', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération du prix du produit' });
  }
}

async function getProductById(productId) {
  try {
    await dbConnect();
    const product = await Products.findById(productId);

    return product;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit :', error);
    throw error;
  }
}

async function getProductPriceById(productId) {
  try {
    await dbConnect();
    console.log(productId);
    const product = await Products.findById(new mongoose.Types.ObjectId('64900d0aef9dcf75b0ec07f4'));

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    return product.price;
  } catch (error) {
    console.error('Erreur lors de la récupération du prix du produit :', error);
    throw error;
  }
}

async function getProductIdByName(productName) {
  try {
    await dbConnect();
    const product = await Products.findOne({ name: productName });

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    return product._id;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ID du produit :', error);
    throw error;
  }
}

async function getProductIdStripeByName(productName) {
  try {
    console.log(productName);
    const products = await stripe.products.list();

    const product = products.data.find((p) => p.name === productName);

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    return product.id;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ID du produit :', error);
    throw error;
  }
}



  module.exports = {
    getProductsFromDatabase: getProductsFromDatabase,
    getProductByName: getProductByName,
    getProductPrice: getProductPrice,
    getProductById: getProductById,
    getProductPriceById: getProductPriceById,
    getProductIdByName: getProductIdByName,
    getProductIdStripeByName: getProductIdStripeByName
  };