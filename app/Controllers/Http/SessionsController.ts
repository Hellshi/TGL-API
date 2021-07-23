import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/user'

export default class SessionsController {
  public async session({ request, auth }: HttpContextContract) {
    const { email, password } = request.all()
    const user = await User.findByOrFail('email', email)
    await user.load('picture', (queryUser) => {
      queryUser
    })
    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '7days',
    })

    return { user, token }
  }
}
