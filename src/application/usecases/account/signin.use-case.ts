import { ICommandBus } from 'kill-event-sourcing'
import { ISigninDTO } from '~/application/dtos/sign-in.dto'
import { SigninCommand } from '~/domain/commands/sigin.command'
import { IAddAccountUseCase } from '~/domain/usecases/add-account.use-case'

export class SiginUseCase implements IAddAccountUseCase {
  constructor(private commandBus: ICommandBus) {}

  public async execute(dto: ISigninDTO) {
    return await this.commandBus.execute(new SigninCommand(dto))
  }
}
