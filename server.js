// Imports
const express = require('express');
const app = express();
const cors = require('cors');
// const passport = require('passport');
// require('./config/passport')(passport);
// require('dotenv').config();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Controllers
app.use('/users', require('./controllers/users'));

// Home route
app.get('/', (req, res) => {
  res.status(200).json({ message: `Smile—you're being watched by the backend engineering team.` });
});

// Listen method
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`The server is up and running on PORT ${PORT}`);
});
