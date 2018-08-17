require('dotenv').config()
// var path = require('path')
var express = require('express')
// var webpack = require('webpack')
var faker = require('faker')
var AccessToken = require('twilio').jwt.AccessToken
var VideoGrant = AccessToken.VideoGrant
require('./Secrets')
console.log(process.env)

var app = express()

// if (process.env.NODE_ENV === 'DEV') {
//   // Configuration for development environment

//   var webpackDevMiddleware = require('webpack-dev-middleware')
//   var webpackHotMiddleware = require('webpack-hot-middleware')
//   var webpackConfig = require('./webpack.config.js')
//   const webpackCompiler = webpack(webpackConfig)
//   app.use(
//     webpackDevMiddleware(webpackCompiler, {
//       hot: true
//     })
//   )
//   app.use(webpackHotMiddleware(webpackCompiler))
//   app.use(express.static(path.join(__dirname, 'app')))
// } else if (process.env.NODE_ENV === 'PROD') {
//   // Configuration for production environment
//   app.use(express.static(path.join(__dirname, 'dist')))
// }

app.use(function(req, res, next) {
  console.log('Request from: ', req.url)
  next()
})

console.log(process.env)
// Endpoint to generate access token
app.get('/token', function(request, response) {
  var identity = faker.name.findName()

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  var token = new AccessToken(
    process.env.ACCOUNT_SID,
    process.env.API_KEY_SID,
    process.env.API_KEY_SECRET
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

// var port = process.env.PORT || 3000
var port = 4000
app.listen(port, function() {
  console.log('Express server listening on *:' + port)
})
