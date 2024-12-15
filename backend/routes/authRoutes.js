const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

// Email/Password Authentication
const authController = require('../controllers/authControllers');
router.post('/signup', authController.registerUser);
router.post('/login', authController.loginUser);

// Google OAuth Routes
router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    async (req, res) => {
        try {
            const user = req.user;

            if (!user) {
                console.error("Google OAuth Error: User not authenticated.");
                return res.status(401).send("User not authenticated.");
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                SECRET_KEY,
                { expiresIn: process.env.JWT_EXPIRY || "1h" }
            );

            console.log("Generated Token:", token);

            // Redirect to frontend with token
            const redirectURL = `https://calendar-task-demo1.onrender.com/?token=${token}`;
            console.log("Redirecting to:", redirectURL);
            res.redirect(redirectURL);
        } catch (error) {
            console.error("Error in Google OAuth callback:", error);
            res.status(500).send("Authentication failed.");
        }
    }
);



module.exports = router;
