import User from 'App/Models/User'
import { UserFactory } from 'Database/factories'
import test from 'japa'

test.group('Example', () => {
  test('ensure user password gets hashed during save', async (assert) => {
    const password = '123456'

    const user = await UserFactory.merge({ password: '123456' }).create()
    assert.notEqual(user.password, password)
  })
})
