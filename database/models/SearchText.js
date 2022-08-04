const Sequelize = require('sequelize');

module.exports = sequelize.define('SearchText', {
  ID: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  searchTerm: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  link: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
});
