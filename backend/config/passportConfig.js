const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
// console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
// console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
// console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);
try {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log("Google Strategy callback triggered!"); // Add this log

                try {
                    const existingUser = await User.findOne({ where: { googleId: profile.id } });
                    if (existingUser) {
                        console.log("Existing user found:", existingUser);
                        return done(null, existingUser);
                    }

                    const newUser = await User.create({
                        googleId: profile.id,
                        email: profile.emails[0].value,
                    });

                    console.log("New user created:", newUser);
                    return done(null, newUser);
                } catch (error) {
                    console.error("Error in Google Strategy callback:", error);
                    return done(error, null);
                }
            }
        )
    );
} catch (err) {
    console.error("Error initializing GoogleStrategy:", err);
}


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
