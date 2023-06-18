
const { ajouterAuStock } = require('./stockFunctions'); // Importer la fonction à tester
const {getStock} = require('./stockFunctions');
let StockInitial;

beforeEach(async () => {
    StockInitial = await getStock('Produit A');
});

test('Ajout de stock avec une quantité nulle', async () => {
    const quantiteInitial = StockInitial.quantity;
    const stockModifie = await ajouterAuStock(StockInitial.name, 0);

    expect(stockModifie).toEqual(quantiteInitial);
});
test('Ajout de stock (valeur positive)', async () => {
    const quantiteAjoutee = 7;
    const quantiteInitial = StockInitial.quantity;
    const stockModifie = await ajouterAuStock(StockInitial.name, quantiteAjoutee);

    expect(stockModifie).toBe(quantiteInitial + quantiteAjoutee);
});


test('Retrait de stock (valeur négative)', async () => {
    const quantiteAjoutee = -7;
    const quantiteInitial = StockInitial.quantity;
    const stockModifie = await ajouterAuStock(StockInitial.name, quantiteAjoutee);

    expect(stockModifie).toEqual(quantiteInitial + quantiteAjoutee);
});

test('Empeche de saisir des caractères', async () => {
    const quantiteAjoutee = 'ABC';

    // Vérifiez qu'une erreur est générée lors de l'appel à la fonction avec une quantité non numérique
    let error;
    try {
        await ajouterAuStock(StockInitial.name, parseInt(quantiteAjoutee));
    } catch (err) {
        error = err;
    }

    expect(error).toBeDefined();
});


test('Vérification de la protection contre les injections', async () => {
    // Préparation du test
    const quantiteAjoutee = "1'; db.product.deleteMany({}); db.product.insertOne({name: 'ProduitInjecte', quantity: 100}); db.product.find({name: 'ProduitInjecte'}).count(); //";

    // Exécution de la méthode
    let error;
    try {
        await ajouterAuStock(StockInitial.name, quantiteAjoutee);
    } catch (err) {
        error = err;
    }

    // Vérification de l'erreur
    expect(error).toBeDefined();
});

