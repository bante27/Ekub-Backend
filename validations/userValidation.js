const { z } = require('zod');

exports.updateProfileSchema = z.object({
    address: z.string().optional(),
    occupation: z.string().optional(),
    dateOfBirth: z.string().optional()
});

exports.submitKYCSchema = z.object({
    idType: z.string().min(1, 'ID Type is required'),
    idNumber: z.string().min(1, 'ID Number is required')
});
