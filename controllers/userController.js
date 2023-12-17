const User = require("../models/user");
const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");
require("dotenv").config();

//const jwtSecret = process.env.JWT_SECRET;

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

      res.status(400).json({ message: "Email already in use" });
    } else {
      console.log("error in adding user", err);
      res.status(500).json({ message: "Error in adding user" });
    }
  }
};
