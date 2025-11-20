const jwt = require("jsonwebtoken");

// Verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token." });
    }
};

// Check if user is business
const isBusiness = (req, res, next) => {
    if (!req.user.isBusiness) {
        return res.status(403).json({ error: "Access denied. Business account required." });
    }
    next();
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }
    next();
};

// Check if user is business OR admin
const isBusinessOrAdmin = (req, res, next) => {
    if (!req.user.isBusiness && !req.user.isAdmin) {
        return res.status(403).json({ error: "Access denied. Business or Admin account required." });
    }
    next();
};

module.exports = { verifyToken, isBusiness, isAdmin, isBusinessOrAdmin };

