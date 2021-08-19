/* eslint-disable @typescript-eslint/naming-convention */
import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'
import BASE_URL from '../utils/base'

test.group('Games CRUD', async () => {
  const password = '123456'

  const Admin = await UserFactory.merge({ password: password, is_admin: true }).create()

  const {
    body: {
      token: { token },
    },
  } = await supertest(BASE_URL).post('/login').send({
    email: Admin.email,
    password: password,
  })

  const game = {
    game_type: 'Type',
    description: 'A simple game ',
    range: 20,
    price: 200,
    max_number: 5,
    color: '#ffff',
    min_cart_value: 2,
  }
  test('A game is created when valid data is provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/admin/create-game')
      .set('Authorization', `Bearer ${token}`)
      .send(game)
      .expect(200)
    const { game_type } = body
    assert.exists(game_type)
  })

  test('A game is not created when invalid type is provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/admin/create-game')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_type: '',
        description: game.description,
        range: game.range,
        price: game.price,
        max_number: game.max_number,
        color: game.color,
        min_cart_value: game.min_cart_value,
      })
      .expect(422)
    const { errors } = body
    assert.exists(errors)
  })

  test('A game is not created when invalid description is provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/admin/create-game')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_type: game.game_type,
        description: '',
        range: game.range,
        price: game.price,
        max_number: game.max_number,
        color: game.color,
        min_cart_value: game.min_cart_value,
      })
      .expect(422)
    const { errors } = body
    assert.exists(errors)
  })

  test('A game is not created when invalid range is provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/admin/create-game')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_type: game.game_type,
        description: game.description,
        range: '',
        price: game.price,
        max_number: game.max_number,
        color: game.color,
        min_cart_value: game.min_cart_value,
      })
      .expect(422)
    const { errors } = body
    assert.exists(errors)
  })

  test('A game is not created when invalid price is provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/admin/create-game')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_type: game.game_type,
        description: game.description,
        range: game.range,
        price: '',
        max_number: game.max_number,
        color: game.color,
        min_cart_value: game.min_cart_value,
      })
      .expect(422)
    const { errors } = body
    assert.exists(errors)
  })

  test('A game is not created when invalid maxNumber is provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/admin/create-game')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_type: game.game_type,
        description: game.description,
        range: game.range,
        price: game.price,
        max_number: '',
        color: game.color,
        min_cart_value: game.min_cart_value,
      })
      .expect(422)
    const { errors } = body
    assert.exists(errors)
  })

  test('A game is not created when invalid color is provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/admin/create-game')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_type: game.game_type,
        description: game.description,
        range: game.range,
        price: game.price,
        max_number: game.max_number,
        color: '',
        min_cart_value: game.min_cart_value,
      })
      .expect(422)
    const { errors } = body
    assert.exists(errors)
  })

  test('A game is not created when invalid CartValue is provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/admin/create-game')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_type: game.game_type,
        description: game.description,
        range: game.range,
        price: game.price,
        max_number: game.max_number,
        color: game.color,
        min_cart_value: '',
      })
      .expect(422)
    const { errors } = body
    assert.exists(errors)
  })
})
