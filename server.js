require('dotenv').config()
const express = require('express')
const compression = require('compression')
const faker = require('faker')
const AccessToken = require('twilio').jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant
const path = require('path')

if (process.env.NODE_ENV === 'DEV') {
  require('./secrets')
}

const app = express()
app.use(compression())

app.use(function(req, res, next) {
  console.log('Request from: ', req.url)
  next()
})

app.use(express.static(path.join(__dirname, 'build')))

// Endpoint to generate access token
app.get('/token', function(request, response) {
  const identity = faker.name.findName()

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    process.env.ACCOUNT_SID,
    process.env.API_KEY,
    process.env.API_SECRET
  )

  // Assign the generated identity to the token
  token.identity = identity

  const grant = new VideoGrant()
  // Grant token access to the Video API features
  token.addGrant(grant)

  // Serialize the token to a JWT string and include it in a JSON response
  response.send({
    identity: identity,
    token: token.toJwt()
  })
})

app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'build/index.html'))
})

const PORT = process.env.PORT || 4000
app.listen(PORT, function() {
  console.log(`Express server listening on PORT ${PORT}`)
})
