import { ApplicationError } from './app.error'

export class UnauthorizedError extends ApplicationError {
  constructor(
    message?: string,
    public statusCode = 401,
    public readonly name = 'UnauthorizedError',
  ) {
    super(message || 'Access denied')
  }

  serialize() {
    const { statusCode, name, message } = this
    return { statusCode, name, message }
  }
}
