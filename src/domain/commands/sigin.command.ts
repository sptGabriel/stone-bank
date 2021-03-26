import { ICommand } from 'kill-event-sourcing'
import { AccountStruct } from '../account.struct';

export class SigninCommand implements ICommand {
  constructor(public account: Omit<AccountStruct, 'id' | 'balance' | 'name'>){}
}
