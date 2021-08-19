/* eslint-disable @typescript-eslint/naming-convention */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Informational from 'App/Mailers/Informational'

import User from 'App/Models/user'

export default class AdminController {
  public async promoteUser({ request }: HttpContextContract) {
    const { id } = request.params()

    const user = await User.findByOrFail('id', id)

    user.is_admin = !user.is_admin

    await user.save()

    return user
  }

  public async deleteUser({ request }: HttpContextContract) {
    const { id } = request.params()

    const user = await User.findByOrFail('id', id)

    await new Informational(user).send()

    await user.delete()

    return 'Success'
  }

  public async index() {
    const users = User.query().select('*').preload('picture').orderBy('is_admin', 'desc')
    return users
  }
}
