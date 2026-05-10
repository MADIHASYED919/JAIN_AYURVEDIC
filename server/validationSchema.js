const Joi = require("joi");

const orderValidation = Joi.object({
  address: Joi.object({
    fullName: Joi.string().min(3).required(),

    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone must be 10 digits"
      }),

    pincode: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required()
      .messages({
        "string.pattern.base": "Pincode must be 6 digits"
      }),

    doorNo: Joi.string().required(),

    street: Joi.string().required(),

    city: Joi.string().required(),

    state: Joi.string().required()
  }).required()
});

module.exports = { orderValidation };