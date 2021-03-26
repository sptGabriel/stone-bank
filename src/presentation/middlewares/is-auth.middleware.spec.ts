import { InvalidRequestError } from '~/application/errors/invalid-request'
import { UnauthorizedError } from '~/application/errors/unathorized.error'
import { GetAccountByTokenUseCase } from '~/application/usecases/account/account-by-token.use-case'
import { IGetAccountByTokenUseCase } from '~/domain/usecases/account-by-token.use-case'
import { SucessResponse } from '../responses/sucess-response'
import { AuthMiddleware } from './is-auth.middleware'

interface SutType {
  sut: AuthMiddleware
  useCase: IGetAccountByTokenUseCase
  presenter: SucessResponse<{ accountId: string }>
}

jest.mock('~/presentation/responses/sucess-response')
jest.mock('~/application/usecases/account/account-by-token.use-case')

const PresenterMock = SucessResponse as jest.Mock<
  SucessResponse<{ accountId: string }>
>
const GetAccountByTokenMock = GetAccountByTokenUseCase as jest.Mock<GetAccountByTokenUseCase>

const sutFactory = (): SutType => {
  const presenter = new PresenterMock() as jest.Mocked<
    SucessResponse<{ accountId: string }>
  >
  const useCase = new GetAccountByTokenMock() as jest.Mocked<GetAccountByTokenUseCase>
  const sut = new AuthMiddleware(useCase, presenter)
  return { sut, presenter, useCase }
}

describe('isAuth Middleware', () => {
  it('should return an error when request is invalid', async () => {
    const { sut } = sutFactory()
    const result = await sut.execute(undefined as any).catch((err) => err)
    expect(result).toBeInstanceOf(InvalidRequestError)
  })
  it('should return a error when doenst has accessToken', async () => {
    const { sut } = sutFactory()
    const result = await sut.execute({ b: 'a' }).catch((err) => err)
    expect(result.name).toBe('UnauthorizedError')
    expect(result.message).toBe('Access denied')
  })
  it('should execute use case and throw error', async () => {
    const { sut, useCase } = sutFactory()
    jest.spyOn(useCase, 'execute').mockImplementationOnce(() => {
      throw new UnauthorizedError()
    })
    const result = await sut.execute({ requestToken: 'a' }).catch((err) => err)
    expect(result.name).toBe('UnauthorizedError')
    expect(result.message).toBe('Access denied')
  })
  it('should pass if jwt is valid', async () => {
    const { sut, useCase, presenter } = sutFactory()
    const expected = {
      statusCode: 200,
      body: {
        accountId: 'stone',
      },
    }
    jest.spyOn(useCase, 'execute').mockResolvedValue({} as any)
    jest.spyOn(presenter, 'response').mockResolvedValueOnce(expected)
    const request = await sut
      .execute({ accessToken: 'stone' })
      .catch((err) => err)
    expect(request).toBe(expected)
  })
})
