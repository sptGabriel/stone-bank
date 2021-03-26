import { IRequestModel } from "./request-model";

export interface IMiddlewareRequestModel extends IRequestModel {
  method?: string;
}