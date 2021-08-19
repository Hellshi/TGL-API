/* eslint-disable @typescript-eslint/naming-convention */
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Games CRUD', async (group) => {
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

  test('A game is updated when valid data is provided', async (assert) => {
    await supertest(BASE_URL)
      .post('/admin/create-game')
      .set('Authorization', `Bearer ${token}`)
      .send(game)
      .expect(200)

    const { body } = await supertest(BASE_URL)
      .put('/admin/update-game/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_type: 'Um joguinho',
      })
      .expect(200)

    const { game_type } = body
    assert.equal(game_type, 'Um joguinho')
  })

  test('An error is returned when invalid id is provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .put('/admin/update-game/252')
      .set('Authorization', `Bearer ${token}`)
      .send({
        game_type: 'Um joguinho',
      })

    const { message } = body
    assert.exists(message)
  })
})
