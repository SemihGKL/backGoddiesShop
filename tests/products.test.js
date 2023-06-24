// Importer la fonction de récupération de produits
const { getProductsFromDatabase } = require('../database/products');

// Test de la fonction getProductsFromDatabase
describe('getProductsFromDatabase', () => {
 
  beforeAll(() => {
    // connexion à la bdd
  });

  // Vérifier si les produits sont récupérés correctement depuis la BDD
  test('Récupère tous les produits depuis la BDD', () => {
    const products = getProductsFromDatabase();

    // Vérifier si la fonction retourne un tableau
    expect(Array.isArray(products)).toBe(true);

    // Vérifier si le tableau contient des produits
    expect(products.length).toBeGreaterThan(0);

    // Vérifier si chaque produit a les propriétés attendues
    products.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      // + autres propriétés
    });
  });

  // Fermer la connexion à la base de données après les tests
  afterAll(() => {
    // close database
  });
});
