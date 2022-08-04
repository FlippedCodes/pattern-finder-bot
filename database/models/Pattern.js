const Sequelize = require('sequelize');

module.exports = sequelize.define('Pattern', {
  ID: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  replyEmbed: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});
