import { decode, JsonWebTokenError } from 'jsonwebtoken'
import { ICommandHandler } from 'kill-event-sourcing'
import { AccountAlreadyExistsError } from '~/application/errors/account-exists.error'
import { UnauthorizedError } from '~/application/errors/unathorized.error'
import { IDecrypter } from '~/application/ports/decrypter'
import { Account } from '~/domain/account'
import { GetAccountByTokenQuery } from '~/domain/queries/get-account-byToken.query'
import { IAccountRepository } from '~/domain/repositories/account.repository'

export class GetAccountByTokenQueryHandler
  implements ICommandHandler<GetAccountByTokenQuery> {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly decrypt: IDecrypter,
  ) {}

  private async getAccount(id: string) {
    const account = await this.accountRepository.findbyId(id)
    if (!account) throw new UnauthorizedError('Not allowed')
    if (account.id !== id) throw new UnauthorizedError('Not allowed')
    return account
  }

  async execute(query: GetAccountByTokenQuery): Promise<Account> {
    try {
      const { token } = query
      const decoded: any = await this.decrypt.decrypt(token)
      return await this.getAccount(decoded.id)
    } catch (error) {
      if (error instanceof JsonWebTokenError) throw new UnauthorizedError()
      throw error
    }
  }
}
