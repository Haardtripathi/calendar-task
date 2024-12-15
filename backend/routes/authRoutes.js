const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

// Email/Password Authentication
const authController = require('../controllers/authControllers');
router.post('/signup', authController.registerUser);
router.post('/login', authController.loginUser);
// Google OAuth routeconst handleAuth = (req, res, next) => {
passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
        console.error('Authentication error:', err);
        return res.redirect('https://calendar-task-demo1.onrender.com/login?error=auth_failed');
    }

    if (!user) {
        console.error('No user found:', info);
        return res.redirect('https://calendar-task-demo1.onrender.com/login?error=no_user');
    }

    req.user = user;
    next();
})(req, res, next);
};

// Update Google OAuth routes with error handling
router.get(
    "/auth/google",
    (req, res, next) => {
        console.log("Initiating Google OAuth");
        next();
    },
    passport.authenticate("google", {
        scope: ["profile", "email"],
        prompt: 'select_account'
    })
);

router.get(
    "/auth/google/callback",
    handleAuth,
    (req, res) => {
        try {
            console.log("Google callback successful, user:", req.user.id);

            const token = jwt.sign(
                { userId: req.user.id, email: req.user.email },
                process.env.SECRET_KEY,
                { expiresIn: "1h" }
            );

            res.redirect(`https://calendar-task-demo1.onrender.com/auth-callback?token=${token}`);
        } catch (error) {
            console.error("Token generation error:", error);
            res.redirect('https://calendar-task-demo1.onrender.com/login?error=token_failed');
        }
    }
);
module.exports = router;
