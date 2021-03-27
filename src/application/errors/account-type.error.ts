import { ApplicationError } from './app.error'

export class InvalidAccountTypeError extends ApplicationError {
  constructor(public readonly statusCode = 400) {
    super(`Invalid Account.`)
    this.name = 'InvalidAccountError'
  }
  serialize() {
    const { message, name, statusCode } = this
    return { message, name, statusCode }
  }
}
