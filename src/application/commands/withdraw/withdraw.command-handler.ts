import { ICommandHandler } from 'kill-event-sourcing'
import { NotFoundError } from '~/application/errors/not-found.error'
import { WithdrawCommand } from '~/domain/commands/withdraw.command'
import { IAccountRepository } from '~/domain/repositories/account.repository'
import { Account } from '~/domain/account'
import { InvalidRequestError } from '~/application/errors/invalid-request'

export class WithdrawCommandHandler
  implements ICommandHandler<WithdrawCommand> {
  constructor(private readonly accountRepository: IAccountRepository) {}

  private async getAccount(id: string): Promise<Account> {
    const account = await this.accountRepository.findbyId(id)
    if (!account) throw new NotFoundError(`This account not exist`)
    return account
  }

  private async withdrawMoney(account: Account, amount: number) {
    const { balance, id } = account
    if (balance < amount) {
      throw new InvalidRequestError('This account does not have this value')
    }
    const updatedAccount = await this.accountRepository.withdraw(id, amount)
    return updatedAccount
  }

  async execute(command: WithdrawCommand) {
    const { amount, id } = command.withdraw
    const account = await this.getAccount(id)
    const updatedAccount = await this.withdrawMoney(account, amount)
    return {
      message: 'Money withdrawn successfully',
      account: updatedAccount.toJSON(),
    }
  }
}
