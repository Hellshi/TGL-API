import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateUser from 'App/Validators/CreateUserValidator'
import UpdateUser from 'App/Validators/UpdateUserValidator'
import User from 'App/Models/user'

export default class UsersController {
  public async create({ request }: HttpContextContract) {
    const data = request.only(['email', 'password', 'name'])

    await request.validate(CreateUser)

    const user = await User.create(data)
    return user
  }

  public async update({ request, auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()

    const user = await User.findByOrFail('id', id)

    await request.validate(UpdateUser)

    const data = request.only(['email', 'password', 'name'])

    await user.merge(data)

    await user.save()

    return user
  }

  public async index({ auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()

    const user = await User.findByOrFail('id', id)

    await user.load('bets', (queryUser) => {
      queryUser
    })

    await user.load('picture', (queryUser) => {
      queryUser
    })

    return user
  }

  public async delete({ auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()

    const user = await User.findByOrFail('id', id)

    await user.delete()

    return "We'll miss u"
  }
}
