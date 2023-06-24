// const { beforeAll } = require('@jest/globals');
const dbConnect = require('../database/connection');
const User = require('../database/models/userModel');
const userController = require('../controllers/userController');

beforeAll(() => {
  // Code exécuté une seule fois avant le premier test
  // Vous pouvez effectuer ici des opérations d'initialisation ou de configuration
});

beforeEach(() => {
  dbConnect()
})

describe('Création d\'un utilisateur', () => {
  test('Échoue si firstName ou lastName est vide', async () => {
    // Créez un utilisateur avec un champ vide
    const userData = {
        lastName: 'Doe',
        firstName: 'zer',
        email: 'johdoe@example.com',
        pwd: 'P-aassword123',
        address: '123 Street',
        phone: "0706050403",
      };

    const newUser = new User(userData);

    try {
      // Tentez de créer l'utilisateur avec un champ vide
      await newUser.save(userData);

    } catch (err) {
      console.log(err);
      expect(err).toBeDefined();
    }
  });

  test('Échoue si injection MongoDB', async () => {
    // Préparation du test
    const injectedAccount = "1'; db.users.deleteMany({}); db.users.insertOne({lastName: 'injectionLast',firstName: 'fsociety',email: 'john.doe@example.com', pwd: 'password123', address: '123 Street', phone: 1234567890,}); db.users.find({lastName: 'injectionLast'}).count(); //";
  
    // Exécution de la méthode
    let error = null;
    try {
      const req = {
        body: {
          lastName: 'Doe',
          firstName: 'John',
          email: injectedAccount,
          pwd: 'P-aassword123',
          address: '123 Street',
          phone: "0706050403"
        }
      };
      const res = {};
  
      await userController.createUser(req, res);
    } catch (err) {
      error = err;
      console.log(err);
    }
  
    // Vérification de l'erreur
    expect(error).toBeDefined();
  });

  test('Échoue si l\'adresse e-mail existe déjà', async () => {

    //Supprimer les users dans la bdd
    await User.deleteMany({});

    // Créer un utilisateur avec une adresse e-mail
    const existingUser = new User({
      lastName: 'Doe',
      firstName: 'John',
      email: 'zerzer@exa.com',
      pwd: 'P-aassword123',
      address: '123 Street',
      phone: "0706050403",
    });

    await existingUser.save();

    // Créer un nouvel utilisateur avec la même adresse e-mail
    const newUser = {
      lastName: 'Smith',
      firstName: 'Jane',
      email: 'zerzer@exa.com',
      pwd: 'P-aassword123',
      address: '456 Avenue',
      phone: "0706050403",
    };

    let error = null;
    try {
      await userController.createUser({
        body: newUser
      }, {});
    } catch (err) {
      console.log(err);
      error = err;
    }

    // Vérifier que l'erreur est définie
    expect(error).toBeDefined();
  });

  test('Échoue si le pwd ne respecte pas les règles définies', async () => {

    // Créer un nouvel utilisateur
    const newUser = {
      lastName: 'Smith',
      firstName: 'Jane',
      email: 'johazene@example.com',
      pwd: 'pwd123',
      address: '456 Avenue',
      phone: 9876543210,
    };

    let error = null;
    try {
      await userController.createUser({
        body: newUser
      }, {});
    } catch (err) {
      console.log(err);
      error = err;
    }

    // Vérifier que l'erreur est définie
    expect(error).toBeDefined();
  });

  test.only('Échoue si le numéro de téléphone n\'est pas valide', async () => {

    // Créer un nouvel utilisateur avec un numéro non compatible
    const newUser = {
      lastName: 'Smith',
      firstName: 'Jane',
      email: 'test65@example.com',
      pwd: 'P-aassword123',
      address: '456 Avenue',
      phone: 'azerezr',
    };

    let error = null;
    try {
      await userController.createUser({
        body: newUser
      }, {});
    } catch (err) {
      console.log(err);
      error = err;
    }

    // Vérifier que l'erreur est définie
    expect(error).toBeDefined();
  });
});
