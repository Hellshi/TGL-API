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
    game_type: 'Mega-Sena',
    description: 'A description',
    range: 60,
    price: 5,
    max_number: 6,
    color: '#ffff',
    min_cart_value: 2,
  }

  const numbers: number[] = []

  while (numbers.length < game.max_number) {
    const randomNumber = Math.floor(Math.random() * game.range)

    if (numbers.indexOf(randomNumber) === -1 && randomNumber > 0) {
      numbers.push(randomNumber)
    }
  }
  test('A bet is made when valid data is provided', async () => {
    await supertest(BASE_URL)
      .post('/admin/create-game')
      .set('Authorization', `Bearer ${token}`)
      .send(game)
      .expect(200)

    await supertest(BASE_URL)
      .post('/bet/new-bet/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        games: [
          {
            numbers: numbers,
            id: 2,
          },
        ],
      })
      .expect(200)
  })
})
