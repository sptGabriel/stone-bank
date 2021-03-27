import { ICommandHandler } from 'kill-event-sourcing'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { NotFoundError } from '~/application/errors/not-found.error'
import { TransferCommand } from '~/domain/commands/transfer.command'
import { IAccountRepository } from '~/domain/repositories/account.repository'
import { Account } from '~/domain/account'
import { Transfer } from '~/domain/transfer'

export class TransferCommandHandler
  implements ICommandHandler<TransferCommand> {
  constructor(private readonly accountRepository: IAccountRepository) {}

  private async getAccountById(id: string): Promise<Account> {
    const account = await this.accountRepository.findbyId(id)
    if (!account) throw new NotFoundError(`This account not exist`)
    return account
  }

  private async getAccountByEmail(email: string): Promise<Account> {
    const account = await this.accountRepository.findbyEmail(email)
    if (!account) throw new NotFoundError(`This account not exist`)
    return account
  }

  private async makeTransfer(owner: Account, target: Account, amount: number) {
    if (owner.balance >= amount && target.id !== owner.id) {
      const transfer = Transfer.create({ amount, owner, target })
      if (transfer.isLeft()) throw transfer.value
      await this.accountRepository.transfer(transfer.value)
      return transfer.value
    }
    const insufficientBalance = `This account does not have this value`
    const sameAccount = `Cannot transfer amounts to the same account`
    const err = owner.id === target.id ? sameAccount : insufficientBalance
    throw new InvalidRequestError(err)
  }

  async execute(command: TransferCommand) {
    const { amount, target_email, id } = command.transfer
    const owner = await this.getAccountById(id)
    const target = await this.getAccountByEmail(target_email)
    const transfer = await this.makeTransfer(owner, target, amount)
    return transfer.toJSON()
  }
}
