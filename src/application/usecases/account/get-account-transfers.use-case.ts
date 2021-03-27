import { IQueryBus } from 'kill-event-sourcing'
import { GetAccountTransfersQuery } from '~/domain/queries/get-account-transfer.query'
import { IGetAccountTransfersUseCase } from '~/domain/usecases/get-account-transfers.use-case'

export class GetAccountTransfersUseCase implements IGetAccountTransfersUseCase {
  constructor(private queryBus: IQueryBus) {}

  public async execute(
    id: string,
    pagination: { limit: number; page: number },
  ) {
    return await this.queryBus.execute(
      new GetAccountTransfersQuery(id, pagination),
    )
  }
}
