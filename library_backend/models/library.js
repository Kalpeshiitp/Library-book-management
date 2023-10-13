const Sequelize = require('sequelize');
const { DataTypes } = Sequelize; 
const sequelize = require('../util/database');

const LibraryBook = sequelize.define('library_book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  takeDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  returnDate: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('taken', 'returned'), // Define ENUM type using DataTypes
    allowNull: false
  },
  fine: {
    type: DataTypes.INTEGER
  },
  returnedDate: {
    type: DataTypes.DATE
  }
});

module.exports = LibraryBook;