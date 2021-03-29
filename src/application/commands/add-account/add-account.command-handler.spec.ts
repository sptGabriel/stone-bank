import { v4 } from 'uuid'
import { AccountAlreadyExistsError } from '~/application/errors/account-exists.error'
import { Account } from '~/domain/account'
import { AddAccountCommand } from '~/domain/commands/add-account.command'
import { IAccountRepository } from '~/domain/repositories/account.repository'
import { AccountRepository } from '~/infrastructure/persistence/account.impl-repository'
import { AddAccountCommandHandler } from './add-account.command-handler'

interface SutType {
  sut: AddAccountCommandHandler
  repository: IAccountRepository
}

jest.mock('~/infrastructure/persistence/account.impl-repository')

const RepositoryMock = AccountRepository as jest.Mock<AccountRepository>

const sutFactory = (): SutType => {
  const repository = new RepositoryMock() as jest.Mocked<AccountRepository>
  const sut = new AddAccountCommandHandler(repository)
  return { sut, repository }
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

const mockedCommand = (): AddAccountCommand => {
  return new AddAccountCommand({
    name: 'stone stone stone',
    email: 'stone@stone.com.br',
    password: '123456789',
  })
}

describe('Create account command handler', () => {
  it('should call findbyEmail and save functions with correct values', async () => {
    const { sut, repository } = sutFactory()
    await sut.execute(mockedCommand())
    expect(repository.findbyEmail).toHaveBeenCalledTimes(1)
    expect(repository.save).toHaveBeenCalledTimes(1)
  })
  it('should not call save when has invalid command', async () => {
    const { sut, repository } = sutFactory()
    const save = jest.spyOn(repository, 'save')
    const response = await sut.execute({} as any).catch((err) => err)
    expect(save).toHaveBeenCalledTimes(0)
    expect(response).toBeInstanceOf(Error)
  })
  it('should return AccountAlreadyExistsError when has invalid Email', async () => {
    const { sut, repository } = sutFactory()
    jest.spyOn(repository, 'findbyEmail').mockResolvedValueOnce(mockedAccount())
    const response = await sut.execute(mockedCommand()).catch((err) => err)
    expect(repository.save).toHaveBeenCalledTimes(0)
    expect(response).toBeInstanceOf(AccountAlreadyExistsError)
  })
  it('should save and return account created when has valid command', async () => {
    const { sut, repository } = sutFactory()
    jest.spyOn(sut, 'execute').mockResolvedValueOnce(mockedAccount().toJSON())
    const response = await sut.execute(mockedCommand()).catch((err) => err)
    expect(repository.save).toHaveBeenCalledTimes(0)
    expect(response).toStrictEqual({
      email: 'stone@stone.com.br',
      name: 'stonestone',
      balance: 1000,
      id,
    })
  })
})
