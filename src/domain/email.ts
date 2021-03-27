import { Either, left, right } from '~/common/helpers/either'
import validator from 'validator'
import { InvalidEmailError } from '~/application/errors/invalid-email.error'

export class Email {
  private readonly email: string

  private constructor(email: string) {
    this.email = email
    Object.freeze(this)
  }

  static create(email: string): Either<InvalidEmailError, Email> {
    if (!Email.validate(email)) return left(new InvalidEmailError(email))
    return right(new Email(email))
  }

  get value(): string {
    return this.email
  }

  static validate(email: string): boolean {
    if (!validator.isEmail(email)) return false
    return true
  }
}
