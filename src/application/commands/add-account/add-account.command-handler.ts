import { ICommandHandler } from 'kill-event-sourcing'
import { AccountAlreadyExistsError } from '~/application/errors/account-exists.error'
import { Account } from '~/domain/account'
import { AccountStruct } from '~/domain/account.struct'
import { AddAccountCommand } from '~/domain/commands/add-account.command'
import { IAccountRepository } from '~/domain/repositories/account.repository'

export class AddAccountCommandHandler
  implements ICommandHandler<AddAccountCommand> {
  constructor(private readonly accountRepository: IAccountRepository) {}

  private async createAccount(data: Omit<AccountStruct, 'id'>) {
    const account = await Account.create({
      email: data.email,
      name: data.name,
      password: data.password,
      balance: 1000,
    })
    if (account.isLeft()) throw account.value
    await this.accountRepository.save(account.value)
    return account.value.toJSON()
  }

  private async findByEmail(email: string) {
    const hasAccount = await this.accountRepository.findbyEmail(email)
    if (hasAccount) throw new AccountAlreadyExistsError()
  }

  async execute(
    command: AddAccountCommand,
  ): Promise<Omit<AccountStruct, 'password'>> {
    const dto = command.account
    await this.findByEmail(dto.email)
    return await this.createAccount({ ...dto, balance: 1000 })
  }
}
