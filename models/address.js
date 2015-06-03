
var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('address', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    street: { type: Sequelize.STRING },
    state_province: { type: Sequelize.STRING },
    postal_code: { type: Sequelize.STRING },
    country_code: { type: Sequelize.STRING }
  },{
    underscored: true,
    timestamps: false
  });
};
