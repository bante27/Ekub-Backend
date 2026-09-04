const { ZodError } = require('zod');
const AppError = require('../utils/appError');

const validate = (schema) => async (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const message = error.errors[0].message;
            return next(new AppError(message, 400));
        }
        next(error);
    }
};

module.exports = validate;
