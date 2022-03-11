require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.URL_DATABASE,{
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

  sequelize.sync();


module.exports = sequelize;