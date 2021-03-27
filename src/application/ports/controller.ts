import { RequestModel } from './request-model';
import { IResponseModel } from './response-model'

export interface IController {
  execute(request: RequestModel): Promise<IResponseModel<any>>
}
