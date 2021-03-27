import { IResponseModel } from './response-model'

export interface IResponseHandler<T = any> {
  response(body: T): Promise<IResponseModel<T>>
}
