const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({message: 'Access denied. No token provided.'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({message: 'Token is not valid.'});
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Token is not valid.'});
    }
};

const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({message: 'Access denied. Admin rights required.'});
    }
};

module.exports = { auth, adminAuth };