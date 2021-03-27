import { IController } from '~/application/ports/controller'
import { GetAccountTransfersQueryHandler } from '~/application/queries/get-account-transfers/get-account-transfers.handler'
import { GetAccountTransfersUseCase } from '~/application/usecases/account/get-account-transfers.use-case'
import { GetAccountTransfersQuery } from '~/domain/queries/get-account-transfer.query'
import { TransferStruct } from '~/domain/transfer.struct'
import queryBus from '~/infrastructure/cqrs/query-bus'
import { Connection } from '~/infrastructure/database/connection'
import { AccountRepository } from '~/infrastructure/persistence/account.impl-repository'
import { GetAccountsTransferController } from '~/presentation/controllers/transfer/get-account-transfers.controller'
import { SucessResponse } from '~/presentation/responses/sucess-response'

export const makeGetAccountTransferController = (): IController => {
  const repository = new AccountRepository(Connection.client)
  const queryHandler = new GetAccountTransfersQueryHandler(repository)
  queryBus.register([
    {
      query: GetAccountTransfersQuery,
      queryHandler,
    },
  ])
  const useCase = new GetAccountTransfersUseCase(queryBus)
  const presenter = new SucessResponse<TransferStruct[]>()
  return new GetAccountsTransferController(useCase, presenter)
}
