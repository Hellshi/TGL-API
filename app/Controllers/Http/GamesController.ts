/* eslint-disable @typescript-eslint/naming-convention */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ValidateGame from 'App/Validators/GameValidator'
import UpdateValidateGame from 'App/Validators/UpdateGameValidator'
import Game from 'App/Models/Game'

export default class GamesController {
  public async createGame({ request }: HttpContextContract) {
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

  public async deleteGame({ request }: HttpContextContract) {
    const { gameId } = request.params()

    const game = await Game.findByOrFail('id', gameId)

    await game.delete()

    return 'You can create a new game to substitute the last one!'
  }

  public async updateGame({ request }: HttpContextContract) {
    const { gameId } = request.params()
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
    await game.save()

    return game
  }

  public async index() {
    const games = await Game.query().select('*')
    return games
  }
}
