import { IResponseHandler } from "~/application/ports/response-handler";
import { IResponseModel } from "~/application/ports/response-model";

export class CreatedResponse<T> implements IResponseHandler<T> {
  async response(body: T): Promise<IResponseModel<T>> {
    const responseData = {
      statusCode: 201,
      body,
    };

    return responseData;
  }
}