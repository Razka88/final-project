const Joi = require("joi");

const cardSchema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    subtitle: Joi.string().max(200).allow("").optional(),
    description: Joi.string().min(10).max(1000).required(),
    phone: Joi.string().min(9).max(15).required(),
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
});

module.exports = cardSchema;

