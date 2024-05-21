const Joi = require('joi');

const registrationSchema = Joi.object({
    username: Joi.string().alphanum().max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$')).required()
        .messages({
            'string.pattern.base': 'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.'
        }),
    phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required()
});

module.exports = { registrationSchema };
