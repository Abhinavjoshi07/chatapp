const user = require('../models/userdb.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: '', email: '', password: '' };

    // incorrect email
    if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
    return errors
    }

  // incorrect password
    if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
    return errors
    }
  
    // duplicate email error
    if (err.code === 11000) {
      if (err.keyPattern.username) {
        errors.username = 'That username is already registered';
        return errors;
      }
      if (err.keyPattern.email) {
        errors.email = 'That email is already registered';
        return errors;
      }
    }
    
 

    if (err.message.includes('user validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
        
      });
      return errors;
    }
  
  }

 

 

//create json web token

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: maxAge
  });
};


module.exports.signup_post = async (req, res) =>{

    const {username, email, password} = req.body;
   
    try{
        const User = await user.create({username, email, password});
        const token = createToken(User._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201); res.json({ user: User._id });
       
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}
module.exports.login_post = async (req, res) =>{

  const { email, password } = req.body;

  try {
    const User = await user.login(email, password);
    const token = createToken(User._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: User._id });
 
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}


module.exports.logout_get = async (req,res) => {
  res.cookie('jwt', '', {maxAge: 1});
  res.redirect('/login.html')
}