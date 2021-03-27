import { ITransferDTO, TransferSchema } from '~/application/dtos/transfer.dto'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { UnauthorizedError } from '~/application/errors/unathorized.error'
import { IController } from '~/application/ports/controller'
import { RequestModel } from '~/application/ports/request-model'
import { IResponseHandler } from '~/application/ports/response-handler'
import { isEmptyOrUndefined } from '~/common/helpers/isEmptyObj'
import { TransferStruct } from '~/domain/transfer.struct'
import { IGetAccountTransfersUseCase } from '~/domain/usecases/get-account-transfers.use-case'
export class GetAccountsTransferController implements IController {
  constructor(
    private readonly getAccountTransfers: IGetAccountTransfersUseCase,
    private readonly presenter: IResponseHandler<TransferStruct[]>,
  ) {}

  async execute(
    req: RequestModel & {
      query: { page: any; limit: any }
    },
  ): Promise<any> {
    if (isEmptyOrUndefined(req)) throw new InvalidRequestError()
    const page = req.query.page || 1
    const limit = req.query.limit || 15
    const id = req.accountId
    if (!id) throw new UnauthorizedError()
    const transfers = await this.getAccountTransfers.execute(id, {
      limit,
      page,
    })
    return this.presenter.response(transfers)
  }
}
