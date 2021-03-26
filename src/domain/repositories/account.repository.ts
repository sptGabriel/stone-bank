import { Transfer } from "../transfer";
import { TransferStruct } from "../transfer.struct";
import { Account } from '../account';

export interface IAccountRepository {
  find: () => Promise<Account[]>
  findAccountTransfers: (id: string) => Promise<TransferStruct[]>
  findbyId: (id: string) => Promise<Account | undefined>
  findbyEmail: (email: string) => Promise<Account | undefined>
  save: (user: Account) => Promise<void>
  withdraw: (id: string, amount: number) => Promise<Account>
  transfer: (transfer:Transfer) => Promise<void>
}
