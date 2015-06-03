
var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('user', {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    underscored: true,
    timestamps: false
  });
};
