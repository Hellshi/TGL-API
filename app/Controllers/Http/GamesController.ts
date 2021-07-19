/* eslint-disable @typescript-eslint/naming-convention */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ValidateGame from 'App/Validators/GameValidator'
import UpdateValidateGame from 'App/Validators/UpdateGameValidator'
import Game from 'App/Models/Game'

export default class GamesController {
  public async createGame({ request, auth }: HttpContextContract) {
    const { is_admin } = await auth.use('api').authenticate()
    if (!is_admin) {
      return "You're not authorized to create games, contact our team to request a game"
    }
    const game = request.only([
      'game_type',
      'description',
      'range',
      'price',
      'max_number',
      'color',
      'min_cart_value',
    ])
    await request.validate(ValidateGame)

    await Game.create(game)
    return game
  }

  public async deleteGame({ request, auth }: HttpContextContract) {
    const { is_admin } = await auth.use('api').authenticate()
    if (!is_admin) {
      return "You're not authorized to delete games, contact our team to request a game"
    }

    const { gameId } = request.params()

    const game = await Game.findByOrFail('id', gameId)

    await game.delete()

    return 'You can create a new game to substitute the last one!'
  }

  public async updateGame({ request, auth }: HttpContextContract) {
    const { gameId } = request.params()
    const { is_admin } = await auth.use('api').authenticate()
    if (!is_admin) {
      return "You're not authorized to delete games, contact our team to request a game"
    }

    const updated = request.only([
      'game_type',
      'description',
      'range',
      'price',
      'max_number',
      'color',
      'min_cart_value',
    ])
    await request.validate(UpdateValidateGame)

    const game = await Game.findByOrFail('id', gameId)

    await game.merge(updated)

    return game
  }

  public async index() {
    const games = await Game.query().select('*')
    return games
  }
}
