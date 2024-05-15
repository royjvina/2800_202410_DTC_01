const Joi = require('joi');

const registrationSchema = Joi.object({
    username: Joi.string().alphanum().max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().max(20).required(),
    phone: Joi.string().required() // Phone number is required
});
 
module.exports = { registrationSchema };
