import { WithdrawCommand } from './withdraw.command'

describe('transfer command', () => {
  it('should', () => {
    const command = new WithdrawCommand(undefined as any)
    expect(command).toHaveProperty('withdraw')
    expect(command).toMatchObject({ withdraw: undefined })
  })
  it('should pass', () => {
    const command = new WithdrawCommand({
      id: 'stone',
      amount: 1,
    })
    expect(command).toHaveProperty('withdraw')
    expect(command).toMatchObject({
      withdraw: {
        id: 'stone',
        amount: 1,
      },
    })
  })
})
