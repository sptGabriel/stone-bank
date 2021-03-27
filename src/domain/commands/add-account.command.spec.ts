import { AddAccountCommand } from './add-account.command'

describe('add account command', () => {
  it('should', () => {
    const command = new AddAccountCommand(undefined as any)
    expect(command).toHaveProperty('account')
    expect(command).toMatchObject({ account: undefined })
  })
  it('should pass', () => {
    const command = new AddAccountCommand({
      email: 'stone@stone.com',
      password: '101010',
      name: 'stone',
    })
    expect(command).toHaveProperty('account')
    expect(command).toMatchObject({
      account: {
        email: 'stone@stone.com',
        password: '101010',
        name: 'stone',
      },
    })
  })
})
