const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const token = req.get('Authorization').split(' ')[1];
  try {
    const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET);
    req.userId = decodedToken.userId;
    req.userEmail = decodedToken.email;
  } catch(error) {
    error.httpStatusCode = 401;
    error.message = "Unauthorized";
    console.log(error);
  }
  next();
}