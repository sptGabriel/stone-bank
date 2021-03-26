import { AccountStruct } from "../account.struct";

export interface IAddAccountUseCase{
	execute(data:Omit<AccountStruct, 'id'>): Promise<Account>
}