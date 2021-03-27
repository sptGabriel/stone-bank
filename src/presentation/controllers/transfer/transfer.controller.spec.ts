import { BadRequestError } from '~/application/errors/bad-request.error'
import { InvalidRequestError } from '~/application/errors/invalid-request'
import { IController } from '~/application/ports/controller'
import { TransferUseCase } from '~/application/usecases/account/transfer.use-case'
import { TransferStruct } from '~/domain/transfer.struct'
import { ITransferUseCase } from '~/domain/usecases/transfer.use-case'
import { SucessResponse } from '~/presentation/responses/sucess-response'
import { TransferController } from './transfer.controller'

interface SutType {
  sut: IController
  transfer: ITransferUseCase
  presenter: SucessResponse<TransferStruct>
}

jest.mock('~/application/usecases/account/transfer.use-case')
jest.mock('~/presentation/responses/sucess-response')

const TransferMock = TransferUseCase as jest.Mock<TransferUseCase>
const PresenterMock = SucessResponse as jest.Mock<
  SucessResponse<TransferStruct>
>

const sutFactory = (): SutType => {
  const transfer = new TransferMock() as jest.Mocked<TransferUseCase>
  const presenterMock = new PresenterMock() as jest.Mocked<
    SucessResponse<TransferStruct>
  >
  const sut = new TransferController(transfer, presenterMock)
  return { sut, transfer, presenter: presenterMock }
}

describe('Transfer controller', () => {
  it('should throw if dto is invalid', async () => {
    const { sut } = sutFactory()
    const responseHasError = await sut.execute({} as any).catch((err) => err)
    expect(responseHasError).toBeInstanceOf(InvalidRequestError)
  })
  it('should not call useCase when has error', async () => {
    const { sut, transfer } = sutFactory()
    const invalid = await sut.execute(undefined as any).catch((err) => err)
    expect(transfer.execute).toHaveBeenCalledTimes(0)
    expect(invalid).toBeInstanceOf(InvalidRequestError)
  })
  it('should return a bad request error when invalid params values', async () => {
    const { sut, presenter, transfer } = sutFactory()
    const response = await sut
      .execute({
        body: {
          amount: 100,
          target_email: 'tag',
        },
        accountId: 'id',
      })
      .catch((err) => err)
    expect(response).toBeInstanceOf(BadRequestError)
  })
  it('should pass use case', async () => {
    const { sut, presenter, transfer } = sutFactory()
    const date = new Date()
    jest.spyOn(transfer, 'execute').mockResolvedValueOnce({
      amount: 100,
      target_email: 'stone@stone.com.br',
      origin_email: 'stone@ston2.com.br',
      created_at: date,
      id: 'id',
    })
    await sut
      .execute({
        body: {
          amount: 100,
          target_email: 'stone@stone.com.br',
        },
        accountId: 'id',
      })
      .catch((err) => err)
    expect(transfer.execute).toHaveBeenCalledTimes(1)
    expect(transfer.execute).toHaveBeenCalledWith({
      amount: 100,
      target_email: 'stone@stone.com.br',
      id: 'id',
    })
  })
  it('should call presenter with correct values', async () => {
    const { sut, presenter, transfer } = sutFactory()
    const date = new Date()
    jest.spyOn(transfer, 'execute').mockResolvedValueOnce({
      amount: 100,
      target_email: 'stone@stone.com.br',
      origin_email: 'stone@ston2.com.br',
      created_at: date,
      id: 'id',
    })
    await sut
      .execute({
        body: {
          amount: 100,
          target_email: 'stone@stone.com.br',
        },
        accountId: 'id',
      })
      .catch((err) => err)
    expect(presenter.response).toHaveBeenCalledTimes(1)
    expect(presenter.response).toHaveBeenCalledWith({
      amount: 100,
      target_email: 'stone@stone.com.br',
      origin_email: 'stone@ston2.com.br',
      created_at: date,
      id: 'id',
    })
  })

  it('should call presenter with correct values', async () => {
    const { sut, presenter, transfer } = sutFactory()
    const date = new Date()

    jest.spyOn(transfer, 'execute').mockResolvedValueOnce({
      amount: 100,
      target_email: 'dasda@dasas.com.br',
      origin_email: 'dasdas@dasdas.com.br',
      created_at: date,
      id: 'id',
    })
    jest.spyOn(presenter, 'response').mockRejectedValueOnce(() => {
      throw new Error('invalid response')
    })
    await sut
      .execute({
        body: {
          amount: 100,
          target_email: 'dasdas@dasda.com.br',
        },
        accountId: 'id',
      })
      .catch((err) => err)
    expect(presenter.response).toHaveBeenCalledTimes(1)
  })
})
