import { ApplicationError } from "./app.error"

export class InvalidEmailError extends ApplicationError {
  constructor (email: string, public readonly statusCode = 400) {
    super(`The email: ${email} is invalid.`)
    this.name = 'InvalidEmailError'
  }

  serialize() {
    const {message, name, statusCode} = this
    return {message, name, statusCode}
  }
}