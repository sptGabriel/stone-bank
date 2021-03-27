import Joi from 'joi'

export const WithdrawSchema = Joi.object().keys({
  amount: Joi.number().positive().required().messages({
    'number.base': `should be a type of 'decimal'`,
    'number.positive': `cannot be an negative amount`,
    'any.required': `is a required field`,
  }),
})

export interface IWithdrawDTO {
  amount: number
  id: string
}
