import { BadRequestError } from '~/application/errors/bad-request.error'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { UnauthorizedError } from '~/application/errors/unathorized.error'
import { IController } from '~/application/ports/controller'
import { WithdrawUseCase } from '~/application/usecases/account/withdraw.use-case'
import { AccountStruct } from '~/domain/account.struct'
import { SucessResponse } from '~/presentation/responses/sucess-response'
import { WithdrawController } from './withdraw.controller'

interface SutType {
  sut: IController
  withdraw: WithdrawUseCase
  presenter: SucessResponse<{
    message: string
    accounts: Omit<AccountStruct, 'password'>
  }>
}

jest.mock('~/application/usecases/account/transfer.use-case')
jest.mock('~/presentation/responses/sucess-response')

const WithDrawMock = WithdrawUseCase as jest.Mock<WithdrawUseCase>
const PresenterMock = SucessResponse as jest.Mock<
  SucessResponse<{
    message: string
    accounts: Omit<AccountStruct, 'password'>
  }>
>

const sutFactory = (): SutType => {
  const withdraw = new WithDrawMock() as jest.Mocked<WithdrawUseCase>
  const presenterMock = new PresenterMock() as jest.Mocked<
    SucessResponse<{
      message: string
      accounts: Omit<AccountStruct, 'password'>
    }>
  >
  const sut = new WithdrawController(withdraw, presenterMock)
  return { sut, withdraw, presenter: presenterMock }
}

describe('Transfer controller', () => {
  it('should throw if dto is invalid', async () => {
    const { sut } = sutFactory()
    const responseHasError = await sut.execute({} as any).catch((err) => err)
    expect(responseHasError).toBeInstanceOf(InvalidRequestError)
  })
  it('should not call useCase when has error', async () => {
    const { sut, withdraw } = sutFactory()
    jest.spyOn(withdraw, 'execute').mockRejectedValueOnce(new Error(`err`))
    const invalid = await sut
      .execute({ body: { amount: 100 }, accountId: 'stone' })
      .catch((err) => err)
    expect(invalid.name).toBe('Error')
    expect(invalid.message).toBe('err')
  })
})
