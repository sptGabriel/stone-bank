import { ICommand } from "kill-event-sourcing";

export interface IWithdrawCommand {
	amount: number
	id: string
}