import { IRequestModel } from './request-model'
import { IResponseModel } from './response-model';

export interface IController<T = unknown> {
  execute(requestModel: IRequestModel): Promise<IResponseModel<T>>
}
