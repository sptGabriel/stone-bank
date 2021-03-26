import {
  IAddAccountDTO,
  AddAccountSchema,
} from '~/application/dtos/add-account.dto'
import { IController } from '~/application/ports/controller'
import { IRequestModel } from '~/application/ports/request-model'
import { IResponseHandler } from '~/application/ports/response-handler'
import { validateDTO } from '~/common/helpers/validateSchema.helper'
import { IAddAccountUseCase } from '~/domain/usecases/add-account.use-case'

export class AddAccountController implements IController {
  constructor(
    private readonly addAccountUseCase: IAddAccountUseCase,
    private readonly presenter: IResponseHandler<Account>,
  ) {}
  public async execute(
    request: IRequestModel<IAddAccountDTO>,
  ) {
    const dto = request.body as IAddAccountDTO
    const valideOrError = validateDTO(dto, AddAccountSchema)
    if (valideOrError) throw valideOrError
    const account = await this.addAccountUseCase.execute(dto)
    return this.presenter.response(account)
  }
}
