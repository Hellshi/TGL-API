import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Game from 'App/Models/Game'

export default class Bet extends BaseModel {
  @belongsTo(() => Game)
  public type: BelongsTo<typeof Game>

  @column({ isPrimary: true })
  public id: number

  @column()
  public choosen_numbers: string

  @column()
  public user_id: number

  @column()
  public price: number

  @column()
  public game_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
