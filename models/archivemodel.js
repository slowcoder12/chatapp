const sequelize = require("../database");
const Sequelize = require("sequelize");

const ArchivedGroupMessage = sequelize.define("ArchivedGroupMessages", {
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
  archived_at: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = ArchivedGroupMessage;
