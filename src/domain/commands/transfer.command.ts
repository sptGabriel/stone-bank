import { ICommand } from 'kill-event-sourcing'

export class TransferCommand implements ICommand {
  constructor(
    public readonly transfer: {
      id: string
      amount: number
      target_email: string
    },
  ) {}
}
