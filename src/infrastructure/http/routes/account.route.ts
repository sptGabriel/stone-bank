import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAddControllerFactory } from '~/factories/controllers/add-account-controller.factory'

export default (router: Router): void => {
	router.use('/accounts', adaptRoute(makeAddControllerFactory()))
}
