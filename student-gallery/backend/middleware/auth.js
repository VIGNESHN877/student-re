const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const User = require('../models/User');

exports.auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Check if user still exists
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'User not found' });

        // Add user to request
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

exports.admin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};