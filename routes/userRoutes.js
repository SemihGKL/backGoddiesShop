const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route pour la création d'un nouvel utilisateur
router.post('/new_user', (req, res) => {
    userController.createUser(req, res)
});

// Autres routes pour les opérations liées à l'entité User
// ...

module.exports = router;
