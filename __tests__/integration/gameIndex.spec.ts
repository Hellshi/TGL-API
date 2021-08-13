/* eslint-disable @typescript-eslint/naming-convention */
import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

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

  test('A game is shown', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .get('/all-games')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const { game_type } = body[0]
    assert.exists(game_type)
  })
})
