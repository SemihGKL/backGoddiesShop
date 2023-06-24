const User = require('../database/models/userModel');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

const createUser = (req, res) => {

  const cryptedPwd = bcrypt.hashSync(req.body.pwd, 10);

  const newUser = new User({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    email: req.body.email,
    pwd: cryptedPwd,
    address: req.body.address,
    phone: req.body.phone
  });

  newUser.save({ validateBeforeSave: true })
    .then(() => {
      res.json({ message: 'Account creation success.'});
    })
    .catch((error) => {
      res.status(500).send({ error: error});
    });
};

module.exports = {
  createUser
};
