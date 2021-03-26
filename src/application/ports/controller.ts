import { IRequestModel } from './request-model'

export interface IController<T = unknown> {
  execute(requestModel: IRequestModel): Promise<any>
}
