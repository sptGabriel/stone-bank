import { IQueryHandler } from 'kill-event-sourcing'
import { GetAccountTransfersQuery } from '~/domain/queries/get-account-transfer.query'
import { IAccountRepository } from '~/domain/repositories/account.repository'
import { TransferStruct } from '~/domain/transfer.struct'

export class GetAccountTransfersQueryHandler
  implements IQueryHandler<GetAccountTransfersQuery> {
  constructor(private readonly accountRepository: IAccountRepository) {}

  private sortTransfer(transfers: TransferStruct[]) {
    return transfers.sort((a, b) => {
      if (a.origin_email < b.id) return -1
      return 1
    })
  }

  async execute(query: GetAccountTransfersQuery): Promise<TransferStruct[]> {
    const { id, pagination } = query
    const transfers = await this.accountRepository.findAccountTransfers(id, {
      ...pagination,
    })
    return this.sortTransfer(transfers)
  }
}
