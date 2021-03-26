import { AddAccountCommandHandler } from '~/application/commands/add-account/add-account.command-handler'
import { AddAccountUseCase } from '~/application/usecases/account/add-account.use-case'
import { AccountStruct } from '~/domain/account.struct'
import { AddAccountCommand } from '~/domain/commands/add-account.command'
import commandBus from '~/infrastructure/cqrs/command-bus'
import { Connection } from '~/infrastructure/database/connection'
import { AccountRepository } from '~/infrastructure/persistence/account.impl-repository'
import { AddAccountController } from '~/presentation/controllers/add-account/add-account.controller'
import { CreatedResponse } from '~/presentation/responses/created-response'

export const makeAddControllerFactory = () => {
  const repository = new AccountRepository(Connection.client)
  const commandHandler = new AddAccountCommandHandler(repository)
  commandBus.register([
    {
      command: AddAccountCommand,
      commandHandler,
    },
  ])
  const useCase = new AddAccountUseCase(commandBus)
  const createdAccountPresenter = new CreatedResponse<
    Omit<AccountStruct, 'password'>
  >()
  return new AddAccountController(useCase, createdAccountPresenter)
}
