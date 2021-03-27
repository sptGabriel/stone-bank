import { IQuery } from 'kill-event-sourcing'

export class GetAccountByTokenQuery implements IQuery {
  constructor(public readonly token: string) {}
}
