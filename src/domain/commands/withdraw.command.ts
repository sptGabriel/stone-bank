import { ICommand } from 'kill-event-sourcing'

export class WithdrawCommand implements ICommand {
  constructor(public readonly withdraw: { id: string; amount: number }) {}
}
