import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/user'

export default class UserPic extends BaseModel {
  @belongsTo(() => User, {
    foreignKey: 'id',
  })
  public userId: BelongsTo<typeof User>

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column()
  public name: string

  @column()
  public type: string

  @column()
  public subtype: string

  @column()
  public file: string

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get url() {
    return `http://10.0.0.106:3333/file/${this.id}`
  }
}
