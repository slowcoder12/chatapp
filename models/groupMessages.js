const sequelize = require("../database");
const Sequelize = require("sequelize");

const groupMessage = sequelize.define("Groupmessages", {
  message_content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  group_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = groupMessage;
