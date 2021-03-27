import { NextFunction, Request, Response } from 'express'
import { IMiddleware } from '~/application/ports/middleware'

export const adaptMiddleware = (middleware: IMiddleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      await middleware
        .execute({
          accessToken: request.headers?.authorization?.split(' ')[1],
          ...(request.headers || {}),
        })
        .then((res) => {
          Object.assign(request, res.body)
          next()
        })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  }
}
