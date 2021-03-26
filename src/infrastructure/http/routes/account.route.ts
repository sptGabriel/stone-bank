import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAddControllerFactory } from '~/factories/controllers/add-account-controller.factory'
import { makeSigninControllerFactory } from '~/factories/controllers/signin.controller.factory'
import { makeisAuthMiddleware } from '~/factories/middlewares/isAuth.middleware.factory'

export default (router: Router): void => {
  router.post('/accounts', adaptRoute(makeAddControllerFactory()))
  router.post('/signin', adaptRoute(makeSigninControllerFactory()))
  //router.post('/test',adaptMiddleware(makeisAuthMiddleware()), (req, res) => {
  //  console.log(req)
  //})
  //router.post(
  //  '/withdraw',
  //  adaptMiddleware(makeisAuthMiddleware()),
  //  adaptRoute(makeSigninControllerFactory()),
  //)
}
