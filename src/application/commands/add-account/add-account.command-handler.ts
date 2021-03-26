import { ICommandHandler } from 'kill-event-sourcing'
import { AccountAlreadyExistsError } from '~/application/errors/account-exists.error'
import { Account } from '~/domain/account'
import { AddAccountCommand } from '~/domain/commands/add-account.command'
import { IAccountRepository } from '~/domain/repositories/account.repository'

export class AddAccountCommandHandler
  implements ICommandHandler<AddAccountCommand> {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(command: AddAccountCommand) {
    const { balance = 1000, name, email, password } = command.account
    const hasAccount = await this.accountRepository.findbyEmail(email)
    if (hasAccount) throw new AccountAlreadyExistsError()
    const account = await Account.create({ email, name, password, balance })
    if (account.isLeft()) throw account.value
    await this.accountRepository.save(account.value)
    return account.value
  }
}
