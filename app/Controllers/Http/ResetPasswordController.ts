import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import moment from 'moment'
import ResetPassValidator from 'App/Validators/ResetPassValidator'
import PassValidator from 'App/Validators/PassValidator'
import { uuid } from 'uuidv4'
import User from 'App/Models/User'

import Mail from '@ioc:Adonis/Addons/Mail'

export default class ResetPasswordsController {
  public async store({ request }: HttpContextContract) {
    const { email } = request.all()
    await request.validate(ResetPassValidator)
    const user = await User.findByOrFail('email', email)

    user.token = uuid().toString()

    user.token_created_at = new Date()

    await user.save()

    await Mail.send((message) => {
      message
        .from('Hell la hell')
        .subject('reset pass')
        .to(user.email)
        .htmlView('emails/forgot_pass', {
          name: user.name,
          link: `http://127.0.0.1:3333/reset/${user.token}`,
        })
    })

    return user
  }

  public async update({ request, response }: HttpContextContract) {
    const { token } = request.params()

    const user = await User.findByOrFail('token', token)

    const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at)
    if (tokenExpired) {
      return response.status(401).send({ error: { message: 'Opss parece que seu token expirou' } })
    }

    const { password } = request.all()

    await request.validate(PassValidator)

    user.password = password
    user.token_created_at = undefined
    user.token = undefined

    await user.save()

    return user
  }
}
