const jwt = require("jsonwebtoken");
require("dotenv").config();


module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Authorization header is missing.");
    error.statusCode = 401;
    return next(error);
  }

  // I did the split like this with a space because I'm interested in the token
  // idc abt the Bearer
  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    //jwt.verify will decode and verify
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    e.statusCode = 500;
    throw e;
  }
  if (!decodedToken) {
    //if unable to verify or so
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
