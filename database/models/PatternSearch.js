const Sequelize = require('sequelize');

module.exports = sequelize.define('PatternSearch', {
  pID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  sID: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
});
