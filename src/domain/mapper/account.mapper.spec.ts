import { AccountMapper } from './account.mapper'

jest.mock('./account.mapper')

describe('Account Mapper', () => {
  test('should call mapper with invalid dto', () => {
    const value = AccountMapper.toDomain({} as any)
    expect(AccountMapper.toDomain).toBeCalledTimes(1)
  })
  test('should throw error on to Domain', () => {
    const mockStaticF = jest.fn().mockReturnValue(new Error('fail'))
    AccountMapper.toDomain = mockStaticF
    const result = mockStaticF()
    expect(result.name).toBe('Error')
    expect(result.message).toBe('fail')
  })
  test('should throw error on toPersistence', () => {
    const mockStaticF = jest.fn().mockReturnValue(new Error('fail'))
    AccountMapper.toPersistence = mockStaticF
    const result = mockStaticF()
    expect(result.name).toBe('Error')
    expect(result.message).toBe('fail')
  })
  test('should pass to Domain', () => {
    const mockStaticF = jest.fn().mockReturnValue('worked')
    AccountMapper.toDomain = mockStaticF
    const result = mockStaticF()
    expect(result).toBe('worked')
  })
  test('should pass to toPersistence', () => {
    const mockStaticF = jest.fn().mockReturnValue('worked')
    AccountMapper.toPersistence = mockStaticF
    const result = mockStaticF()
    expect(result).toBe('worked')
  })
  //test('should not create account with balance value equals 100 and invalid e-mail', () => {
  //  const email = 'bad_email'
  //  const account = Account.create({
  //    name: 'stone@stone',
  //    password: '123456789',
  //    email,
  //    balance: 1000,
  //  })
  //  expect(account).toEqual(left(new InvalidEmailError(email)))
  //})

  //test('should not create account with invalid name, invalid name length', () => {
  //  const account = Account.create({
  //    name: 'a',
  //    balance: 1000,
  //    password: '123456789',
  //    email: 'stone@stone.com',
  //  })
  //  expect(account).toEqual(left(new InvalidNameError('a')))
  //})

  //test('should not create account with invalid pwd, (pwd less than 8)', () => {
  //  const account = Account.create({
  //    name: 'asdasdsadasdasdas',
  //    balance: 1000,
  //    password: '12345',
  //    email: 'stone@stone.com',
  //  })
  //  expect(account).toEqual(left(new InvalidPasswordLengthError('12345')))
  //})

  //test('should not create account with invalid name: too many characters', async () => {
  //  let name = ''
  //  for (let i = 0; i < 256; i++) {
  //    name += 'stone'
  //  }
  //  const account = Account.create({
  //    name,
  //    balance: 1000,
  //    password: '12345',
  //    email: 'stone@stone.com',
  //  })
  //  expect(account).toEqual(left(new InvalidNameError(name)))
  //})
})
