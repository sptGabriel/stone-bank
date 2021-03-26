import { left, right } from '~main/core/either'
import { Account } from './account'
import { Transfer } from './transfer'
import { InvalidAccountTypeError } from './errors/invalid-account'
import { v4 } from 'uuid'

const owner = Account.create({
  name: 'stone stone',
  password: 'stonebanking',
  email: 'stone@stone.com.br',
  balance: 1000,
})

const target = Account.create({
  name: 'gabriel costaa',
  password: 'gabrielxdxdxd',
  email: 'gabriel@gabriel.com.br',
  balance: 1000,
})

describe('Transfer domain', () => {
  test('should be create a valid transfer', () => {
    const created_at = new Date()
    const id = v4();
    const transfer = Transfer.create({
      owner: owner.value,
      target: target.value,
      amount: 10,
      created_at,
      id
    } as any)
    expect(transfer.isRight() && transfer.value).toBeInstanceOf(Transfer);
  })
  test('should not transfer with invalid owner/target account', () => {
    const transfer = Transfer.create({
      owner: null,
      target: target.value,
      amount: 10,
      created_at: new Date(),
    } as any)
    expect(transfer).toEqual(left(new InvalidAccountTypeError()))
    const transfer2 = Transfer.create({
      owner: owner.value,
      target: target,
      amount: 10,
      created_at: new Date(),
    } as any)
    expect(transfer).toEqual(left(new InvalidAccountTypeError()))
  })
})
