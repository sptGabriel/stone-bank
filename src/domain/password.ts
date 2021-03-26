import { Either, left, right } from '~/common/helpers/either'
import { compare, hash } from 'bcryptjs'
import { InvalidPasswordLengthError } from '~/application/errors/invalid-pwd-length'
import { InvalidPasswordError } from '~/application/errors/invalid-pwd'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { UnauthorizedError } from '~/application/errors/unathorized.error'

export class Password {
  private readonly pwd: string

  private constructor(pwd: string) {
    this.pwd = pwd
    Object.freeze(this)
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    if (!plainTextPassword) {
      throw new InvalidRequestError(`Provide valid plain text password`)
    }
    const valid = await compare(plainTextPassword, this.pwd)
    if(!valid) throw new UnauthorizedError('Invalid credentials');
    return valid;
  }

  public async encrypt(): Promise<string> {
    return hash(this.pwd, 10)
  }

  static create(
    pwd: string,
  ): Either<InvalidPasswordError | InvalidPasswordLengthError, Password> {
    if (!pwd) return left(new InvalidPasswordError(pwd))
    if (pwd.length < 8) return left(new InvalidPasswordLengthError(pwd))
    return right(new Password(pwd))
  }

  get value(): string {
    return this.pwd
  }
}
