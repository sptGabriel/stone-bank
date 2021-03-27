import { TransferCommandHandler } from '~/application/commands/transfer/transfer.command-handler'
import { TransferUseCase } from '~/application/usecases/account/transfer.use-case'
import { TransferCommand } from '~/domain/commands/transfer.command'
import { TransferStruct } from '~/domain/transfer.struct'
import commandBus from '~/infrastructure/cqrs/command-bus'
import { Connection } from '~/infrastructure/database/connection'
import { AccountRepository } from '~/infrastructure/persistence/account.impl-repository'
import { TransferController } from '~/presentation/controllers/transfer/transfer.controller'
import { SucessResponse } from '~/presentation/responses/sucess-response'

export const makeTransferControllerFactory = () => {
  const repository = new AccountRepository(Connection.client)
  const commandHandler = new TransferCommandHandler(repository)
  commandBus.register([
    {
      command: TransferCommand,
      commandHandler,
    },
  ])
  const useCase = new TransferUseCase(commandBus)
  const presenter = new SucessResponse<TransferStruct>() as any
  return new TransferController(useCase, presenter)
}
