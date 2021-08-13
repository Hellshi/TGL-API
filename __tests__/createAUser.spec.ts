import User from 'App/Models/user'
import { UserFactory } from 'Database/factories'
import test from 'japa'

test.group('Create a user', () => {
  test('ensure user is created', async (assert) => {
    const password = '123456'

    const user = await UserFactory.merge({ password: password }).create()
    assert.ok<User>(user)
  })
})
