import {
  IAddAccountDTO,
  AddAccountSchema,
} from '~/application/dtos/add-account.dto'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { IController } from '~/application/ports/controller'
import { IRequestModel } from '~/application/ports/request-model'
import { IResponseHandler } from '~/application/ports/response-handler'
import { validateDTO } from '~/common/helpers/validateSchema.helper'
import { IAddAccountUseCase } from '~/domain/usecases/add-account.use-case'

export class AddAccountController implements IController {
  constructor(
    private readonly addAccountUseCase: IAddAccountUseCase,
    private readonly presenter: IResponseHandler<Omit<Account, 'password'>>,
  ) {}
  public async execute(
    request: IRequestModel<IAddAccountDTO>,
  ) {
    if(!request || !request.body) throw new InvalidRequestError()
    const dto = request.body as IAddAccountDTO
    const valideOrError = validateDTO(dto, AddAccountSchema)
    if (valideOrError) throw valideOrError
    const account = await this.addAccountUseCase.execute(dto)
    return this.presenter.response(account)
  }
}
