const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], lowercase: true },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: [true, 'Message is required'], minlength: 10 },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', ContactSchema);