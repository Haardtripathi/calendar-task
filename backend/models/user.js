const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    eventList: [{
        type: Schema.Types.ObjectId,
        ref: 'Event',
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);