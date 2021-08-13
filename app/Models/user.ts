import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import UserPic from 'App/Models/UserPic'
import Bets from 'App/Models/Bet'
import Welcome from 'App/Mailers/Welcome'
import WelcomeAdmin from 'App/Mailers/WelcomeAdmin'
import Goodbye from 'App/Mailers/Goodbye'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
  hasMany,
  HasMany,
  afterSave,
  afterDelete,
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @hasOne(() => UserPic, {
    foreignKey: 'user_id',
  })
  public picture: HasOne<typeof UserPic>

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
  public token: string | undefined

  @column()
  public token_created_at: Date | undefined

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

  /*   @afterSave()
  public static async sendEmail(user: User) {
    await new Welcome(user).sendLater()
  }

  @afterSave()
  public static async updateAccount(user: User) {
    if (user.is_admin) {
      await new WelcomeAdmin(user).sendLater()
    }
  } */

  @afterDelete()
  public static async sendDeleteMail(user: User) {
    await new Goodbye(user).send()
  }
}
