import { GetAccountTransfersQuery } from './get-account-transfer.query'

describe('add account command', () => {
  it('should ', () => {
    const command = new GetAccountTransfersQuery('xx', {
      limit: 1,
      page: 1,
    })
    expect(command).not.toMatchObject({
      id: 'asd',
      pagination: { limit: 10, page: 1 },
    })
  })
  it('should pass', () => {
    const command = new GetAccountTransfersQuery('stone', {
      limit: 10,
      page: 1,
    })
    expect(command).toMatchObject({
      id: 'stone',
      pagination: { limit: 10, page: 1 },
    })
  })
})
