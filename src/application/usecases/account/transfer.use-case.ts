import { ICommandBus } from 'kill-event-sourcing'
import { ITransferDTO } from '~/application/dtos/transfer.dto'
import { TransferCommand } from '~/domain/commands/transfer.command'
import { ITransferUseCase } from '~/domain/usecases/transfer.use-case'

export class TransferUseCase implements ITransferUseCase {
  constructor(private commandBus: ICommandBus) {}

  public async execute(dto: ITransferDTO) {
    return await this.commandBus.execute(new TransferCommand(dto))
  }
}
