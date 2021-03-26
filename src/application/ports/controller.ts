import { IRequestModel } from './request-model'
import { IResponseModel } from './response-model';

export interface IController {
  execute(requestModel: IRequestModel): Promise<IResponseModel<any>>
}
