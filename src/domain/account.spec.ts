import { Account } from './account'
import { v4 } from 'uuid'
import { InvalidEmailError } from '~/application/errors/invalid-email.error'
import { left } from '~/common/helpers/either'
import { InvalidNameError } from '~/application/errors/invalid-name.error'
import { InvalidPasswordLengthError } from '~/application/errors/invalid-pwd-length'

describe('Account domain', () => {
  test('should be create a valid account', () => {
    const id = v4()
    const stone = Account.create({
      id,
      balance: 1000,
      email: 'stone@stone.com',
      password: 'stonebanking',
      name: 'stone banking',
    })
    expect(stone.isRight() && stone.value).toBeInstanceOf(Account)
  })
  test('should not create account with balance value equals 100 and invalid e-mail', () => {
    const email = 'bad_email'
    const account = Account.create({
      name: 'stone@stone',
      password: '123456789',
      email,
      balance: 1000,
    })
    expect(account).toEqual(left(new InvalidEmailError(email)))
  })

  test('should not create account with invalid name, invalid name length', () => {
    const account = Account.create({
      name: 'a',
      balance: 1000,
      password: '123456789',
      email: 'stone@stone.com',
    })
    expect(account).toEqual(left(new InvalidNameError('a')))
  })

  test('should not create account with invalid pwd, (pwd less than 8)', () => {
    const account = Account.create({
      name: 'asdasdsadasdasdas',
      balance: 1000,
      password: '12345',
      email: 'stone@stone.com',
    })
    expect(account).toEqual(left(new InvalidPasswordLengthError('12345')))
  })

  test('should not create account with invalid name: too many characters', async () => {
    let name = ''
    for (let i = 0; i < 256; i++) {
      name += 'stone'
    }
    const account = Account.create({
      name,
      balance: 1000,
      password: '12345',
      email: 'stone@stone.com',
    })
    expect(account).toEqual(left(new InvalidNameError(name)))
  })
})
