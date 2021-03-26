import { IWithdrawDTO, WithdrawSchema } from '~/application/dtos/withdraw.dto'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { UnauthorizedError } from '~/application/errors/unathorized.error'
import { IController } from '~/application/ports/controller'
import { IResponseHandler } from '~/application/ports/response-handler'
import { AccountStruct } from '~/domain/account.struct'
import { validateDTO } from '~/utils/validateSchema'

export class WithdrawController implements IController {
  constructor(
    private readonly withdrawUseCase: any,
    private readonly presenter: IResponseHandler<{
      message: string,
      accounts: Omit<AccountStruct, 'password'>
    }>,
  ) {}
  
  async execute(request: IWithdrawDTO & { accountId: string}): Promise<any> {
    if (!request || !request.amount) throw new InvalidRequestError()
    const {amount} = request
    const id = request.accountId
    if (!id) throw new UnauthorizedError()
    const valideOrError = validateDTO({amount}, WithdrawSchema)
    if (valideOrError) throw valideOrError
    const withdrawUseCase = await this.withdrawUseCase.execute({
      amount,
      id,
    })
    return this.presenter.response(withdrawUseCase)
  }
}
