const User = require("../models/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



module.exports.postSignup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error in postSignup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


module.exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create and sign JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, userId: user._id });
    } catch (error) {
        console.error("Error in postLogin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};