export interface IGetAccountByTokenUseCase {
  execute(
    token: string
  ): Promise<Account>
}
