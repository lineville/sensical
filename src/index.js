import {AuthProvider} from 'fireview'
import ReactDOM from 'react-dom'
import React from 'react'
import {Router} from 'react-router-dom'
import history from './history'
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
