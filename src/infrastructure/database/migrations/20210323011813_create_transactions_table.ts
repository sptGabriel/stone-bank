import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.hasTable('transfers').then((exists) => {
    if (exists) return
    return knex.schema.createTable('transfers', async (table) => {
      table.uuid('id').notNullable().primary()
      table.uuid('origin_id').references('accounts.id').notNullable()
      table.uuid('target_id').references('accounts.id')
      table.decimal('amount').notNullable()
      table.timestamps(false, true)
      await knex.raw(`
			CREATE TRIGGER update_timestamp
			BEFORE UPDATE
			ON transfers
			FOR EACH ROW
			EXECUTE PROCEDURE update_timestamp();
		`)
    })
  })
}

export async function down(knex: Knex): Promise<void> {}
