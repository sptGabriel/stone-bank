import { TransferStruct } from '../transfer.struct'

export interface ITransferUseCase {
  execute(data: {
    amount: number
    target_email: string
    id: string
  }): Promise<TransferStruct>
}
