const jwt = require("jsonwebtoken");
const config = require("config");

//middleware is to verify the json webtoken that comes in from the client and authenticate users

//midleware function takes request, response and next(callback we have to run when we are donoe so that we move to the necxt middleware)

module.exports = function (req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");

  //Check if no token
  if (!token) {
    return res.status(401).json({msg: "No token, Authorization denied"});
  }
  //verify token
  try {
    //1. decode token
    const decoded = jwt.verify(token, config.get("jwtToken"));
    //2. take req and assign value to user
    req.user = decoded.user;
    //3. call next
    next();
  } catch (error) {
    res.status(401).json({msg: " Token is not valid"});
  }
};
