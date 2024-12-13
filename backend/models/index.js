const sequelize = require('../config/database');
const User = require('./user');
const Event = require('./event');

// Define relationships
User.hasMany(Event, { foreignKey: 'userId', onDelete: 'CASCADE' });
Event.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    User,
    Event,
};
