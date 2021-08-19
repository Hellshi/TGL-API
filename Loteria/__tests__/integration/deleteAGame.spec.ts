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
  test('A game is deleted when valid id is provided', async (assert) => {
    await supertest(BASE_URL)
      .post('/admin/create-game')
      .set('Authorization', `Bearer ${token}`)
      .send(game)

    const { body } = await supertest(BASE_URL)
      .delete(`/admin/delete-game/1`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const { message } = body
    assert.notExists(message)
  })

  test('A error is returned when invalid id is provided during delete', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .delete('/admin/delete-game/55')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)

    const { message } = body
    assert.exists(message)
  })
})
