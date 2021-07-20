/* eslint-disable @typescript-eslint/naming-convention */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/user'

export interface choosen {
  nums: number[]
  id: number
}

export default class BetsController {
  public async create({ request, auth, response }: HttpContextContract) {
    const { gameId } = request.params()

    const { id } = await auth.use('api').authenticate()
    const user = await User.findByOrFail('id', id)

    const GameBase = await Game.findByOrFail('id', gameId)

    const { games }: { games: choosen[] } = request.only(['games'])

    games.forEach((game) => {
      const nums = game.nums
      if (nums.length > GameBase.max_number || nums.length < GameBase.max_number) {
        return response.status(400).json({
          error: { menssage: `This game only allows ${GameBase.max_number} numbers choosen` },
        })
      }

      nums.forEach((number) => {
        if (number > GameBase.range) {
          return response.status(400).json({
            error: {
              mensage: `This game only ranges to ${number} is bigger than the maximum game range (${GameBase.range}), please choose another one`,
            },
          })
        }
      })
      const choosen_numbers = nums.join(',')
      try {
        Bet.create({
          choosen_numbers,
          user_id: id,
          game_id: gameId,
          price: GameBase.price,
        })
      } catch (err) {
        console.log(err)
      }
    })

    await Mail.send((message) => {
      message.from('TGL team').subject('New Bet!').to(user.email).htmlView('emails/new_bet', {
        name: user.name,
      })
    })

    return 'success'
  }

  public async update({ request, response }: HttpContextContract) {
    const { betId } = request.params()
    const { gameId } = request.params()

    const bet = await Bet.findByOrFail('id', betId)

    const { choosen_nums }: { choosen_nums: number[] } = request.only(['choosen_nums'])

    const game = await Game.findByOrFail('id', gameId)

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

    const update = await bet.merge({ choosen_numbers, game_id: gameId, price: game.price })

    return update
  }

  public async delete({ request }: HttpContextContract) {
    const { betId } = request.params()
    const bet = await Bet.findByOrFail('id', betId)

    await bet.delete()
    return 'sucess'
  }
}
