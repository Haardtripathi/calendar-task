const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport"); // Import passport
require("./config/passportConfig"); // Import Google OAuth passport configuration
const sequelize = require("./config/config");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Session for Passport.js
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
    })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
app.use(
    cors({
        origin: "http://localhost:5173", // Frontend origin
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/", authRoutes);
app.use("/", userRoutes);

// Sync database
sequelize
    .sync({ alter: true, force: true })
    .then(() => {
        console.log("Database synchronized");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error synchronizing database:", err);
    });
