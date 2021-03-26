import { IMiddleware } from '~/application/ports/middleware'
import { GetAccountByTokenQueryHandler } from '~/application/queries/get-account-byToken/get-account-byToken.query-handler'
import { GetAccountByTokenUseCase } from '~/application/usecases/account/account-by-token.use-case'
import { JwtAdapter } from '~/common/adapters/jwt.adapter'
import { GetAccountByTokenQuery } from '~/domain/queries/get-account-byToken.query'
import queryBus from '~/infrastructure/cqrs/query-bus'
import { Connection } from '~/infrastructure/database/connection'
import { AccountRepository } from '~/infrastructure/persistence/account.impl-repository'
import { AuthMiddleware } from '~/presentation/middlewares/is-auth.middleware'
import { SucessResponse } from '~/presentation/responses/sucess-response'

export const makeisAuthMiddleware = (): IMiddleware => {
  const decrypter = new JwtAdapter('stonescret', 3600)
  const repository = new AccountRepository(Connection.client)
  const queryHandler = new GetAccountByTokenQueryHandler(repository, decrypter)
  queryBus.register([
    {
      query: GetAccountByTokenQuery,
      queryHandler,
    },
  ])
  const useCase = new GetAccountByTokenUseCase(queryBus)
  const presenter = new SucessResponse<{accountId: string}>()
  return new AuthMiddleware(useCase, presenter)
}
