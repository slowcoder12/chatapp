const jwt = require("jsonwebtoken");
const User = require("../models/user");
const jwtSecret = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token);
    const user = jwt.verify(token, jwtSecret);
    console.log("USER name =======>>>>>", user.userName);
    const result = await User.findByPk(user.userId);
    console.log(JSON.stringify(result));
    req.user = result;
    console.log("auth============>>>>", req.user);
    next();
  } catch (err) {
    console.log("err in auth", err);
  }
};

module.exports = { authenticate };
