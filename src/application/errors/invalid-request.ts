import { ApplicationError } from './app.error'

export class InvalidRequestError extends ApplicationError {
  constructor(public statusCode = 400) {
    super('Please check your request, something is wrong')
    this.name = 'InvalidRequestError'
  }
  serialize() {
    const { message, name, statusCode } = this
    return { message, name, statusCode }
  }
}
