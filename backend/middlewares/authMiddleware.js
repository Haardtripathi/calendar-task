const jwt = require('jsonwebtoken');
const SECRET_KEY = "your_secret_key_here";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Note: 'authorization' should be lowercase
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }

        req.user = user; // Attach user information to the request
        next();
    });
};

module.exports = authenticateToken;
