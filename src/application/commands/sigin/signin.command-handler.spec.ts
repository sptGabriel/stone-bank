import { ICommand, ICommandHandler } from 'kill-event-sourcing'
import { v4 } from 'uuid'
import { NotFoundError } from '~/application/errors/not-found.error'
import { UnauthorizedError } from '~/application/errors/unathorized.error'
import { IEncrypter } from '~/application/ports/encrypter'
import { JwtAdapter } from '~/common/adapters/jwt.adapter'
import { Account } from '~/domain/account'
import { SigninCommand } from '~/domain/commands/sigin.command'
import { Email } from '~/domain/email'
import { Name } from '~/domain/name'
import { Password } from '~/domain/password'
import { IAccountRepository } from '~/domain/repositories/account.repository'
import { AccountRepository } from '~/infrastructure/persistence/account.impl-repository'
import { SigninController } from '~/presentation/controllers/sign-in/signin.controller'
import { SigninCommandHandler } from './signin.command-handler'

interface SutType {
  sut: ICommandHandler
  repository: IAccountRepository
  encrypter: IEncrypter
  command: ICommand
  account: Account
}

jest.mock('~/infrastructure/persistence/account.impl-repository')
jest.mock('~/common/adapters/jwt.adapter')

const RepositoryMock = AccountRepository as jest.Mock<AccountRepository>
const JwtMock = JwtAdapter as jest.Mock<JwtAdapter>

const mockedCommand = (): SigninCommand => {
  return new SigninCommand({
    email: 'stone@stone.com.br',
    password: '123456789',
  })
}

const mockedAccount = (): Account => {
  return Account.create({
    balance: 1000,
    password: '123456789',
    email: 'stone@stone.com.br',
    name: 'stonestone',
    id: v4(),
  }).value as any
}

const sutFactory = (): SutType => {
  const repository = new RepositoryMock() as jest.Mocked<AccountRepository>
  const encrypter = new JwtMock() as jest.Mocked<JwtAdapter>
  const sut = new SigninCommandHandler(repository, encrypter)
  const command = mockedCommand()
  const account = mockedAccount()
  return { sut, repository, encrypter, command, account }
}

describe('Create account controller', () => {
  it('should call findbyEmail functions with correct values', async () => {
    const { sut, repository, command } = sutFactory()
    const findbyEmailSpy = jest.spyOn(repository, 'findbyEmail')
    await sut.execute(command).catch((err) => err)
    expect(findbyEmailSpy).toHaveBeenCalledTimes(1)
  })
  it('should not call save when has invalid email', async () => {
    const { sut, repository, command } = sutFactory()
    const saveSpy = jest.spyOn(repository, 'save')
    const response = await sut.execute(command).catch((err) => err)
    expect(saveSpy).toHaveBeenCalledTimes(0)
    expect(response).toBeInstanceOf(NotFoundError)
  })
  it('should not call save when has invalid password', async () => {
    const { sut, repository, command, account } = sutFactory()
    const saveSpy = jest.spyOn(repository, 'save')
    jest
      .spyOn(repository, 'findbyEmail')
      .mockResolvedValueOnce(
        new Account(
          Email.create('gotfailed@gmail.com').value as any,
          Name.create('hu3huhu3').value as any,
          1000,
          Password.create('dsadasdasdas').value as any,
          v4(),
        ),
      )
    const response = await sut.execute(command).catch((err) => err)
    expect(saveSpy).toHaveBeenCalledTimes(0)
    expect(response).toBeInstanceOf(UnauthorizedError)
  })
  it('should return a valid token', async () => {
    const { sut, repository, command, account } = sutFactory()
    jest.spyOn(sut, 'execute').mockResolvedValueOnce({ token: 'stone jwt' })
    const response = await sut.execute(command).catch((err) => err)
    expect(response).toStrictEqual({ token: 'stone jwt' })
  })
})
