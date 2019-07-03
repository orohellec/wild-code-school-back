const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user');

require('dotenv').config();

const corsOptions = {
  allowedHeaders: ['Content-Type', 'Authorization']
}

const PORT = 4000;

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(userRoutes);

app.use((error, req, res, next) => {
  if (error.httpStatusCode === 500) {
    error.message = 'Internal Server Error';
  }
  res.status(error.httpStatusCode).json({error: error.message});
});

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useFindAndModify: false })
  .then(result => {
    app.listen(PORT, () => console.log('Server running on port: ' + PORT));
  })
  .catch(err => console.log(err));

