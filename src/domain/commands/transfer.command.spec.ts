import { TransferCommand } from './transfer.command'

describe('transfer command', () => {
  it('should', () => {
    const command = new TransferCommand(undefined as any)
    expect(command).toHaveProperty('transfer')
    expect(command).toMatchObject({ transfer: undefined })
  })
  it('should pass', () => {
    const command = new TransferCommand({
      id: 'stone',
      target_email: 'stone@stone.com',
      amount: 1,
    })
    expect(command).toHaveProperty('transfer')
    expect(command).toMatchObject({
      transfer: {
      id: 'stone',
      target_email: 'stone@stone.com',
      amount: 1,
    },
    })
  })
})
