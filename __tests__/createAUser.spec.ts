import faker, { fake } from 'faker'
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

  test('ensure user with invalid name is returns error message', async (assert) => {
    const email = faker.internet.email()

    const User = await supertest(BASE_URL)
      .post('/user/create')
      .send({
        name: '',
        password: faker.internet.password(),
        email: email,
      })
      .expect(422)

    const {
      body: { errors },
    } = User

    assert.equal(errors[0].message, 'The name is required to create a new account')
    assert.equal(errors[0].field, 'name')
    assert.equal(errors[0].rule, 'required')
  })

  test('ensure user with invalid password is returns error message', async (assert) => {
    const email = faker.internet.email()

    const User = await supertest(BASE_URL)
      .post('/user/create')
      .send({
        name: faker.name.findName(),
        password: '',
        email: email,
      })
      .expect(422)

    const {
      body: { errors },
    } = User

    assert.equal(errors[0].message, 'The password is required to create a new account')
    assert.equal(errors[0].field, 'password')
    assert.equal(errors[0].rule, 'required')
  })

  test('ensure user with invalid email is returns error message', async (assert) => {
    const User = await supertest(BASE_URL)
      .post('/user/create')
      .send({
        name: faker.name.findName(),
        password: faker.internet.password(),
        email: '',
      })
      .expect(422)

    const {
      body: { errors },
    } = User

    assert.equal(errors[0].message, 'The email is required to create a new account')
    assert.equal(errors[0].field, 'email')
    assert.equal(errors[0].rule, 'required')
  })

  test('ensure user with invalid data is not registered', async (assert) => {
    const User = await supertest(BASE_URL)
      .post('/user/create')
      .send({
        name: '',
        password: '',
        email: '',
      })
      .expect(422)

    const {
      body: { errors },
    } = User

    assert.equal(errors[0].message, 'The email is required to create a new account')
    assert.equal(errors[0].field, 'email')
    assert.equal(errors[0].rule, 'required')
  })
})
