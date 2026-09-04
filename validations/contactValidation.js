const { z } = require('zod');

exports.contactSubmitSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Please provide a valid email address'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(1, 'Message is required')
});

exports.contactReplySchema = z.object({
    email: z.string().email('Please provide a valid recipient email address'),
    replyText: z.string().min(1, 'Reply text is required'),
    originalSubject: z.string().optional()
});
