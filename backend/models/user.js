const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true, // Optional for users without Google login
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, // Required for all users
        unique: true,
        validate: {
            isEmail: true, // Ensures valid email format
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true, // Optional for Google login users
    },
});

module.exports = User;
