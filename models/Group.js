const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  maxMembers: { type: Number, required: true },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inviteCode: { type: String, unique: true },
  
  // All users who joined via link
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  
  // Only users whose payment is approved (The "Random Database")
  activeParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  
  winnersHistory: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    round: Number,
    dateWon: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['open', 'started', 'completed'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Group', GroupSchema);