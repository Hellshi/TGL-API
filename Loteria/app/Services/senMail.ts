import User from 'App/Models/User'
import Producer from '../../kafkaServices/Producer'

const SendMail = async () => {
  const admins = await User.query().select('email').where('is_admin', true)

  const producer = new Producer()

  admins.forEach(async (admin) => {
    const { email } = admin.$attributes
    await producer.Producer({
      topic: 'email-handler',
      messages: [{ value: email }],
    })
  })
}

export default SendMail
