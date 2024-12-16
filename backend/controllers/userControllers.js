const User = require("../models/user")
const Event = require("../models/event")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = "your_secret_key_here";
const { Op } = require('sequelize');

module.exports.getUserId = async (req, res) => {
    const userId = req.user.userId;
    console.log(userId);
}

module.exports.addEvent = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(userId);
        console.log(req.body);

        const newEvent = new Event({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            userId: userId
        });

        await newEvent.save()
        res.status(201).json({ message: "Event added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving event: " + error.message });
    }
}

module.exports.getEvents = async (req, res, next) => {
    try {
        const userId = req.user.userId

        const userEvents = await Event.findAll({ where: { userId: userId } })
        res.status(200).json(userEvents);
    } catch (error) {
        res.status(500).json({ message: "Error: " + error.message });
    }
}

module.exports.getRecentEvents = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const formattedToday = today.toISOString().split('T')[0];
        const formattedTomorrow = tomorrow.toISOString().split('T')[0];

        const userRecentEvents = await Event.findAll({
            where: {
                userId: userId,
                date: {
                    [Op.between]: [formattedToday, formattedTomorrow],
                },
            },
            order: [['date', 'ASC'], ['startTime', 'ASC']],
        });

        res.status(200).json(userRecentEvents);
    } catch (error) {
        res.status(500).json({ message: "Error: " + error.message });
    }
}

module.exports.deleteEvent = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const event = Event.destroy({ where: { id: req.params.id } })
        res.status(200).json("Deleted successfully")
    } catch (error) {
        res.status(500).json({ message: "Error: " + error.message });
    }
}

module.exports.getUpdateEvent = async (req, res, next) => {
    try {
        const userId = req.user.userId
        const event = await Event.findOne({ where: { id: req.params.id } })
        res.status(200).json(event)
    } catch (error) {
        res.status(500).json({ message: "Error: " + error.message });
    }
}

module.exports.updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const { date, title, startTime, endTime, description } = req.body;

        const event = await Event.findOne({ where: { id } });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.userId !== userId) {
            return res.status(403).json({ message: 'You do not have permission to update this event' });
        }

        event.date = date;
        event.title = title;
        event.startTime = startTime;
        event.endTime = endTime;
        event.description = description;
        await event.save();

        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};

