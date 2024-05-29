const Joi = require('joi');

/**
 * Joi schema for validating user registration
 * @type {Joi.ObjectSchema}
 */
const registrationSchema = Joi.object({
    /**
     * Username of the user
     * - Alphanumeric
     * - Maximum length of 20 characters
     * - Required
     * @example "johnDoe123"
     */
    username: Joi.string().alphanum().max(20).required(),
    /**
     * Email of the user
     * - Must be a valid email format
     * - Required
     * @example "example@example.com"
     */
    email: Joi.string().email().required(),
    /**
     * Password of the user
     * - Must be 8-20 characters long
     * - Include at least one uppercase letter, one lowercase letter, one number, and one special character
     * - Required
     * @example "Password@123"
     */
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$')).required()
        .messages({
            'string.pattern.base': 'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.'
        }),
    phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required()
    /**
     * Phone number of the user
     * - Must be exactly 10 digits long
     * - Required
     * @example "1234567890"
     */
});

module.exports = { registrationSchema };
