import { TransferStruct } from '../transfer.struct'

export interface IGetAccountTransfersUseCase {
  execute(
    id: string,
    pagination: { limit: number; page: number },
  ): Promise<TransferStruct[]>
}
