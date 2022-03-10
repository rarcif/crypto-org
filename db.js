require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.URL_DATABASE,{
  dialect: 'postgres',
  logging: false,

})

  sequelize.sync();


module.exports = sequelize;