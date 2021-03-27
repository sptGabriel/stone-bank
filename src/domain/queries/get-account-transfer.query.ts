import { IQuery } from 'kill-event-sourcing'

export class GetAccountTransfersQuery implements IQuery {
  constructor(
    public readonly id: string,
    public readonly pagination: { limit: number; page: number },
  ) {}
}
