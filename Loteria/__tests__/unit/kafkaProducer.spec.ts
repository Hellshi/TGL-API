import Producer from '../../kafkaServices/Producer'
import test from 'japa'

test.group('Kafka Producer Test', async () => {
  const producer = new Producer()
  test('Sucess = true when a value is provided', async (assert) => {
    const response = await producer.Producer({
      topic: 'email-handler',
      messages: [{ value: 'Bohemian Rhapsody' }],
    })
    const { sucess } = response
    assert.equal(sucess, true)
  })

  test('Sucess = false when no value is provided', async (assert) => {
    const response = await producer.Producer({
      topic: 'email-handler',
      messages: [],
    })
    const { sucess } = response
    assert.equal(sucess, false)
  })

  test('Sucess = false when an empty topic is provided', async (assert) => {
    const response = await producer.Producer({
      topic: '',
      messages: [{ value: 'Bohemian Rhapsody' }],
    })
    const { sucess } = response
    assert.equal(sucess, false)
  })
})
