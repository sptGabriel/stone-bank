import Joi from 'joi'

export const TransferSchema = Joi.object().keys({
  target_email: Joi.string().email().required().messages({
    'string.base': `should be a type of 'text'`,
    'string.empty': `cannot be an empty field`,
    'string.email': `should provide a valid email address`,
  }),
  amount: Joi.number().positive().required().messages({
    'number.base': `should be a type of 'decimal'`,
    'number.positive': `cannot be an negative amount`,
    'any.required': `is a required field`,
  }),
})

export interface ITransferDTO {
  id: string
  target_email: string
  amount: number
}
