import Joi from 'joi'

export const SigninSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': `should be a type of 'text'`,
    'string.empty': `cannot be an empty field`,
    'string.email': `should provide a valid email address`,
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': `should be a type of 'text'`,
    'string.empty': `cannot be an empty field`,
    'string.min': `should have a minimum length of {#limit}`,
    'any.required': `is a required field`,
  }),
})

export interface ISigninDTO {
  email: string
  password: string
}
