import { ICommandBus } from 'kill-event-sourcing'
import { IAddAccountDTO } from '~/application/dtos/add-account.dto'
import { AddAccountCommand } from '~/domain/commands/add-account.command'
import { IAddAccountUseCase } from '~/domain/usecases/add-account.use-case'

export class AddAccountUseCase implements IAddAccountUseCase {
  constructor(private commandBus: ICommandBus) {}

  public async execute(dto: IAddAccountDTO) {
    return await this.commandBus.execute(new AddAccountCommand(dto))
  }
}
