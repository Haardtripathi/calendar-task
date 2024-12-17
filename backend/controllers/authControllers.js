const User = require("../models/user")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.SECRET_KEY;

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        // console.log(email, password)
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword })
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser })
    } catch (error) {
        next(error)
    }
}

module.exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        // console.log(email, password)
        const user = await User.findOne({ where: { email: email } })
        // console.log(user)
        if (!user) {
            return res.status(401).json({ message: "User not found" })  // User not found in the database.
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        // console.log(password, user.password)
        if (!user || !isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" })
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: "User logged in successfully", token, userId: user.id })
    } catch (error) {
        next(error)
    }
}
