const express = require('express')

const router = express.Router()

const userControllers = require("../controllers/userControllers")

router.get("/events", userControllers.getEventsPage)

router.post("/create-event", userControllers.createEvent)

module.exports = router