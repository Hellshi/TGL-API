/* eslint-disable @typescript-eslint/naming-convention */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/user'

export default class BetsController {
  public async create({ request, auth, response }: HttpContextContract) {
    const { gameId } = request.params()

    const { id } = await auth.use('api').authenticate()
    const user = await User.findByOrFail('id', id)

    const game = await Game.findByOrFail('id', gameId)

    const { choosen_nums }: { choosen_nums: number[] } = request.only(['choosen_nums'])

    if (choosen_nums.length > game.max_number || choosen_nums.length < game.max_number) {
      return response
        .status(400)
        .json({ error: { menssage: `This game only allows ${game.max_number} numbers choosen` } })
    }

    choosen_nums.forEach((number) => {
      if (number > game.range) {
        return response.status(400).json({
          error: {
            mensage: `This game only ranges to ${number} is bigger than the maximum game range (${game.range}), please choose another one`,
          },
        })
      }
    })
    const choosen_numbers = choosen_nums.join(',')
    const bet = await Bet.create({
      choosen_numbers,
      user_id: id,
      game_id: gameId,
      price: game.price,
    })

    await Mail.send((message) => {
      message.from('TGL team').subject('New Bet!').to(user.email).htmlView('emails/new_bet', {
        name: user.name,
        numbers: choosen_numbers,
      })
    })

    return bet
  }
}
