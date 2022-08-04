const Sequelize = require('sequelize');

module.exports = sequelize.define('Reply', {
  ID: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  replyEmbed: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  // needed for authentication, so its not possible to edit a reply from another guild
  guildID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
});
