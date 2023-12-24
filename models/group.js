const sequelize = require("../database");
const Sequelize = require("sequelize");
const Group = sequelize.define("groups", {
  group_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdBy: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Group;
