const Joi = require('joi');

const passwordSchema = Joi.object({
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$')).required()
        .messages({
            'string.pattern.base': 'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.'
        })
});

module.exports = { passwordSchema };
