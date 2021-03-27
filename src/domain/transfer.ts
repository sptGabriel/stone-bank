import { Either, left, right } from '~/common/helpers/either'
import { AggregateRoot } from 'kill-event-sourcing'
import { v4 as uuidV4 } from 'uuid'
import { Account } from './account'
import { TransferStruct } from './transfer.struct'
import { InvalidAccountTypeError } from '~/application/errors/account-type.error'

export class Transfer extends AggregateRoot {
  public readonly id: string
  public owner: Account
  public target: Account
  public amount: number
  public created_at: Date
  constructor(
    owner: Account,
    target: Account,
    amount: number,
    created_at: Date,
    id?: string,
  ) {
    super()
    this.id = id || uuidV4()
    this.owner = owner
    this.target = target
    this.amount = amount
    this.created_at = created_at
    Object.freeze(this)
  }

  public static create({
    target,
    owner,
    amount,
    id,
    created_at,
  }: {
    owner: Account
    target: Account
    amount: number
    created_at?: Date
    id?: string
  }): Either<Error, Transfer> {
    if (!(owner instanceof Account)) return left(new InvalidAccountTypeError())
    if (!(target instanceof Account)) return left(new InvalidAccountTypeError())
    const date = created_at || new Date()
    return right(new Transfer(owner, target, amount, date, id))
  }

  public toJSON(): TransferStruct {
    return {
      id: this.id,
      origin_email: this.owner.email.value,
      target_email: this.target.email.value,
      amount: this.amount,
      created_at: this.created_at,
    }
  }
}
