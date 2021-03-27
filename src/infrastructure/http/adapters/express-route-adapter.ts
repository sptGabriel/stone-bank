import { NextFunction, Request, Response } from 'express'
import { IController } from '~/application/ports/controller'

export const adaptRoute = (controller: IController) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    await controller
      .execute({
        query: request.query,
        params: request.params,
        body: request.body,
        headers: request.headers,
        accountId: request.accountId,
      })
      .then((res) => {
        response.status(res.statusCode).json(res.body)
      })
      .catch((err) => next(err))
  }
}
