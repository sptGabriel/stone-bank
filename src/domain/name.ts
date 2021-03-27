import { InvalidNameError } from '~/application/errors/invalid-name.error'
import { Either, left, right } from '~/common/helpers/either'

export class Name {
  private readonly name: string

  private constructor(name: string) {
    this.name = name
    Object.freeze(this)
  }

  static create(name: string): Either<InvalidNameError, Name> {
    if (!Name.validate(name)) return left(new InvalidNameError(name))
    return right(new Name(name))
  }

  get value(): string {
    return this.name
  }

  static validate(value: string): boolean {
    const name = value.trim()
    if (!name || name.length < 6 || name.trim().length > 255) return false
    return true
  }
}
