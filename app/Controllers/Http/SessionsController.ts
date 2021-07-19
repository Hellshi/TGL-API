import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SessionsController {
  public async session({ request, auth }: HttpContextContract) {
    const { email, password } = request.all()

    const user = await auth.use('api').attempt(email, password, {
      expiresIn: '7days',
    })

    return user
  }
}
