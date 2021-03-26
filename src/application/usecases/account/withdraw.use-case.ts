import { ICommandBus } from 'kill-event-sourcing'
import { IWithdrawDTO } from '~/application/dtos/withdraw.dto'
import { WithdrawCommand } from '~/domain/commands/withdraw.command'
import { IWithdrawUseCase } from '~/domain/usecases/withdraw.use-case'

export class WithdrawUseCase implements IWithdrawUseCase {
  constructor(private commandBus: ICommandBus) {}

  public async execute(dto: IWithdrawDTO) {
    return await this.commandBus.execute(new WithdrawCommand(dto))
  }
}
