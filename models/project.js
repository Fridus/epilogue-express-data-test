
var Sequelize = require('sequelize');

module.exports = function(sequelize) {

  return sequelize.define('project', {
    title: Sequelize.STRING,
    description: Sequelize.TEXT
  });

};
