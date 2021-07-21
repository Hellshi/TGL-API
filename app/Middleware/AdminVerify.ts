/* eslint-disable @typescript-eslint/naming-convention */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminVerify {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const { is_admin } = await auth.use('api').authenticate()
    if (!is_admin) {
      return response
        .status(501)
        .json(
          "You're not authorized acess this page, please contact our team for more information at: 4008-8922"
        )
    }
    console.log(is_admin)
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
