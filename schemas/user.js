const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'missing required email field !!',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'missing required password field !!',
  }),
});
module.exports = {
  userSchema,
};
