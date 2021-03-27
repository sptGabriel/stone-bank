import { SigninCommand } from './sigin.command'

describe('signin command', () => {
  it('should', () => {
    const command = new SigninCommand(undefined as any)
    expect(command).toHaveProperty('account')
    expect(command).toMatchObject({ account: undefined })
  })
  it('should pass', () => {
    const command = new SigninCommand({
      email: 'stone@stone.com',
      password: '101010',
    })
    expect(command).toHaveProperty('account')
    expect(command).toMatchObject({
      account: {
        email: 'stone@stone.com',
        password: '101010',
      },
    })
  })
})
