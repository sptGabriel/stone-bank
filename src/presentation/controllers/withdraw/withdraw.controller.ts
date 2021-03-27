import { Request } from 'express'
import { IWithdrawDTO, WithdrawSchema } from '~/application/dtos/withdraw.dto'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { UnauthorizedError } from '~/application/errors/unathorized.error'
import { IController } from '~/application/ports/controller'
import { RequestModel } from '~/application/ports/request-model'
import { IResponseHandler } from '~/application/ports/response-handler'
import { isEmptyOrUndefined } from '~/common/helpers/isEmptyObj'
import { toNumber } from '~/common/helpers/toNumber'
import { AccountStruct } from '~/domain/account.struct'
import { validateDTO } from '~/utils/validateSchema'

export class WithdrawController implements IController {
  constructor(
    private readonly withdrawUseCase: any,
    private readonly presenter: IResponseHandler<{
      message: string
      accounts: Omit<AccountStruct, 'password'>
    }>,
  ) {}

  async execute(req: RequestModel<IWithdrawDTO>): Promise<any> {
    if (isEmptyOrUndefined(req)) throw new InvalidRequestError()
    const { amount } = req.body as IWithdrawDTO
    const valideOrError = validateDTO(req.body, WithdrawSchema)
    if (valideOrError) throw valideOrError
    if (!req.accountId) throw new UnauthorizedError()
    const fixAmount = typeof amount === 'number' ? amount : toNumber(amount)
    const withdrawUseCase = await this.withdrawUseCase.execute({
      amount: fixAmount,
      id: req.accountId,
    })
    return this.presenter.response(withdrawUseCase)
  }
}
