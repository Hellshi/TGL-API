import User from 'App/Models/User'
import test from 'japa'

test.group('Example', () => {
  test('ensure user password gets hashed during save', async (assert) => {
    const password = '123456'

    const user = await User.create({
      name: 'Hell',
      email: 'hell@hell.com',
      password: password,
    })

    const hashed = user.password

    assert.notEqual(hashed, password)
  })
})
