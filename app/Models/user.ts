import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import UserPic from 'App/Models/UserPic'
import Bets from 'App/Models/Bet'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @hasOne(() => UserPic, {
    foreignKey: 'user_id',
  })
  public pic: HasOne<typeof UserPic>

  @hasMany(() => Bets, {
    foreignKey: 'user_id',
  })
  public bets: HasMany<typeof Bets>

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public is_admin: boolean

  @column()
  public name: string

  @column()
  public token: string

  @column()
  public token_created_at: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
