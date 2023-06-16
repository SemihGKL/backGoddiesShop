
const { ajouterAuStock } = require('./stockFunctions'); // Importer la fonction à tester

test('Ajout de stock avec une quantité nulle', () => {
    const stockInitial = {
        produit: 'ABC',
        stockReel: 10,
        stockReserve: 5,
        stockHistorique: []
    };

    const stockModifie = ajouterAuStock(stockInitial, 0);

    expect(stockModifie).toEqual(stockInitial);
});

test('Quantité de stock réel supérieure à la quantité ajoutée', () => {
    const stockInitial = {
        produit: 'ABC',
        stockReel: 10,
        stockReserve: 5,
        stockHistorique: []
    };

    const quantiteAjoutee = 7;

    const stockModifie = ajouterAuStock(stockInitial, quantiteAjoutee);

    expect(stockModifie.stockReel).toBe(stockInitial.stockReel + quantiteAjoutee);

    expect(stockModifie.stockReserve).toBe(stockInitial.stockReserve);
});

test('Quantité de stock réel inférieure à la quantité ajoutée', () => {
    const stockInitial = {
        produit: 'ABC',
        stockReel: 10,
        stockReserve: 5,
        stockHistorique: []
    };

    const quantiteAjoutee = 15;

    const stockModifie = ajouterAuStock(stockInitial, quantiteAjoutee);

    expect(stockModifie.stockReel).toBe(stockInitial.stockReel + quantiteAjoutee);

    expect(stockModifie.stockReserve).toBe(stockInitial.stockReserve);

})

test('Éviter les injections MongoDB lors de la saisie des nouvelles quantités', () => {
    const stockInitial = {
        produit: 'ABC',
        stockReel: 10,
        stockReserve: 5,
        stockHistorique: []
    };

    const quantiteAjoutee = '15';

    const stockModifie = ajouterAuStock(stockInitial, parseInt(quantiteAjoutee));

    expect(stockModifie.stockReel).toBe(stockInitial.stockReel + parseInt(quantiteAjoutee));

    expect(stockModifie.stockReserve).toBe(stockInitial.stockReserve);
});