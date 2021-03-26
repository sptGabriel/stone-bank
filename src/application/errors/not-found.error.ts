import { ApplicationError } from './app.error'

export class NotFoundError extends ApplicationError {
  constructor(
    message: string,
    public readonly statusCode = 404,
    public readonly name: string = 'NotFoundError',
  ) {
    super(message || 'Not found')
  }
  serialize() {
    const { message, name, statusCode } = this
    return { message, name, statusCode }
  }
}
