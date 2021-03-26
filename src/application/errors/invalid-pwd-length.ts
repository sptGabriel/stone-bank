import { ApplicationError } from "./app.error"


export class InvalidPasswordLengthError extends ApplicationError {
  constructor(pwd: string, public readonly statusCode = 400) {
    super(
      `The length of The password ${pwd}, provide a password with a length greater than or equal to 8 characters.`,
    )
    this.name = 'InvalidPasswordLengthError'
  }
  serialize() {
    const { message, name, statusCode } = this
    return { message, name, statusCode }
  }
}
