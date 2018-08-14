import React from 'react'
import ReactDOM from 'react-dom'
import {Router} from 'react-router-dom'
import history from './history'
import {AuthProvider} from 'fireview'
import firebase from 'firebase'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
  <AuthProvider auth={firebase.auth()}>
    <Router history={history}>
      <App />
    </Router>
  </AuthProvider>,
  document.getElementById('root')
)
registerServiceWorker()
