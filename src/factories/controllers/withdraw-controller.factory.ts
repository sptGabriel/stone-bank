import { WithdrawCommandHandler } from '~/application/commands/withdraw/withdraw.command-handler'
import { WithdrawUseCase } from '~/application/usecases/account/withdraw.use-case'
import { AccountStruct } from '~/domain/account.struct'
import { WithdrawCommand } from '~/domain/commands/withdraw.command'
import commandBus from '~/infrastructure/cqrs/command-bus'
import { Connection } from '~/infrastructure/database/connection'
import { AccountRepository } from '~/infrastructure/persistence/account.impl-repository'
import { WithdrawController } from '~/presentation/controllers/withdraw/withdraw.controller'
import { SucessResponse } from '~/presentation/responses/sucess-response'

export const makeWithdrawControllerFactory = () => {
  const repository = new AccountRepository(Connection.client)
  const commandHandler = new WithdrawCommandHandler(repository)
  commandBus.register([
    {
      command: WithdrawCommand,
      commandHandler,
    },
  ])
  const useCase = new WithdrawUseCase(commandBus)
  const presenter = new SucessResponse<{
    message: string
    account: Omit<AccountStruct, 'password'>
  }>() as any
  return new WithdrawController(useCase, presenter)
}
