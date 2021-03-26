import { InvalidRequestError } from '~/application/errors/invalid-request'
import { UnauthorizedError } from '~/application/errors/unathorized.error'
import { IMiddleware } from '~/application/ports/middleware'
import { IResponseHandler } from '~/application/ports/response-handler'
import { IGetAccountByTokenUseCase } from '~/domain/usecases/account-by-token.use-case'

export class AuthMiddleware implements IMiddleware {
  constructor(
    private readonly getIDByToken: IGetAccountByTokenUseCase,
    private readonly presenter: IResponseHandler<{ accountId: string }>,
  ) {}
  public async execute(request: any) {
    if (!request) throw new InvalidRequestError()
    if (!request.accessToken) throw new UnauthorizedError()
    const account = await this.getIDByToken.execute(request.accessToken)
    return this.presenter.response({ accountId: account.id })
  }
}
