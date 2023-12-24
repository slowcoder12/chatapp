const sequelize = require("../database");
const Sequelize = require("sequelize");
const UserGroup = sequelize.models.UserGroup;

const groupMessage = sequelize.define("Groupmessages", {
  message_content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  group_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = groupMessage;