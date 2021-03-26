import { ApplicationError } from './app.error'

export class UnauthorizedError extends ApplicationError {
  constructor(
    public message: string,
    public statusCode = 401,
    public readonly name = 'UnauthorizedError',
  ) {
    super(message)
  }

  serialize() {
    const { statusCode, name, message } = this
    return { statusCode, name, message }
  }
}
