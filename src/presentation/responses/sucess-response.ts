import { IResponseHandler } from "~/application/ports/response-handler";
import { IResponseModel } from "~/application/ports/response-model";

export class SucessResponse<T> implements IResponseHandler<T> {
  async response(body: T): Promise<IResponseModel<T>> {
    const responseData = {
      statusCode: 200,
      body,
    };

    return responseData;
  }
}