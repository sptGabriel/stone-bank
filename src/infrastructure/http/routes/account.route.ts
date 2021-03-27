import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAddControllerFactory } from '~/factories/controllers/add-account-controller.factory'
import { makeSigninControllerFactory } from '~/factories/controllers/signin.controller.factory'
import { makeisAuthMiddleware } from '~/factories/middlewares/isAuth.middleware.factory'
import { makeWithdrawControllerFactory } from '~/factories/controllers/withdraw-controller.factory'
import { makeTransferControllerFactory } from '~/factories/controllers/transfer-controller.factory'
import { makeGetAccountTransferController } from '~/factories/controllers/get-account-transfers.controller.factory'

export default (router: Router): void => {
  router.post('/accounts', adaptRoute(makeAddControllerFactory()))
  router.post('/signin', adaptRoute(makeSigninControllerFactory()))
  router.post(
    '/withdraw',
    adaptMiddleware(makeisAuthMiddleware()),
    adaptRoute(makeWithdrawControllerFactory()),
  )
  router.post(
    '/transfers',
    adaptMiddleware(makeisAuthMiddleware()),
    adaptRoute(makeTransferControllerFactory()),
  )
  router.get(
    '/transfers',
    adaptMiddleware(makeisAuthMiddleware()),
    adaptRoute(makeGetAccountTransferController()),
  )
}
