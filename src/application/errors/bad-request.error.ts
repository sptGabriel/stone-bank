import { ApplicationError } from "./app.error"

export class BadRequestError extends ApplicationError {
  constructor(public readonly errors: any, public readonly statusCode = 400) {
    super('BadRequest')
  }
  serialize() {
    return {
      message:
        this.errors.length > 1
          ? `Multiple errors occurred during the input validation.`
          : `Error occurred during the input validation.`,
      statusCode: this.statusCode,
      errors: this.errors,
    }
  }