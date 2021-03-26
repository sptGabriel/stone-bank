export interface ResponseHandler<T = any> {
  response(body: T): Promise<any>;
}