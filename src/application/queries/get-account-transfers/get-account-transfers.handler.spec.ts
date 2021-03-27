import { IQuery, IQueryHandler } from 'kill-event-sourcing'
import { GetAccountTransfersQuery } from '~/domain/queries/get-account-transfer.query'
import { IAccountRepository } from '~/domain/repositories/account.repository'
import { AccountRepository } from '~/infrastructure/persistence/account.impl-repository'
import { SucessResponse } from '~/presentation/responses/sucess-response'
import { GetAccountTransfersQueryHandler } from './get-account-transfers.handler'

interface SutType {
  sut: IQueryHandler
  repository: IAccountRepository
}

jest.mock('~/domain/repositories/account.repository')

const RepositoryMock = AccountRepository as jest.Mock<AccountRepository>

const query = (): IQuery => {
  return new GetAccountTransfersQuery('stone', { limit: 15, page: 1 })
}

const sutFactory = (): SutType => {
  const repository = new RepositoryMock() as jest.Mocked<AccountRepository>
  const sut = new GetAccountTransfersQueryHandler(repository)
  return { sut, repository }
}

describe('Transfer controller', () => {
  it('should throw error on find transfers', async () => {
    const { sut, repository } = sutFactory()
    jest
      .spyOn(repository, 'findAccountTransfers')
      .mockRejectedValueOnce(new Error(`BAD`))
    const responseHasError = await sut.execute({}).catch((err) => err)
    expect(repository.findAccountTransfers).toHaveBeenCalledTimes(1)
    expect(responseHasError.name).toBe('Error')
    expect(responseHasError.message).toBe('BAD')
  })
  it('should pass findAccountTransfers', async () => {
    const { sut, repository } = sutFactory()
    jest
      .spyOn(repository, 'findAccountTransfers')
      .mockResolvedValue(new Array(15))
    jest.spyOn(sut as any, 'sortTransfer').mockResolvedValue(new Array(15))
    const response = await sut.execute({}).catch((err) => err)
    expect(repository.findAccountTransfers).toHaveBeenCalledTimes(1)
    expect(response).toHaveLength(15)
  })
})
