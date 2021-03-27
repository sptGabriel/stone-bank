import { ApplicationError } from './app.error'

export class InvalidPasswordError extends ApplicationError {
  constructor(pwd: string, public readonly statusCode = 400) {
    super(`The password is invalid.`)
    this.name = 'InvalidPasswordError'
  }
  serialize() {
    const { message, name, statusCode } = this
    return { message, name, statusCode }
  }
}
