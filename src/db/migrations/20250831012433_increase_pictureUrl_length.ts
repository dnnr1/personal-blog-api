import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('posts', table => {
    table.text('pictureUrl').alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('posts', table => {
    table.string('pictureUrl', 255).alter();
  });
}
