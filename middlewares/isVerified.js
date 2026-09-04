// middlewares/isVerified.js
const User = require('../models/User');

exports.isVerified = async (req, res, next) => {
  try {
    // 1. Fetch the latest user data from the database using the ID from protect middleware
    const user = await User.findById(req.user._id);

    // 2. Check if user exists and if kycStatus is 'verified'
    if (user && user.kycStatus === 'verified') {
      // 3. Update req.user with the freshest data and move to the next function
      req.user = user; 
      next();
    } else {
      return res.status(403).json({
        success: false,
        msg: "Access Denied. Your account must be KYC Verified to join an Ekub."
      });
    }
  } catch (err) {
    console.error("isVerified Middleware Error:", err);
    res.status(500).json({ success: false, msg: "Server Error" });
  }
};