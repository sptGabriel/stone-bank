import { v4 } from 'uuid'
import { ApplicationError } from '~/application/errors/app.error'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { AddAccountUseCase } from '~/application/usecases/account/add-account.use-case'
import { CreatedResponse } from '~/presentation/responses/created-response'
import { AddAccountController } from './add-account.controller'

interface SutType {
  sut: AddAccountController
  addAccount: AddAccountUseCase
  presenter: CreatedResponse<Account>
}

jest.mock('~/application/usecases/account/add-account.use-case')
jest.mock('~/presentation/responses/created-response')

const AddAccountMock = AddAccountUseCase as jest.Mock<AddAccountUseCase>
const PresenterMock = CreatedResponse as jest.Mock<CreatedResponse<Account>>

const sutFactory = (): SutType => {
  const addAccount = new AddAccountMock() as jest.Mocked<AddAccountUseCase>
  const presenterMock = new PresenterMock() as jest.Mocked<
    CreatedResponse<Account>
  >
  const sut = new AddAccountController(addAccount, presenterMock)
  return { sut, addAccount, presenter: presenterMock }
}

describe('Create account controller', () => {
  it('should throw if dto is invalid', async () => {
    const { sut } = sutFactory()
    const responseHasError = await sut.execute({}).catch((err) => err)
    expect(responseHasError).toBeInstanceOf(ApplicationError)
  })
  it('should return a ApplicationError when has invalid dto', async () => {
    const { sut } = sutFactory()
    const nohasDTO = await sut.execute({}).catch((err) => err)
		const hasDtoInvalid = await sut
		.execute({
			body: {
				email: 'adasdas',
				password: '1234567',
				name: 'error',
			},
		})
		.catch((err) => err)
    expect(nohasDTO).toBeInstanceOf(InvalidRequestError)
    expect(hasDtoInvalid).toBeInstanceOf(ApplicationError)
  })
  it('should not call useCase when has error', async () => {
    const { sut, addAccount } = sutFactory()
    const executed = jest.spyOn(addAccount, 'execute')
    const invalid = await sut.execute({}).catch((err) => err)
		.catch((err) => err)
    expect(executed).toHaveBeenCalledTimes(0)
    expect(invalid).toBeInstanceOf(ApplicationError)
  })
})
