const { Sequelize } = require("sequelize")
require("dotenv").config()

// const sequelize = new Sequelize(
//     process.env.MYSQL_ADDON_DB,       // Database name
//     process.env.MYSQL_ADDON_USER,     // Database username
//     process.env.MYSQL_ADDON_PASSWORD, // Database password
//     {
//         host: process.env.MYSQL_ADDON_HOST,  // MySQL host
//         port: process.env.MYSQL_ADDON_PORT,  // MySQL port
//         dialect: 'mysql',
//         logging: false,  // Optional: turn off SQL logging
//     }
// )


const sequelize = new Sequelize(
    process.env.DB_NAME,       // Database name
    process.env.DB_USER,     // Database username
    process.env.DB_PASSWORD, // Database password
    {
        host: process.env.DB_HOST,  // MySQL host
        // port: process.env.MYSQL_ADDON_PORT,  // MySQL port
        dialect: 'mysql',
        logging: false,  // Optional: turn off SQL logging
    }
)


module.exports = sequelize

