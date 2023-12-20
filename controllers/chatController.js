const sequelize = require("../database");
const User = require("../models/user");
const Message = require("../models/message");

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

exports.sendMessage = async (req, res) => {
  try {
    const messageContent = req.body.message;
    const userId = req.user.id;

    console.log(userId);

    const result = await Message.create({
      message_content: messageContent,
      userId: userId,
    });

    console.log(result);

    res.status(201).json({ message: "Message added successfully" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error occurred in adding message to the database" });
  }
};
