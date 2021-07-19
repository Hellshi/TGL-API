import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateUser from 'App/Validators/CreateUserValidator'
import User from 'App/Models/user'

export default class UsersController {
  public async create({ request }: HttpContextContract) {
    const data = request.only(['email', 'password', 'name'])

    await request.validate(CreateUser)

    const user = await User.create(data)
    return user
  }

  public async update({ request }: HttpContextContract) {
    const data = request.only(['email', 'password', 'name'])

    await request.validate(CreateUser)
  }
}
