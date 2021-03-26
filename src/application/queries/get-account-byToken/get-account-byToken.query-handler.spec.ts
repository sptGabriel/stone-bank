import { JsonWebTokenError } from 'jsonwebtoken'
import { ICommandHandler, IQuery } from 'kill-event-sourcing'
import { IDecrypter } from '~/application/ports/decrypter'
import { JwtAdapter } from '~/common/adapters/jwt.adapter'
import { GetAccountByTokenQuery } from '~/domain/queries/get-account-byToken.query'
import { IAccountRepository } from '~/domain/repositories/account.repository'
import { AccountRepository } from '~/infrastructure/persistence/account.impl-repository'
import { GetAccountByTokenQueryHandler } from './get-account-byToken.query-handler'

interface SutType {
  sut: GetAccountByTokenQueryHandler
  decrypt: IDecrypter
  repository: IAccountRepository
  query: IQuery
}

jest.mock('~/infrastructure/persistence/account.impl-repository')
jest.mock('~/common/adapters/jwt.adapter')

const RepositoryMock = AccountRepository as jest.Mock<AccountRepository>
const JwtMock = (JwtAdapter as unknown) as jest.Mock<IDecrypter>

const mockedQuery = (): GetAccountByTokenQuery => {
  return new GetAccountByTokenQuery('token')
}

//const mockedAccount = (): Account => {
//  return Account.create({
//    balance: 1000,
//    password: '123456789',
//    email: 'stone@stone.com.br',
//    name: 'stonestone',
//    id: v4(),
//  }).value as any
//}

const sutFactory = (): SutType => {
  const repository = new RepositoryMock() as jest.Mocked<AccountRepository>
  const decrypt = new JwtMock() as jest.Mocked<IDecrypter>
  const sut = new GetAccountByTokenQueryHandler(repository, decrypt)

  return { sut, repository, decrypt, query: mockedQuery() }
}

describe('GetAccountByTokenQueryHandler', () => {
  it('should return an error UnauthorizedERROR when error is instanceof JSONWEBTOKENERROR', async () => {
    const { sut, repository, decrypt } = sutFactory()
    jest.spyOn(decrypt, 'decrypt').mockImplementationOnce(() => {
      throw new JsonWebTokenError('failed')
    })
    const queryHandler = await sut.execute({} as any).catch((err) => err)
    expect(queryHandler.name).toBe('UnauthorizedError')
    expect(queryHandler.message).toBe('Access denied')
  })
  it('should return an error when error not is instanceof JSONWEBTOKEN', async () => {
    const { sut, repository, decrypt } = sutFactory()
    jest.spyOn(decrypt, 'decrypt').mockImplementationOnce(() => {
      throw new Error('not is webtoken')
    })
    const queryHandler = await sut.execute({} as any).catch((err) => err)
    expect(queryHandler.name).toBe('Error')
    expect(queryHandler.message).toBe('not is webtoken')
  })
  it('should not call getUser when has invalid token', async () => {
    const { sut, repository, decrypt } = sutFactory()
    const getUserSpy = jest.spyOn(
      GetAccountByTokenQueryHandler.prototype as any,
      'getAccount',
    )
    //jest.spyOn(decrypt, 'decrypt').mockImplementationOnce(() => {
    //  throw new JsonWebTokenError('failed')
    //})
    jest.spyOn(decrypt, 'decrypt').mockImplementationOnce(() => {
      throw new JsonWebTokenError('failed')
    })
    const queryHandler = await sut.execute({} as any).catch((err) => err)
    expect(queryHandler.name).toBe('UnauthorizedError')
    expect(queryHandler.message).toBe('Access denied')
    expect(getUserSpy).toHaveBeenCalledTimes(0)
  })
  it('should call getUser with valid token', async () => {
    const { sut, repository, decrypt, query } = sutFactory()
    const getUserSpy = jest.spyOn(
      GetAccountByTokenQueryHandler.prototype as any,
      'getAccount',
    )
    jest.spyOn(decrypt, 'decrypt').mockResolvedValue('a')
    const queryHandler = await sut.execute(query as any).catch((err) => err)
    expect(getUserSpy).toHaveBeenCalledTimes(1)
  })
  it('should pass with valid token', async () => {
    const { sut, repository, decrypt, query } = sutFactory()
    const getUserSpy = jest.spyOn(
      GetAccountByTokenQueryHandler.prototype as any,
      'getAccount',
    )
    jest.spyOn(decrypt, 'decrypt').mockResolvedValue('a')
    jest.spyOn(sut as any, 'getAccount').mockResolvedValue('stone')
    const queryHandler = await sut.execute(query as any).catch((err) => err)
    expect(getUserSpy).toHaveBeenCalledTimes(1)
    expect(queryHandler).toBe('stone')
  })
})
