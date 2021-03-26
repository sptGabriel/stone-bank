import { ICommand } from "kill-event-sourcing";

export interface ISignInCommand extends ICommand {
	email: string;
	password: string;
}