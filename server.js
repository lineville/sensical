require('dotenv').config()
// var path = require('path')
var express = require('express')
// var webpack = require('webpack')
var faker = require('faker')
var AccessToken = require('twilio').jwt.AccessToken
var VideoGrant = AccessToken.VideoGrant
const path = require('path')

if (process.env.NODE_ENV === 'DEV') {
  require('./secrets')
}

var app = express()

app.use(function(req, res, next) {
  console.log('Request from: ', req.url)
  next()
})

app.use(express.static(path.join(__dirname, 'build')))

// Endpoint to generate access token
app.get('/token', function(request, response) {
  var identity = faker.name.findName()

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  var token = new AccessToken(
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

var port = process.env.PORT || 4000
app.listen(port, function() {
  console.log('Express server listening on *:' + port)
})
