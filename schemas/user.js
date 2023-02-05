const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'missing required email field !!',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'missing required password field !!',
  }),
});

const userSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});

const userEmailVerifySchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'missing required email field !!',
  }),
});

module.exports = {
  userSchema,
  userSubscriptionSchema,
  userEmailVerifySchema,
};
