const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // --- Basic Information & Auth ---
  fullName: { 
    type: String, 
    required: true,
    trim: true 
  },
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true,
    index: true // Faster lookups for login
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },

  // --- 🔒 SESSION SECURITY (The Fix) ---
  tokenVersion: { 
    type: Number, 
    default: 0 
    // Incremented on every login to invalidate old JWTs
  },

  // --- 🛡️ BRUTE FORCE PROTECTION ---
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },

  // --- OTP & Verification ---
  otp: { type: String },
  otpExpire: { type: Date },
  isVerified: { type: Boolean, default: false },

  // --- Profile Details ---
  address: { type: String, default: '' },
  occupation: { type: String, default: '' },
  dateOfBirth: { type: Date },

  // --- KYC / Identity Documents ---
  kycStatus: { 
    type: String, 
    enum: ['not_submitted', 'pending', 'verified', 'rejected'], 
    default: 'not_submitted' 
  },
  idType: { type: String },
  idNumber: { type: String },
  idImage: { type: String }, 
  rejectionReason: { type: String } 
  
}, { 
  timestamps: true 
});

// Middleware to clean up sensitive data before sending to client
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.otp;
  delete user.tokenVersion;
  return user;
};

module.exports = mongoose.model('User', UserSchema);