import { BadRequestError } from '~presentation/errors/bad-request'
import { ObjectSchema } from 'joi'

export const validateDTO = (data: any, schema: ObjectSchema<any>) => {
  const options = { abortEarly: false }
  const errors = schema.validate(data, options)
  return errors.error
    ? new BadRequestError(buildUsefulErrorObject(errors.error.details))
    : null
}

const buildUsefulErrorObject = (errors: any) => {
  return errors.map((error: any) => ({
    field: error.path.join('_'),
    code: error.type,
    reason: error.message,
  }))
}
