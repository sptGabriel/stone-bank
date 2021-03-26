import { IMiddlewareRequestModel } from "./middleware-request.model";

export interface IMiddleware {
  execute(requestModel: IMiddlewareRequestModel): Promise<void> | never;
}