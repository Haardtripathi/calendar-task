const authenticateToken = require('../middlewares/authMiddleware');
const express = require('express');
const userController = require('../controllers/userControllers')

const router = express.Router();

router.post("/getuserId", authenticateToken, userController.getUserId)
router.post("/addEvent", authenticateToken, userController.addEvent)
router.get("/events", authenticateToken, userController.getEvents)
router.get("/recent-events", authenticateToken, userController.getRecentEvents)
router.post("/delete-event/:id", authenticateToken, userController.deleteEvent)

router.get("/update-event/:id", authenticateToken, userController.getUpdateEvent)
router.post("/updateEvent/:id", authenticateToken, userController.updateEvent)

module.exports = router