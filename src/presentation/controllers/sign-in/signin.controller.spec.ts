import { v4 } from 'uuid'
import { ApplicationError } from '~/application/errors/app.error'
import { BadRequestError } from '~/application/errors/bad-request.error'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { SiginUseCase } from '~/application/usecases/account/signin.use-case'
import { SucessResponse } from '~/presentation/responses/sucess-response'
import { SigninController } from './signin.controller'

interface SutType {
  sut: SigninController
  sigin: SiginUseCase
  presenter: SucessResponse<{ token: string }>
}

jest.mock('~/application/usecases/account/signin.use-case')
jest.mock('~/presentation/responses/sucess-response')

const SigninMock = SiginUseCase as jest.Mock<SiginUseCase>
const PresenterMock = SucessResponse as jest.Mock<
  SucessResponse<{ token: string }>
>

const sutFactory = (): SutType => {
  const sigin = new SigninMock() as jest.Mocked<SiginUseCase>
  const presenterMock = new PresenterMock() as jest.Mocked<
    SucessResponse<{ token: string }>
  >
  const sut = new SigninController(sigin, presenterMock)
  return { sut, sigin, presenter: presenterMock }
}

describe('Sigin controller', () => {
  it('should throw if dto is invalid', async () => {
    const { sut } = sutFactory()
    const responseHasError = await sut.execute({}).catch((err) => err)
    const hasDtoInvalid = await sut
      .execute({
        body: {
          email: 'a',
          password: 'b',
        },
      })
      .catch((err) => err)
    expect(responseHasError).toBeInstanceOf(InvalidRequestError)
    expect(hasDtoInvalid).toBeInstanceOf(BadRequestError)
  })
  it('should not call useCase when has error', async () => {
    const { sut, sigin } = sutFactory()
    const executeSpy = jest.spyOn(sigin, 'execute')
    const invalid = await sut
      .execute({})
      .catch((err) => err)
      .catch((err) => err)
    expect(executeSpy).toHaveBeenCalledTimes(0)
    expect(invalid).toBeInstanceOf(ApplicationError)
  })
  it('should return a valid account reponse', async () => {
    const { sut, presenter } = sutFactory()
    const token = 'stone jwt'
    const expected = {
      statusCode: 200,
      body: {
        token,
      },
    }
    jest.spyOn(presenter, 'response').mockResolvedValueOnce(expected)
    const response = await sut.execute({
      body: {
        email: 'stone@stone.com.br',
        password: '123456789',
      },
    })
    expect(response).toStrictEqual(expected)
  })
})
