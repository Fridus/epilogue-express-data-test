
var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  return sequelize.define('task', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    deadline: Sequelize.DATE
  });
};
