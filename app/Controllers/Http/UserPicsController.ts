import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import UserPic from 'App/Models/UserPic'

export default class UserPicsController {
  public async create({ request, auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    if (!request.file('file')) return

    const upload = request.file('file', { size: '2mb' })!

    const fileName = `${Date.now()}.${upload.subtype}`

    await upload.move(Application.tmpPath('uploads'), {
      name: fileName,
    })

    const file = await UserPic.create({
      file: fileName,
      name: upload.clientName,
      type: upload.type,
      subtype: upload.subtype,
      user_id: id,
    })

    return file
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const file = await UserPic.findByOrFail('id', id)
    return response.download(Application.tmpPath(`uploads/${file.file}`))
  }
}
