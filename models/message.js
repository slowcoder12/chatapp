const sequelize = require("../database");
const Sequelize = require("sequelize");

const Message = sequelize.define("messages", {
  message_content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

module.exports = Message;
