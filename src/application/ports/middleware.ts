import { IResponseModel } from './response-model'

export interface IMiddleware {
  execute(requestModel: any): Promise<IResponseModel<any>>
}
