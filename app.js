const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const secrets = require('./secrets')
const firebase = require('./fire')
const bluebird = require('bluebird')

// Twilio Credentials
const accountSid = secrets.TWILIOCLIENTSID
const authToken = secrets.TWILIOAUTHTOKEN

//require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken)

//middleware
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//listen
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log('listening on port', port)
})

//authenticate with firebase
firebase.auth().onAuthStateChanged(user => user || firebase.auth().signInAnonymously())

//listen for changes to sms
firebase.database().ref('sms').on('child_added', function(snapshot) {
  const targetPhone = snapshot.val().targetPhone
  const messageBody = snapshot.val().messageBody

  client.messages.create({
    to: targetPhone,
    from: '+18316618986',
    body: messageBody
  })
  .then(() => {
    firebase.database().ref('sms').remove()
  })
})

app.get('/', (req, res, next) => {
  res.send("shaniqua don't live here no more")
})
