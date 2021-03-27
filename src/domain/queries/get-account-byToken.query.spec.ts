import { GetAccountByTokenQuery } from './get-account-byToken.query'

describe('add account command', () => {
  it('should', () => {
    const command = new GetAccountByTokenQuery(undefined as any)
    expect(command).toHaveProperty('token')
    expect(command).toMatchObject({ token: undefined })
  })
  it('should pass', () => {
    const command = new GetAccountByTokenQuery('stone')
    expect(command).toHaveProperty('token')
    expect(command).toMatchObject({token: 'stone'})
  })
})
