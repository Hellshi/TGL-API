import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Authenticte a user', async () => {
  const password = '123456'

  const Admin = await UserFactory.merge({ password: password, is_admin: true }).create()
  const User = await UserFactory.merge({ password: password }).create()

  const {
    body: {
      token: { token },
    },
  } = await supertest(BASE_URL).post('/login').send({
    email: Admin.email,
    password: password,
  })
  test('ensure admin users are authorized', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .get('/admin/all-users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    const { errors } = body
    assert.notEqual(body, errors)
  })

  test('ensure not admin users are unauthorized', async (assert) => {
    const {
      body: {
        token: { token },
      },
    } = await supertest(BASE_URL).post('/login').send({
      email: User.email,
      password: password,
    })

    const { body } = await supertest(BASE_URL)
      .get('/admin/all-users')
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    const { errors } = body
    assert.equal(
      errors[0].message,
      "You're not authorized acess this page, please contact our team for more information at: 4008-8922"
    )
  })
})
