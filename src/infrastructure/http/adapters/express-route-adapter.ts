import { NextFunction, Request, Response } from 'express'
import { IController } from '~/application/ports/controller'

export const adaptRoute = <T>(controller: IController<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await controller.execute({
        query: req.query,
        params: req.params,
        body: req.body,
        headers: req.headers,
      })
      res.status(response.statusCode).json(response.body)
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
