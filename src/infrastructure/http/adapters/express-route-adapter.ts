import { NextFunction, Request, Response } from 'express'
import { IController } from '~/application/ports/controller'

export const adaptRoute = <T>(controller: IController<T>) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const response = await controller.execute({
        query: request.query,
        params: request.params,
        body: request.body,
        headers: request.headers,
      })
      response.status(response.statusCode).json(response.body)
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
