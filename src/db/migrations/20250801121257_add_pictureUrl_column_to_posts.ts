import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('posts', table => {
    table.string('pictureUrl').nullable();
  });
  await knex('posts').update({ pictureUrl: '' }).whereNull('pictureUrl');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('posts', table => {
    table.dropColumn('pictureUrl');
  });
}
