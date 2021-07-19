import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Bets extends BaseSchema {
  protected tableName = 'bets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('choosen_numbers').nullable()
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .integer('game_id')
        .references('id')
        .inTable('games')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table.float('price').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
