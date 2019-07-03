const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const axios = require('axios');

exports.postUser = async (req, res, next) => {
  const userInput = req.body;
  const saltRounds = 10;
  try {
    const hashPassword = await bcrypt.hash(userInput.password, saltRounds);
    const user = new User({
      email: userInput.email,
      password: hashPassword
    })
    user.save();
    res.status(201).json('User created');
  } catch(err) {
    res.status(500).json('Internal server error');
    console.log(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const userInput = req.body;
  try {
    const user = await User.findOne({email: userInput.email}).select("+password");
    if (!user) {
      const error = new Error;
      error.httpStatusCode = 401;
      error.message = 'Invalid email or password';
      return next(error);
    }
    console.log(user);
    const match = await bcrypt.compare(userInput.password, user.password);
    if (!match) {
      const error = new Error;
      error.httpStatusCode = 401;
      error.message = 'Invalid email or password';
      return next(error);
    }
    const token =
      jwt.sign({ 
        userId: user._id.toString(), 
        email: user.email 
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h"} 
      );
    res.status(200).json({token: token, userId: user._id.toString()});

  } catch(error) {
    console.log(error);
    error.httpStatusCode = 500;
    next(error);
  }
}

exports.postUserMovie = async (req, res, next) => {
  const movieId = req.body.movieId;
  const userId = req.userId;
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.MD_API_KEY}&language=fr`);
    const user = await User.findById(userId);
    user.moviesList.push(res.data);
    user.save();
  } catch(error) {
    console.log(error);
    error.httpStatusCode = 500;
    next(error);
  }
  res.status(201).json('Movie added to WishList');
}

exports.deleteUserMovie = async (req, res, next) => {
  const movieIdToDelete = parseInt(req.params.movieId, 10);
  
  const userId = req.userId;
  console.log('++++++++++++++++');
  console.log('UserId', userId);
  console.log('++++++++++++++++');

  try {
    await User.findByIdAndUpdate(userId, 
    { $pull: {'moviesList': { id: movieIdToDelete } } });
  } catch(error) {
    console.log(error);
    error.httpStatusCode = 500;
  }
  res.status(201).json('moviesList updated');
}

exports.getUser = async (req, res, next) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    res.status(200).json({user: user});
  } catch(error) {
    error.httpStatusCode = 500;
    next(error);
  }
}