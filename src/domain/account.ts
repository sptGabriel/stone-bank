import { Either, left, right } from '~/common/helpers/either'
import { AggregateRoot } from 'kill-event-sourcing'
import { AccountStruct } from './account.struct'
import { v4 as uuidV4 } from 'uuid'
import { Email } from './email'
import { Name } from './name'
import { Password } from './password'

export class Account extends AggregateRoot {
  public readonly id: string
  public name: Name
  public email: Email
  public password: Password
  public balance: number

  constructor(
    email: Email,
    name: Name,
    balance: number,
    password: Password,
    id?: string,
  ) {
    super()
    this.id = id || uuidV4()
    this.name = name
    this.email = email
    this.password = password
    this.balance = balance
    Object.freeze(this)
  }

  public deposit(value: number) {
    if (!value || value <= 0) throw new Error(`invalid value`)
    this.balance += value
  }

  public withdraw(value: number) {
    if (!value || value <= 0) throw new Error(`invalid value`)
    if (this.balance === 0) throw new Error(`this account dont have value`)
    return (this.balance -= value)
  }

  public static create({
    email,
    balance,
    name,
    password,
    id,
  }: AccountStruct): Either<Error, Account> {
    const domainEmail = Email.create(email)
    const domainName = Name.create(name)
    const domainPwd = Password.create(password)
    if (domainEmail.isLeft()) return left(domainEmail.value)
    if (domainName.isLeft()) return left(domainName.value)
    if (domainPwd.isLeft()) return left(domainPwd.value)
    return right(
      new Account(
        domainEmail.value,
        domainName.value,
        balance,
        domainPwd.value,
        id,
      ),
    )
  }

  public toJSON(): Omit<AccountStruct, 'password'> {
    return {
      id: this.id,
      name: this.name.value,
      email: this.email.value,
      balance: this.balance,
    }
  }
}
