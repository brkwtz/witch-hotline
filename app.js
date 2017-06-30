const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const secrets = require('./secrets')

// Twilio Credentials
const accountSid = secrets.TWILIOCLIENTSID
const authToken = secrets.TWILIOAUTHTOKEN

//require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken)

//middleware
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/public')))

//listen
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('listening on some port')
})

app.get('/', (req, res, next) => {
  res.send("shaniqua don't live here no more")
})

app.post('/', (req, res, next) => {
  client.messages.create({
    to: '+1' + req.body.targetPhone,
    from: '+18316618986',
    body: req.body.messageBody
  })
  .then(message => res.send(message.sid))
})
