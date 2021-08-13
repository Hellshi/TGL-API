import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Authenticte a user', () => {
  test('ensure user with valid credentials is authenticated', async (assert) => {
    const password = '123456'

    const User = await UserFactory.merge({ password: password }).create()

    const { text, body } = await supertest(BASE_URL).post('/login').send({
      email: User.email,
      password: password,
    })

    const { user, token } = body

    assert.equal(user.name, User.name)
    assert.exists(token)
    assert.isNotEmpty(token)
  }).timeout(6000)
})
