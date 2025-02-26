import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
const joiPassword = Joi.extend(joiPasswordExtendCore);

export const schemaCreateUser = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().required(),
  password: joiPassword
    .string()
    .min(8)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .required(),
  role: Joi.string().valid("USER", "PREMIUM_USER", "ADMIN").default("USER"),
});

export const schemaUpdateRole = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid("USER", "PREMIUM_USER", "ADMIN").required(),
});

export const schemaUpdatePassword = Joi.object({
  email: Joi.string().email().required(),
  password: joiPassword
    .string()
    .min(8)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .required(),
});

export const schemaBlockUser = Joi.object({
  email: Joi.string().email().required(),
});