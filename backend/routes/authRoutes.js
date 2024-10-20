const express = require('express')

const router = express.Router()

const authControllers = require("../controllers/authControllers")

router.post("/signup", authControllers.postSignup)
router.post("/login", authControllers.postLogin)


module.exports = router