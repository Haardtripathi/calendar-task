const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', authRoutes)
app.use('/', userRoutes)

mongoose
    .connect(MONGODB_URI)
    .then((result) => {
        console.log("Connection established");
        app.listen(5000, () => console.log("Server running on port 5000"));
    })
    .catch((err) => {
        console.log(err);
    });
