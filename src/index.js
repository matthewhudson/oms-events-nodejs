const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { EventManager } = require('./event-manager')

const { PORT = 8080 } = process.env

const manager = new EventManager()

app.use(bodyParser.json())

app.post('/events', (request, response) => {
  const { id, endpoint, event, data } = request.body
  response.json({ success: manager.subscribe(id, endpoint, event, data) })
})

app.delete('/events', (request, response) => {
  const { id, event } = request.body
  response.json({ success: manager.subscribe(id, event) })
})

app.post('/publish', (request, response) => {
  const { eventName, user, data } = request.body
  data.user = user
  response.json({ success: manager.publish(eventName, data) })
})

app.get('/health', (req, res) => res.send('OK'))

// heartbeat events
setInterval(() => {
  manager.publish('heartbeat', { user: 'max', time: new Date().toString() })
}, 3000)

setInterval(() => {
  manager.publish('heartbeat', { user: 'moritz', time: new Date().toString() })
}, 5000)

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
