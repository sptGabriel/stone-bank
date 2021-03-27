import { ITransferDTO, TransferSchema } from '~/application/dtos/transfer.dto'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { UnauthorizedError } from '~/application/errors/unathorized.error'
import { IController } from '~/application/ports/controller'
import { RequestModel } from '~/application/ports/request-model'
import { IResponseHandler } from '~/application/ports/response-handler'
import { isEmptyOrUndefined } from '~/common/helpers/isEmptyObj'
import { toNumber } from '~/common/helpers/toNumber'
import { TransferStruct } from '~/domain/transfer.struct'
import { ITransferUseCase } from '~/domain/usecases/transfer.use-case'
import { validateDTO } from '~/utils/validateSchema'

export class TransferController implements IController {
  constructor(
    private readonly transferUseCase: ITransferUseCase,
    private readonly presenter: IResponseHandler<TransferStruct>,
  ) {}

  async execute(req: RequestModel<ITransferDTO>): Promise<any> {
    if (isEmptyOrUndefined(req)) throw new InvalidRequestError()
    const {
      amount,
      target_email,
      id = req.accountId,
    } = req.body as ITransferDTO
    if (!id) throw new UnauthorizedError()
    const valideOrError = validateDTO(req.body, TransferSchema)
    if (valideOrError) throw valideOrError
    const fixAmount = typeof amount === 'number' ? amount : toNumber(amount)
    const transfer = await this.transferUseCase.execute({
      target_email,
      amount: fixAmount,
      id,
    })
    return this.presenter.response(transfer)
  }
}
