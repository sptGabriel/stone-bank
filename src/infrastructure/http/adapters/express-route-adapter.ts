import { NextFunction, Request, Response } from 'express'
import { IController } from '~/application/ports/controller'

export const adaptRoute = (controller: IController) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const result = await controller.execute({
        ...(request.body || {}),
        ...(request.params || {}),
      })
      response.status(result.statusCode).json(result.body)
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
