const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("node-complete1", "root", "root123", {
  dialect: "mysql",
  host: "localhost",
  define: {
    timestamps: false, 
  },
});
module.exports = sequelize;
