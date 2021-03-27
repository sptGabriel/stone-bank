import { ICommand, ICommandHandler } from 'kill-event-sourcing'
import { NotFoundError } from '~/application/errors/not-found.error'
import { TransferCommand } from '~/domain/commands/transfer.command'
import { IAccountRepository } from '~/domain/repositories/account.repository'
import { Transfer } from '~/domain/transfer'
import { AccountRepository } from '~/infrastructure/persistence/account.impl-repository'
import { TransferCommandHandler } from './transfer.command-handler'

interface SutType {
  sut: ICommandHandler
  repository: IAccountRepository
  command: ICommand
}

jest.mock('~/infrastructure/persistence/account.impl-repository')

const RepositoryMock = AccountRepository as jest.Mock<AccountRepository>
const mockedCommand = (): TransferCommand => {
  return new TransferCommand({
    target_email: 'stone@stone.com.br',
    amount: 1000,
    id: 'stone',
  })
}

const sutFactory = (): SutType => {
  const repository = new RepositoryMock() as jest.Mocked<AccountRepository>
  const sut = new TransferCommandHandler(repository)

  return { sut, repository, command: mockedCommand() }
}

describe('Transfer command handler', () => {
  it('should reject with error when call getAccountById', async () => {
    const { sut, repository, command } = sutFactory()
    const getByIDSpy = jest.spyOn(sut as any, 'getAccountById')
    jest
      .spyOn(sut as any, 'getAccountById')
      .mockRejectedValueOnce(new Error('ANY'))
    const response = await sut.execute(command).catch((err) => err)
    expect(getByIDSpy).toHaveBeenCalledTimes(1)
    expect(response.name).toBe('Error')
    expect(response.message).toBe('ANY')
  })
  it('should reject with error when call getAccountByEmail', async () => {
    const { sut, repository, command } = sutFactory()
    jest.spyOn(sut as any, 'getAccountById').mockResolvedValueOnce({})
    const getByEmailSpy = jest.spyOn(sut as any, 'getAccountByEmail')
    jest
      .spyOn(sut as any, 'getAccountByEmail')
      .mockRejectedValueOnce(new Error('ANY'))
    const response = await sut.execute(command).catch((err) => err)
    expect(getByEmailSpy).toHaveBeenCalledTimes(1)
    expect(response.name).toBe('Error')
    expect(response.message).toBe('ANY')
  })
  it('should reject with not found error when call getAccountById', async () => {
    const { sut, repository, command } = sutFactory()
    const getByIDSpy = jest.spyOn(sut as any, 'getAccountById')
    jest.spyOn(sut as any, 'getAccountById').mockResolvedValueOnce('sucess')
    const response = await sut.execute(command).catch((err) => err)
    expect(getByIDSpy).toHaveBeenCalledTimes(1)
    expect(response.name).toBe('NotFoundError')
    expect(response.message).toBe('This account not exist')
  })
  it('should reject with not found error when call getAccountByEmail', async () => {
    const { sut, repository, command } = sutFactory()
    const getByIDSpy = jest.spyOn(sut as any, 'getAccountById')
    jest.spyOn(sut as any, 'getAccountById').mockResolvedValueOnce('sucess')
    jest.spyOn(repository, 'findbyEmail').mockRejectedValueOnce('a')
    jest
      .spyOn(sut as any, 'getAccountByEmail')
      .mockRejectedValueOnce(new NotFoundError('This account not exist'))
    const response = await sut.execute(command).catch((err) => err)
    expect(getByIDSpy).toHaveBeenCalledTimes(1)
    expect(response.name).toBe('NotFoundError')
    expect(response.message).toBe('This account not exist')
  })
  it('should pass', async () => {
    const { sut, repository, command } = sutFactory()
    jest.spyOn(sut as any, 'getAccountById').mockResolvedValueOnce('sucess')
    jest.spyOn(sut as any, 'getAccountByEmail').mockResolvedValueOnce('sucess')
    jest.spyOn(sut as any, 'makeTransfer').mockResolvedValueOnce('sucess')
    jest.spyOn(sut as any, 'execute').mockResolvedValueOnce({ stone: 'sucess' })
    const response = await sut.execute(command).catch((err) => err)
    expect(response).toStrictEqual({ stone: 'sucess' })
  })
})
