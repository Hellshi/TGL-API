import Hash from '@ioc:Adonis/Core/Hash'
const validate = async (user, data, confirmation) => {
  if (data.email !== user.email) {
    return { sucess: false, message: 'Email does not match' }
  }

  if (data.password || confirmation.oldPassword || confirmation.ConfirmPassword) {
    const match = await Hash.verify(user.password, confirmation.oldPassword)
    if (!match) {
      return { sucess: false, message: 'Opps old pass does not match' }
    }
    if (confirmation.oldPassword && confirmation.ConfirmPassword !== data.password) {
      return { sucess: false, message: ' Confirm password does not match' }
    }
  }
  if (data.password === '') {
    data.password = user.password
  }
  if (data.name === '') {
    data.name = user.name
  }
}
export default validate
