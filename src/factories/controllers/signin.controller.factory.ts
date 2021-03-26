import { SigninCommandHandler } from "~/application/commands/sigin/signin.command-handler";
import { SiginUseCase } from "~/application/usecases/account/signin.use-case";
import { JwtAdapter } from "~/common/adapters/jwt.adapter";
import { SigninCommand } from "~/domain/commands/sigin.command";
import commandBus from "~/infrastructure/cqrs/command-bus";
import { Connection } from "~/infrastructure/database/connection";
import { AccountRepository } from "~/infrastructure/persistence/account.impl-repository";
import { SigninController } from "~/presentation/controllers/sign-in/signin.controller";
import { CreatedResponse } from "~/presentation/responses/created-response";
import { SucessResponse } from "~/presentation/responses/sucess-response";

export const makeSigninControllerFactory = () => { 
	const repository = new AccountRepository(Connection.client)
  const jwtEncrypt = new JwtAdapter('stonescret',3600)
  const commandHandler = new SigninCommandHandler(repository, jwtEncrypt)
  commandBus.register([
    {
      command: SigninCommand,
      commandHandler,
    },
  ])
  const useCase = new SiginUseCase(commandBus)
  const signinPresented = new SucessResponse<{token: string}>();
  return new SigninController(useCase,signinPresented)
}