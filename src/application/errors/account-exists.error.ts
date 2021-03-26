import { ApplicationError } from './app.error'

export class AccountAlreadyExistsError extends ApplicationError {
  constructor(public readonly statusCode = 400) {
    super('Account already exists')
  }

  serialize() {
    const { statusCode, message } = this
    return {
      message,
      statusCode,
    }
  }
}
