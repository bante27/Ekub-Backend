const ContactService = require('../services/contactService');
const catchAsync = require('../utils/catchAsync');

exports.submitContact = catchAsync(async (req, res) => {
    const contact = await ContactService.submitContact(req.body);
    res.status(201).json({
        success: true,
        message: 'Your message has been received, thank you!',
        data: contact
    });
});

exports.getMessages = catchAsync(async (req, res) => {
    const messages = await ContactService.getMessages();
    res.status(200).json({ success: true, data: messages });
});

exports.deleteMessage = catchAsync(async (req, res) => {
    await ContactService.deleteMessage(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});

exports.replyMessage = catchAsync(async (req, res) => {
    const { email, replyText, originalSubject } = req.body;
    await ContactService.replyMessage(email, replyText, originalSubject);
    res.status(200).json({
        success: true,
        message: 'Reply sent successfully via Email!'
    });
});
