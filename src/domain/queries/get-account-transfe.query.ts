import { IQuery } from "kill-event-sourcing";

export interface IGetAccountTransferQuery extends IQuery{
	id: string
}