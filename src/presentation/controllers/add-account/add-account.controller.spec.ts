import { v4 } from 'uuid'
import { ApplicationError } from '~/application/errors/app.error'
import { BadRequestError } from '~/application/errors/bad-request.error'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { AddAccountUseCase } from '~/application/usecases/account/add-account.use-case'
import { Account } from '~/domain/account'
import { AccountStruct } from '~/domain/account.struct'
import { CreatedResponse } from '~/presentation/responses/created-response'
import { AddAccountController } from './add-account.controller'

interface SutType {
  sut: AddAccountController
  addAccount: AddAccountUseCase
  presenter: CreatedResponse<Omit<AccountStruct, 'password'>>
}

jest.mock('~/application/usecases/account/add-account.use-case')
jest.mock('~/presentation/responses/created-response')

const AddAccountMock = AddAccountUseCase as jest.Mock<AddAccountUseCase>
const PresenterMock = CreatedResponse as jest.Mock<
  CreatedResponse<Omit<AccountStruct, 'password'>>
>

const sutFactory = (): SutType => {
  const addAccount = new AddAccountMock() as jest.Mocked<AddAccountUseCase>
  const presenterMock = new PresenterMock() as jest.Mocked<
    CreatedResponse<Omit<AccountStruct, 'password'>>
  >
  const sut = new AddAccountController(addAccount, presenterMock)
  return { sut, addAccount, presenter: presenterMock }
}

const id = v4()
const mockedAccount = (): Account => {
  return Account.create({
    balance: 1000,
    password: '123456789',
    email: 'stone@stone.com.br',
    name: 'stonestone',
    id,
  }).value as any
}

describe('add account controller', () => {
  it('should throw if dto is invalid', async () => {
    const { sut } = sutFactory()
    const responseHasError = await sut.execute({} as any).catch((err) => err)
    expect(responseHasError).toBeInstanceOf(InvalidRequestError)
  })
  it('should return a BadRequestError when has invalid dto', async () => {
    const { sut } = sutFactory()
    const hasDtoInvalid = await sut
      .execute({
        body: {
          email: 'adasdas',
          password: '1234567',
          name: 'error',
        },
      })
      .catch((err) => err)
    expect(hasDtoInvalid).toBeInstanceOf(BadRequestError)
  })
  it('should not call useCase when has error', async () => {
    const { sut, addAccount } = sutFactory()
    const invalid = await sut.execute(undefined as any).catch((err) => err)
    expect(addAccount.execute).toHaveBeenCalledTimes(0)
    expect(invalid).toBeInstanceOf(InvalidRequestError)
  })
  it('should return a valid account reponse', async () => {
    const { sut, presenter } = sutFactory()
    const id = v4()
    const expected = {
      statusCode: 201,
      body: {
        id,
        email: 'stone@stone.com.br',
        name: 'stonestone',
        balance: 1000,
      },
    }
    jest.spyOn(presenter, 'response').mockResolvedValueOnce(expected)
    const response = await sut.execute({
      body: {
        email: 'stone@stone.com.br',
        name: 'stonestone',
        password: '123456789',
      },
    })
    expect(response).toStrictEqual(expected)
  })
})
