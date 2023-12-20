const sequelize = require("../database");
const User = require("../models/user");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({});

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "err occured in displaying" });
  }

  //console.log(username);
};
