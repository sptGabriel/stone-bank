import { AccountStruct } from '../account.struct'

export interface IWithdrawUseCase {
  execute(data: {
    id: string
    amount: number
  }): Promise<{
    message: string
    accounts: Omit<AccountStruct, 'password'>
  }>
}
