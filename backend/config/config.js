const { Sequelize } = require("sequelize")
require("dotenv").config()

const sequelize = new Sequelize(
    process.env.MYSQL_ADDON_DB,       // Database name
    process.env.MYSQL_ADDON_USER,     // Database username
    process.env.MYSQL_ADDON_PASSWORD, // Database password
    {
        host: process.env.MYSQL_ADDON_HOST,  // MySQL host
        port: process.env.MYSQL_ADDON_PORT,  // MySQL port
        dialect: 'mysql',
        logging: false,  // Optional: turn off SQL logging
    }
)

module.exports = sequelize

