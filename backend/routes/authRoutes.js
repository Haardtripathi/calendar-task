const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

// Email/Password Authentication
const authController = require('../controllers/authControllers');
router.post('/signup', authController.registerUser);
router.post('/login', authController.loginUser);
const express = require("express");
const passport = require("passport");
const router = express.Router();

// Google OAuth route
router.get(
    "/auth/google",
    (req, res, next) => {
        console.log("Hit /auth/google"); // Debug log
        next();
    },
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
    "/auth/google/callback",
    (req, res, next) => {
        console.log("Hit /auth/google/callback"); // Debug log
        next();
    },
    passport.authenticate("google", { session: false }),
    (req, res) => {
        console.log("Google Callback Success:", req.user);

        // Generate a JWT token and send to frontend
        const token = jwt.sign(
            { userId: req.user.id, email: req.user.email },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.redirect(`https://calendar-task-demo1.onrender.com/?token=${token}`);
    }
);

module.exports = router;
