// Imports
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Models
const models = require('../models');

router.get('/test', (req, res) => {
  res.json({ msg: 'The User endpoint is good!' });
});

router.post('/register', async (req, res) => {
  try {
    let currentUser = await models.User.findOne({
      email: req.body.email
    });
    if (currentUser) {
      return res.status(400).json({ msg: 'Email already exists' });
    } else {
      let newUser = new models.User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      bcrypt.genSalt(10, (error, salt) => {
        if (error) {
          throw error;
        }
        bcrypt.hash(newUser.password, salt, async (error, hash) => {
          try {
            if (error) {
              throw error;
            }
            newUser.password = hash;
            let createdUser = await newUser.save();
            res.status(201).json({ createdUser });
          } catch (err) {
            console.log(err);
          }
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
