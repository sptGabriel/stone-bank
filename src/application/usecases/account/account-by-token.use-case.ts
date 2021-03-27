import { IQueryBus } from 'kill-event-sourcing'
import { GetAccountByTokenQuery } from '~/domain/queries/get-account-byToken.query'
import { IGetAccountByTokenUseCase } from '~/domain/usecases/account-by-token.use-case'

export class GetAccountByTokenUseCase implements IGetAccountByTokenUseCase {
  constructor(private queryBus: IQueryBus) {}

  public async execute(token: string) {
    return await this.queryBus.execute(new GetAccountByTokenQuery(token))
  }
}
