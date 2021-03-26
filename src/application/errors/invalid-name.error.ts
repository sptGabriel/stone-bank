import { ApplicationError } from "./app.error"

export class InvalidNameError extends ApplicationError {
  constructor (name: string, public readonly statusCode = 400) {
    super(`The name: ${name}, has invalid length.`)
    this.name = 'InvalidNameError'
  }
  serialize() {
    const {message, name, statusCode} = this
    return {message, name, statusCode}
  }
}