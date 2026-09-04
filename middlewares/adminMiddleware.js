// middlewares/authMiddleware.js

exports.adminOnly = async (req, res, next) => {
    try {
        const User = require('../models/User');
        // req.user is the ID decoded from the JWT token
        const user = await User.findById(req.user);

        if (user && user.role === 'admin') {
            next(); // Allow access
        } else {
            res.status(403).json({ msg: "Access denied. Admins only." });
        }
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
};