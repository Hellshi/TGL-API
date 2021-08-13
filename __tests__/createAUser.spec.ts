import faker from 'faker'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Create a user', () => {
  test('ensure user with valid data is created', async (assert) => {
    const email = faker.internet.email()

    const User = await supertest(BASE_URL)
      .post('/user/create')
      .send({
        name: faker.name.findName(),
        password: faker.internet.password(),
        email: email,
      })
      .expect(200)
    const { body } = User
    const { user, token } = body

    assert.equal(user.email, email)
    assert.exists(token)
    assert.isNotEmpty(token)
  })
})
