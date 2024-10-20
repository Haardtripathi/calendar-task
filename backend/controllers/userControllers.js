const User = require("../models/user")
const Event = require("../models/event")

module.exports.getEventsPage = async (req, res, next) => {

}

module.exports.createEvent = async (req, res, next) => {
    const { title, dateAndTime, description } = req.body.eventDetails;
    if (!title || !dateAndTime || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const dateString = new Date(dateAndTime);
    try {
        // Create a new event instance
        const newEvent = new Event({
            title,
            dateAndTime: dateString,
            description,
        });

        // Save the event to the database
        await newEvent.save();

        // Optionally, push the event ID into the user's eventList if needed
        await User.findByIdAndUpdate(req.body.id, { $push: { eventList: newEvent._id } });

        // Respond with the created event
        return res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}