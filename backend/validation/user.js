const Joi = require("joi");

const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    middleName: Joi.string().allow("").optional(),
    lastName: Joi.string().min(2).max(50).required(),
    phone: Joi.string().min(9).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    image: Joi.object({
        url: Joi.string().uri().allow("").optional(),
        alt: Joi.string().allow("").optional(),
    }).optional(),
    address: Joi.object({
        state: Joi.string().allow("").optional(),
        country: Joi.string().required(),
        city: Joi.string().required(),
        street: Joi.string().required(),
        houseNumber: Joi.number().required(),
        zip: Joi.number().optional(),
    }).required(),
    isBusiness: Joi.boolean().optional(),
    isAdmin: Joi.boolean().optional(), // Optional but we’ll protect it in route logic
});

module.exports = registerSchema;
