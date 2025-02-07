import Joi from "joi";

export const createContactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string()
    .min(3)
    .max(20)
    .email({ tlds: { allow: false } }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal").required(),
});
