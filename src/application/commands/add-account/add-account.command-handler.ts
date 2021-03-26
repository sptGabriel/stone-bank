import { ICommandHandler } from 'kill-event-sourcing'
import { AccountAlreadyExistsError } from '~/application/errors/account-exists.error'
import { Account } from '~/domain/account'
import { AccountStruct } from '~/domain/account.struct'
import { AddAccountCommand } from '~/domain/commands/add-account.command'
import { IAccountRepository } from '~/domain/repositories/account.repository'

export class AddAccountCommandHandler
  implements ICommandHandler<AddAccountCommand> {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(
    command: AddAccountCommand,
  ): Promise<Omit<AccountStruct, 'password'>> {
    const dto = command.account
    const hasAccount = await this.accountRepository.findbyEmail(dto.email)
    if (hasAccount) throw new AccountAlreadyExistsError()
    const account = await Account.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      balance: 1000,
    })
    if (account.isLeft()) throw account.value
    await this.accountRepository.save(account.value)
    return account.value.toJSON()
  }
}
