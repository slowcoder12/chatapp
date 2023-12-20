const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

exports.addUser = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  try {
    const hashed_pw = await bcrypt.hash(password, 10);

    const result = await User.create({
      name: name,
      email: email,
      phone: phone,
      password: hashed_pw,
    });
    console.log("user added");
    res.status(200).json({ message: "User added successfully" });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      console.log("duplicate entry, email already used");

      res.status(400).json({ message: "Email already in use, please Login" });
    } else {
      console.log("error in adding user", err);
      res.status(500).json({ message: "Error in adding user" });
    }
  }
};

function generateToken(user) {
  const token = {
    userId: user.id,
    userName: user.name,
  };
  console.log(user.id, user.name);

  return jwt.sign(token, jwtSecret);
}
exports.loginUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({
      attributes: ["id", "name", "email", "password"],
      where: {
        email: email,
      },
    });

    if (!user) {
      //console.log(user);
      return res
        .status(404)
        .json({ message: "User not found, please sign up" });
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        //console.log(user.password);

        res.status(200).json({
          message: "User exists",
          token: generateToken(user),
          userName: user.name,
        });
      } else {
        res.status(401).json({ message: "User not authorized" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during login" });
  }
};
