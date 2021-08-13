import User from 'App/Models/user'
import { UserFactory } from 'Database/factories'
import test from 'japa'

test.group('Example', () => {
  test('ensure user password gets hashed during save', async (assert) => {
    const password = '123456'

    const user = await UserFactory.merge({ password: password }).create()
    //console.log(user)
    assert.ok<User>(user)
  }).timeout(6000)
})
