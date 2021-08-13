import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Authenticte a user', async () => {
  const password = '123456'

  const User = await UserFactory.merge({ password: password }).create()

  test('ensure user with valid credentials is authenticated', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: User.email,
        password: password,
      })
      .expect(200)

    const { user, token } = body

    assert.equal(user.email, User.email)
    assert.exists(token)
    assert.isNotEmpty(token)
  })

  test('ensure that user with invalid credentials is unauthorized', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: User.email,
        password: '',
      })
      .expect(400)

    const { errors } = body

    assert.equal(errors[0].message, 'Invalid user credentials')
  })
})
