import Joi from 'joi'
import { IRequestModel } from '../ports/request-model';

export const AddAccountSchema = Joi.object().keys({
  name: Joi.string().min(8).required().messages({
    'string.base': `should be a type of text`,
    'string.empty': `cannot be an empty field`,
    'string.min': `should have a minimum length of {#limit}`,
    'any.required': `"is a required field`,
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': `should be a type of 'text'`,
    'string.empty': `cannot be an empty field`,
    'string.min': `should have a minimum length of {#limit}`,
    'any.required': `is a required field`,
  }),
  email: Joi.string().email().required().messages({
    'string.base': `should be a type of 'text'`,
    'string.empty': `cannot be an empty field`,
    'string.email': `should provide a valid email address`,
  }),
})

export interface IAddAccountDTO {
  name: string
  email: string
  password: string
  balance: number
}