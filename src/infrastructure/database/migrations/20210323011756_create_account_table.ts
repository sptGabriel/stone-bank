import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {	
	return knex.schema.hasTable('accounts').then(exists => {
		if (exists) return;
		return knex.schema.createTable('accounts', async table => {
			table.uuid('id').notNullable().primary();
			table.string('name').notNullable();
			table.string('email', ).notNullable();
			table.string('password').notNullable();
			table.decimal('balance').notNullable();
			table.timestamps(false, true);
			await knex.raw(`
			CREATE TRIGGER update_timestamp
			BEFORE UPDATE
			ON accounts
			FOR EACH ROW
			EXECUTE PROCEDURE update_timestamp();
		`);
		})
	})
}


export async function down(knex: Knex): Promise<void> {
}

