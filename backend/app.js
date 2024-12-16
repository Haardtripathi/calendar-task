const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport"); // Import passport

const sequelize = require("./config/config");
require("./config/passportConfig")

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;


// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());
// Session for Passport.js
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    })
);

// CORS configuration
app.use(
    cors({
        origin: [
            "https://calendar-task-demo1.onrender.com",
            "https://calendar-task-gauth.onrender.com"
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
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
    .sync({ alter: true })
    .then(() => {
        console.log("Database synchronized");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error synchronizing database:", err);
    });
