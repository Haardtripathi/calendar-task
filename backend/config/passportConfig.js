const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("GOOGLE_CALLBACK_URL:", process.env.GOOGLE_CALLBACK_URL);
try {

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ where: { email: profile.emails[0].value } });

                if (user) {
                    // User exists, update their Google-specific information
                    user.googleId = profile.id;
                    user.name = profile.displayName;
                    await user.save();
                } else {
                    // Create new user
                    user = await User.create({
                        email: profile.emails[0].value,
                        name: profile.displayName,
                        googleId: profile.id,
                        // Set a random password or leave it null, depending on your User model
                        password: Math.random().toString(36).slice(-8)
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    ));

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
