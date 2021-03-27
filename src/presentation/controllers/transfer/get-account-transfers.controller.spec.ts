import { BadRequestError } from '~/application/errors/bad-request.error'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { UnauthorizedError } from '~/application/errors/unathorized.error'
import { IController } from '~/application/ports/controller'
import { GetAccountTransfersUseCase } from '~/application/usecases/account/get-account-transfers.use-case'
import { TransferStruct } from '~/domain/transfer.struct'
import { IGetAccountTransfersUseCase } from '~/domain/usecases/get-account-transfers.use-case'
import { SucessResponse } from '~/presentation/responses/sucess-response'
import { GetAccountsTransferController } from './get-account-transfers.controller'

interface SutType {
  sut: IController
  useCase: GetAccountTransfersUseCase
  presenter: SucessResponse<TransferStruct[]>
}

jest.mock('~/application/usecases/account/get-account-transfers.use-case')
jest.mock('~/presentation/responses/sucess-response')

const GetTransfersMock = GetAccountTransfersUseCase as jest.Mock<GetAccountTransfersUseCase>
const PresenterMock = SucessResponse as jest.Mock<
  SucessResponse<TransferStruct[]>
>

const sutFactory = (): SutType => {
  const useCase = new GetTransfersMock() as jest.Mocked<GetAccountTransfersUseCase>
  const presenterMock = new PresenterMock() as jest.Mocked<
    SucessResponse<TransferStruct[]>
  >
  const sut = new GetAccountsTransferController(useCase, presenterMock)
  return { sut, useCase, presenter: presenterMock }
}

describe('Transfer controller', () => {
  it('should throw if dto is invalid', async () => {
    const { sut } = sutFactory()
    const responseHasError = await sut.execute({} as any).catch((err) => err)
    expect(responseHasError).toBeInstanceOf(InvalidRequestError)
  })
  it('should not call useCase when has error', async () => {
    const { sut, useCase } = sutFactory()
    const invalid = await sut.execute(undefined as any).catch((err) => err)
    expect(useCase.execute).toHaveBeenCalledTimes(0)
    expect(invalid).toBeInstanceOf(InvalidRequestError)
  })
  it('should throw unauthenticated error when not authenticated', async () => {
    const { sut, useCase } = sutFactory()
    const invalid = await sut
      .execute({ query: { page: 10, limit: 10 } })
      .catch((err) => err)
    expect(useCase.execute).toHaveBeenCalledTimes(0)
    expect(invalid).toBeInstanceOf(UnauthorizedError)
  })
  it('should return throw a error on useCase', async () => {
    const { sut, presenter, useCase } = sutFactory()
    jest.spyOn(useCase, 'execute').mockRejectedValueOnce(new Error('failed'))
    const response = await sut
      .execute({ accountId: 'stone', query: { page: 10, limit: 10 } })
      .catch((err) => err)
    expect(useCase.execute).toHaveBeenCalledTimes(1)
    expect(response.name).toBe('Error')
    expect(response.message).toBe('failed')
  })
  it('should passUseCase', async () => {
    const { sut, presenter, useCase } = sutFactory()
    jest.spyOn(useCase, 'execute').mockResolvedValueOnce('sucess')
    const response = await sut
      .execute({ accountId: 'stone', query: { page: 10, limit: 10 } })
      .catch((err) => err)
    expect(useCase.execute).toHaveBeenCalledTimes(1)
    expect(useCase.execute).toHaveBeenCalledWith('stone', {
      page: 10,
      limit: 10,
    })
  })
  it('should call presenter with correct values', async () => {
    const { sut, presenter, useCase } = sutFactory()
    jest
      .spyOn(useCase, 'execute')
      .mockResolvedValueOnce({ id: 'stone', query: { page: 10, limit: 10 } })
    await sut
      .execute({ accountId: 'stone', query: { page: 10, limit: 10 } })
      .catch((err) => err)
    expect(presenter.response).toHaveBeenCalledTimes(1)
    expect(presenter.response).toHaveBeenCalledWith({
      id: 'stone',
      query: { page: 10, limit: 10 },
    })
  })
  it('should call throw error when presenter invoke', async () => {
    const { sut, presenter, useCase } = sutFactory()
    jest.spyOn(useCase, 'execute').mockResolvedValueOnce('sucess')
    jest
      .spyOn(presenter, 'response')
      .mockRejectedValueOnce(new Error(`got error`))
    const response = await sut
      .execute({ accountId: 'stone', query: { page: 10, limit: 10 } })
      .catch((err) => err)
    expect(presenter.response).toHaveBeenCalledTimes(1)
    expect(response.name).toBe('Error')
    expect(response.message).toBe('got error')
  })
})
