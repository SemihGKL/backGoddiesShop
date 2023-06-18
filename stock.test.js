
const { ajouterAuStock } = require('./stockFunctions'); // Importer la fonction à tester

test('Ajout de stock avec une quantité nulle', () => {
    const stockInitial = {
        name: "Produit A",
        status: "En stock",
        quantity: 10,
        description: "...",
        picture: "...",
        price: 50,
        category: "Catégorie A"
    };
    const stockModifie= ajouterAuStock( stockInitial.nom, 0);

    expect(stockModifie).toEqual(stockInitial.quantity);
});

test('Quantité de stock réel supérieure à la quantité ajoutée', () => {
    const stockInitial = {
        name: "Produit A",
        status: "En stock",
        quantity: 10,
        description: "...",
        image: "...",
        price: 50,
        category: "Catégorie A"
    };

    const quantiteAjoutee = 7;

    const stockModifie = ajouterAuStock(stockInitial, quantiteAjoutee);

    expect(stockModifie.stockReel).toBe(stockInitial.stockReel + quantiteAjoutee);

    expect(stockModifie.stockReserve).toBe(stockInitial.stockReserve);
});

test('Quantité de stock réel inférieure à la quantité ajoutée', () => {
    const stockInitial = {
        name: "Produit A",
        status: "En stock",
        quantity: 10,
        description: "...",
        image: "...",
        price: 50,
        category: "Catégorie A"
    };

    const quantiteAjoutee = 15;

    const stockModifie = ajouterAuStock(stockInitial, quantiteAjoutee);

    expect(stockModifie.stockReel).toBe(stockInitial.stockReel + quantiteAjoutee);

    expect(stockModifie.stockReserve).toBe(stockInitial.stockReserve);

})

test('Éviter les injections MongoDB lors de la saisie des nouvelles quantités', () => {
    const stockInitial = {
        name: "Produit A",
        status: "En stock",
        quantity: 10,
        description: "...",
        image: "...",
        price: 50,
        category: "Catégorie A"
    };
    const quantiteAjoutee = '15';

    // On parse la
    const stockModifie = ajouterAuStock(stockInitial, parseInt(quantiteAjoutee));

    expect(stockModifie.stockReel).toBe(stockInitial.stockReel + parseInt(quantiteAjoutee));

    expect(stockModifie.stockReserve).toBe(stockInitial.stockReserve);
});

test('Quantité ajoutée non numérique génère une erreur', () => {
    const stockInitial = {
        produit: 'ABC',
        stockReel: 10,
        stockReserve: 5,
        stockHistorique: []
    };

    const quantiteAjoutee = 'ABC';

    // Vérifiez qu'une erreur est générée lors de l'appel à la fonction avec une quantité non numérique
    expect(() => {
        ajouterAuStock(stockInitial, parseInt(quantiteAjoutee));
    }).toThrow();
});
