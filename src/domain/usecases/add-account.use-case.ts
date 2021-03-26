import { AccountStruct } from '../account.struct'

export interface IAddAccountUseCase {
  execute(
    data: Omit<AccountStruct, 'id' | 'balance'>,
  ): Promise<Omit<AccountStruct, 'password'>>
}
