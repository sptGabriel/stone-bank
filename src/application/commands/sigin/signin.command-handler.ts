import { sign } from 'jsonwebtoken'
import { ICommandHandler } from 'kill-event-sourcing'
import { SigninCommand } from '~/domain/commands/sigin.command'
import { IAccountRepository } from '~/domain/repositories/account.repository'
import { Account } from '~/domain/account'
import { IEncrypter } from '~/application/ports/encrypter'
import { NotFoundError } from '~/application/errors/not-found.error'

export class SigninCommandHandler implements ICommandHandler<SigninCommand> {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly encrypter: IEncrypter,
  ) {}

  private async getAccount(email: string): Promise<Account> {
    const account = await this.accountRepository.findbyEmail(email)
    if (!account) throw new NotFoundError(`This account not exist`)
    return account
  }

  async execute(command: SigninCommand): Promise<{ token: string }> {
    const { email, password } = command.account
    const account = await this.getAccount(email)
    await account.password.comparePassword(password)
    const token = await this.encrypter.encrypt(account.id)
    return { token }
  }
}
