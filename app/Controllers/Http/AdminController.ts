/* eslint-disable @typescript-eslint/naming-convention */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'

import User from 'App/Models/user'

export default class AdminController {
  public async promoteUser({ request, auth }: HttpContextContract) {
    const { is_admin } = await auth.use('api').authenticate()
    if (!is_admin) {
      return "You're not authorized promote a user to admin, contact our team for more information at: 4008-8922"
    }
    const { id } = request.params()

    const user = await User.findByOrFail('id', id)

    user.is_admin = !user.is_admin

    await user.save()

    return user
  }

  public async deleteUser({ request, auth }: HttpContextContract) {
    const { is_admin } = await auth.use('api').authenticate()
    if (!is_admin) {
      return "You're not authorized delete a user, contact our team for more information at: 4008-8922"
    }
    const { id } = request.params()

    const user = await User.findByOrFail('id', id)

    await Mail.send((message) => {
      message
        .from('TGL team')
        .subject('Your account has been terminated')
        .to(user.email)
        .htmlView('emails/informational', {
          name: user.name,
        })
    })

    await user.delete()

    return 'Success'
  }

  public async index() {
    const users = User.query().select('*')
    return users
  }
}
