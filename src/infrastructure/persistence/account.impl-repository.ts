import { Knex } from 'knex'
import { Account } from '~/domain/account'
import { AccountStruct } from '~/domain/account.struct'
import { AccountMapper } from '~/domain/mapper/account.mapper'
import { IAccountRepository } from '~/domain/repositories/account.repository'
import { Transfer } from '~/domain/transfer'
import { TransferStruct } from '~/domain/transfer.struct'

export class AccountRepository implements IAccountRepository {
  constructor(private readonly knex: Knex<any, any[]>) {}

  public async find(): Promise<Account[]> {
    const accounts = await this.knex<AccountStruct>('accounts')
    return accounts.map((account) => AccountMapper.toDomain(account))
  }

  public async findAccountTransfers(
    id: string,
    { page, limit }: { limit: number; page: number },
  ): Promise<TransferStruct[]> {
    return this.knex<TransferStruct>('transfers')
      .innerJoin('accounts as owner', 'transfers.origin_id', 'owner.id')
      .innerJoin('accounts as target', 'transfers.target_id', 'target.id')
      .select(
        'transfers.id',
        'owner.email as owner_email',
        'target.email as target_email',
        'transfers.amount',
        'transfers.created_at',
      )
      .where({ origin_id: id })
      .orWhere({ target_id: id })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset((page - 1) * limit)
  }

  public async transfer(data: Transfer): Promise<void> {
    const trx = await this.knex.transaction()
    //query to update account_owner balance
    try {
      const ownerQuery = trx<AccountStruct>('accounts')
        .update({ balance: this.knex.raw(`balance - ${data.amount}`) })
        .where({ id: data.owner.id })
        .andWhereRaw(`balance >= ${data.amount}`)
        .returning('*')
        .then((res) => res[0])
      //query to update account_target balance
      const targetQuery = await trx<AccountStruct>('accounts')
        .update({ balance: this.knex.raw(`balance + ${data.amount}`) })
        .where({ id: data.target.id })
        .returning('*')
        .then((res) => res[0])
      //query to insert transaction
      const transfer = await trx
        .insert({
          id: data.id,
          origin_id: data.owner.id,
          target_id: data.target.id,
          amount: data.amount,
          created_at: data.created_at,
        })
        .into('transfers')
        .returning('*')
      await ownerQuery
      await targetQuery
      await transfer
      await trx.commit()
    } catch (error) {
      await trx.rollback(error)
    }
  }
  public async withdraw(id: string, amount: number): Promise<Account> {
    const account = await this.knex<AccountStruct>('accounts')
      .update({ balance: this.knex.raw(`balance - ${amount}`) })
      .where({ id })
      .andWhereRaw(`balance >= ${amount}`)
      .returning('*')
      .then((res) => res[0])
    return AccountMapper.toDomain(account)
  }

  public async findbyEmail(email: string): Promise<Account | undefined> {
    const account = await this.knex<AccountStruct>('accounts')
      .where({ email })
      .first()
    if (!account) return undefined
    return AccountMapper.toDomain(account)
  }
  public async findbyId(id: string): Promise<Account | undefined> {
    const account = await this.knex<AccountStruct>('accounts')
      .where({ id })
      .first()
    if (!account) return undefined
    return AccountMapper.toDomain(account)
  }
  exists: (email: string) => Promise<boolean>

  public async save(data: Account) {
    const account = await AccountMapper.toPersistence(data)
    await this.knex('accounts').insert(account)
  }
}
