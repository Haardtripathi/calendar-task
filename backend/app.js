const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const sequelize = require("./config/config")

const app = express()
const PORT = process.env.PORT || 3000;

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")


app.use(cors({
    origin: 'http://localhost:5173', // Allow only your frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", authRoutes);
app.use("/", userRoutes);

sequelize.sync({ alter: true })
    .then(() => {
        console.log("Database synchronized")
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error synchronizing database:", err);
    });
