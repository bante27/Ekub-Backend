const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');
const AppError = require('../utils/appError');

class ContactService {
    static async submitContact(data) {
        const { name, email, subject, message } = data;
        const contact = await Contact.create({ name, email, subject, message });
        return contact;
    }

    static async getMessages() {
        const messages = await Contact.find().sort('-createdAt');
        return messages;
    }

    static async deleteMessage(id) {
        const message = await Contact.findByIdAndDelete(id);
        if (!message) {
            throw new AppError('Message not found', 404);
        }
        return true;
    }

    static async replyMessage(email, replyText, originalSubject) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USERNAME, 
                pass: process.env.MAIL_PASSWORD 
            }
        });

        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: `Re: ${originalSubject || 'Inquiry'}`,
            text: replyText
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Nodemailer Error:", error);
            throw new AppError('Failed to send email', 500);
        }

        return true;
    }
}

module.exports = ContactService;
