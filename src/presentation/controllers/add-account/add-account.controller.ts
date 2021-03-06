import { Request } from 'express'
import {
  IAddAccountDTO,
  AddAccountSchema,
} from '~/application/dtos/add-account.dto'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { IController } from '~/application/ports/controller'
import { RequestModel } from '~/application/ports/request-model'
import { IResponseHandler } from '~/application/ports/response-handler'
import { hasKeys } from '~/common/helpers/hasKey'
import { isEmptyOrUndefined } from '~/common/helpers/isEmptyObj'
import { validateDTO } from '~/common/helpers/validateSchema.helper'
import { AccountStruct } from '~/domain/account.struct'
import { IAddAccountUseCase } from '~/domain/usecases/add-account.use-case'

export class AddAccountController implements IController {
  constructor(
    private readonly addAccountUseCase: IAddAccountUseCase,
    private readonly presenter: IResponseHandler<
      Omit<AccountStruct, 'password'>
    >,
  ) {}
  public async execute(req: RequestModel<IAddAccountDTO>) {
    if (isEmptyOrUndefined(req)) throw new InvalidRequestError()
    const dto = req.body as IAddAccountDTO
    const valideOrError = validateDTO(dto, AddAccountSchema)
    if (valideOrError) throw valideOrError
    const account = await this.addAccountUseCase.execute(dto)
    return this.presenter.response(account)
  }
}
