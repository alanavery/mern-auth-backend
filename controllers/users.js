// Imports
require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET;

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

router.post('/login', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    let user = await models.User.findOne({
      email
    });
    console.log(user);

    if (!user) {
      res.status(400).json({ msg: 'User not found' });
    } else {
      let isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        console.log(isMatch);
        const payload = {
          id: user.id,
          email: user.email,
          name: user.name
        };
        jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (error, token) => {
          console.log(token);
          res.json({
            success: true,
            token: `Bearer ${token}`
          });
        });
      } else {
        return res.status(400).json({ msg: 'Email or password is incorrect' });
      }
    }
  } catch (err) {}
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;
