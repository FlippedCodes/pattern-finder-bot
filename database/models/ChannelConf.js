const Sequelize = require('sequelize');

module.exports = sequelize.define('ChannelConf', {
  ID: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  pID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  channelID: {
    type: Sequelize.STRING(30),
    allowNull: false,
  },
  pictureOCR: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});
