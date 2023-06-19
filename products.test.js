// Importer la fonction de récupération de produits
const { getProductsFromDatabase } = require('./productsFunctions');
let products;

beforeEach(async () => {
  products = await getProductsFromDatabase();
});

// Test pour vérifier si des produits sont récupérés depuis la BDD
describe('Checkproductsfromdatabase', () => {
  test('Récupère des produits depuis la BDD', async () => {
    // Vérifier si le tableau contient des produits
    expect(products.length).toBeGreaterThan(0);
  });


// Test pour vérifier les propriétés des produits
  test('Vérifie les propriétés des produits', () => {
    // Vérifier si chaque produit a les propriétés attendues
    products.forEach((product) => {
      expect(product.name).toBeDefined();
      expect(product.status).toBeDefined();
      expect(product.quantityReel).toBeDefined();
      expect(product.quantityReserve).toBeDefined();
      expect(product.description).toBeDefined();
      expect(product.picture).toBeDefined();
      expect(product.price).toBeDefined();
      expect(product.category).toBeDefined();
    });
  });

// Test pour vérifier si les produits ont des quantités valides

  test('Vérifie la validité des quantités des produits', () => {
    products.forEach((product) => {
      const quantityReel = parseInt(product.quantityReel);
      const quantityReserve = parseInt(product.quantityReserve);
      expect(quantityReel).toBeGreaterThanOrEqual(0); // Vérifier si la quantité réelle est supérieure ou égale à 0
      expect(quantityReserve).toBeGreaterThanOrEqual(0); // Vérifier si la quantité réservée est supérieure ou égale à 0
      expect(quantityReel).toBeGreaterThanOrEqual(quantityReserve); // Vérifier si la quantité réelle est supérieure ou égale à la quantité réservée
    });
  });

// Test pour vérifier si les produits ont des prix valides
  test('Vérifie la validité des prix des produits', () => {
    products.forEach((product) => {
      const price = parseInt(product.price);
      expect(price).toBeGreaterThan(0); // Vérifier si le prix est supérieur à 0
      expect(price).not.toBeNaN(); // Vérifier si le prix est un nombre valide
    });
  });


});
