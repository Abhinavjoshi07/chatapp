const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const {isEmail} = require('validator')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
      

    },

    email:{

        type: String,
        required: [true, 'please Enter an Email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'please Enter a valid Email']
    },

    password:{

        type: String,
        required: [true, 'please enter a password'],
        minlength: [6, 'minimum password length is 6 characters']
    }
})


// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };

// fire a function before user is saved 

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

const user = mongoose.model('user', userSchema);
module.exports = user;