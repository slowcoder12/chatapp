const sequelize = require("../database");
const Sequelize = require("sequelize");

const UserGroups = sequelize.define("UserGroup", {
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false, // Set the default value as needed
  },
});

module.exports = UserGroups;
