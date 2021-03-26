import { ISigninDTO, SigninSchema } from '~/application/dtos/sign-in.dto'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { IController } from '~/application/ports/controller'
import { IResponseHandler } from '~/application/ports/response-handler'
import { SiginUseCase } from '~/application/usecases/account/signin.use-case'
import { validateDTO } from '~/common/helpers/validateSchema.helper'

export class SigninController implements IController {
  constructor(
    private readonly signinUseCase: SiginUseCase,
    private readonly presenter: IResponseHandler<{token: string}>,
  ) {}
  public async execute(request: ISigninDTO) {
    if (!request) throw new InvalidRequestError()
    const dto = request as ISigninDTO
    const valideOrError = validateDTO(dto, SigninSchema)
    if (valideOrError) throw valideOrError
    const account = await this.signinUseCase.execute(dto)
    return this.presenter.response(account)
  }
}
