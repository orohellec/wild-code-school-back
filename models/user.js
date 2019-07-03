const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const AnyObject = new Schema({ anyObject: {} });
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false // to make sure we don't send the hash password to the front end
  },
  moviesList: [Object] //movies details
});

module.exports = mongoose.model('User', userSchema);