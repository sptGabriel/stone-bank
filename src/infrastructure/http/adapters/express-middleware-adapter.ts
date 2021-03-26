import { NextFunction, Request, RequestHandler } from 'express'
import { IMiddleware } from '~/application/ports/middleware'

export const adaptMiddleware = <T>(middleware: IMiddleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      await middleware
        .execute({
          query: request.query,
          params: request.params,
          body: request.body,
          headers: request.headers,
          method: request.method,
        })
        .then(() => next())
    } catch (error) {
      return next(error)
    }
  }
}
