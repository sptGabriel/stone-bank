import { Account } from '../account'
import { AccountStruct } from '../account.struct'

export class AccountMapper {
  public static toDomain(raw: AccountStruct) {
    const domain = Account.create({
			id: raw.id,
      balance: raw.balance,
      email: raw.email,
      password: raw.password,
      name: raw.name,
    })
		if(domain.isLeft()) throw domain.value
		return domain.value
  }

	public static async toPersistence(account:Account): Promise<AccountStruct>{
		return {
			id: account.id,
			name: account.name.value,
			email: account.email.value,
			password: await account.password.encrypt(),
			balance: account.balance,
		}
	}
}
