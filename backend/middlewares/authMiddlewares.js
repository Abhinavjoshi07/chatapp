const jwt = require('jsonwebtoken');
const user = require('../models/userdb.js')
require('dotenv').config()
let currentUsername


const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login.html');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login.html');
  }
};



module.exports = { requireAuth };