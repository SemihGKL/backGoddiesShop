
const {ajouterAuStock,getStock} = require('../controllers/stockController');
let StockInitial;
beforeEach(async () => {
    StockInitial = await getStock('ProduitA');
});

describe('Tests pour modifier la quantité de stock', () => {
    test('Ajout de stock avec une quantité réelle nulle', async () => {
        const quantiteInitial = StockInitial.quantityReel;
        const stockModifie = await ajouterAuStock(StockInitial.name, 0, true);

        expect(stockModifie).toEqual(quantiteInitial);
    });

    test('Ajout de stock RESERVE (valeur positive)', async () => {
        const quantiteAjoutee = 7;
        const quantiteInitial = StockInitial.quantityReserve;
        const stockModifie = await ajouterAuStock(StockInitial.name, quantiteAjoutee, false);
        expect(stockModifie).toBe(quantiteInitial + quantiteAjoutee);
    });

    test('Ajout de stock REEL (valeur positive)', async () => {
        const quantiteAjoutee = 7;
        const quantiteInitial = StockInitial.quantityReel;
        const stockModifie = await ajouterAuStock(StockInitial.name, quantiteAjoutee, true);

        expect(stockModifie).toBe(quantiteInitial + quantiteAjoutee);
    });

    test('Retrait de stock RESERVE (valeur négative)', async () => {
        const quantiteAjoutee = -7;
        const quantiteInitial = StockInitial.quantityReserve;
        const stockModifie = await ajouterAuStock(StockInitial.name, quantiteAjoutee, false);

        expect(stockModifie).toEqual(quantiteInitial + quantiteAjoutee);
    });

    test('Retrait de stock REEL (valeur négative)', async () => {
        const quantiteAjoutee = -7;
        const quantiteInitial = StockInitial.quantityReel;
        const stockModifie = await ajouterAuStock(StockInitial.name, quantiteAjoutee, true);

        expect(stockModifie).toEqual(quantiteInitial + quantiteAjoutee);
    });

    test('Quantité reservé inférieur a quantité réelle', async () => {
        const quantiteReserve = StockInitial.quantityReel +1;
        try {
            await ajouterAuStock(StockInitial.name, quantiteReserve, false);
        } catch (error) {
            expect(error).toBeDefined();
        }
    })


});
describe('Tests avec valeur rejetée', () => {
test('Vérification de la protection contre les injections', async () => {
    const quantiteAjoutee = "1'; db.product.deleteMany({}); db.product.insertOne({name: 'ProduitInjecte', quantity: 100}); db.product.find({name: 'ProduitInjecte'}).count(); //";

    let error;
    try {
        await ajouterAuStock(StockInitial.name, quantiteAjoutee, true);
    } catch (err) {
        error = err;
    }

    expect(error).toBeDefined();
});

test('Empêche de saisir des caractères', async () => {
    const quantiteAjoutee = 'ABC';

    // Vérifiez qu'une erreur est générée lors de l'appel à la fonction avec une quantité non numérique
    let error;
    try {
        await ajouterAuStock(StockInitial.name, quantiteAjoutee, true);
    } catch (err) {
        error = err;
    }

    expect(error).toBeDefined();
});
});


