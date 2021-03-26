import { IResponseModel } from './response-model';

export interface IController {
  execute(requestModel: any): Promise<IResponseModel<any>>
}
