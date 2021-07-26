/* eslint-disable @typescript-eslint/naming-convention */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import User from 'App/Models/user'
import NewBet from 'App/Mailers/NewBet'

export interface choosen {
  numbers: number[]
  id: number
}

export default class BetsController {
  public async create({ request, auth, response }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const user = await User.findByOrFail('id', id)

    const { games }: { games: choosen[] } = request.only(['games'])
    const prices = games.map(async (game) => {
      const GameBase = await Game.findByOrFail('id', game.id)
      const nums = game.numbers
      if (nums.length > GameBase.max_number || nums.length < GameBase.max_number) {
        return response.status(400).json({
          error: {
            menssage: `This ${GameBase.game_type} only allows ${GameBase.max_number} numbers choosen`,
          },
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
      await Bet.create({
        choosen_numbers,
        user_id: id,
        game_id: GameBase.id,
        price: GameBase.price,
      })
      return GameBase.price
    })
    const allPrices = await Promise.all(prices)
    let totalPrice: number =
      allPrices.reduce((total: number, current: number) => {
        return total + current
      }, 0) || 0
    const price = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    await new NewBet(user, price).send()

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

  public async index({ auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const bets = await Bet.query().where('user_id', id).preload('type')
    return bets
  }
}
