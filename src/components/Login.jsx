import firebase from 'firebase'
import React, {Component} from 'react'
import '../App.css'
import db from '../firestore'

class Login extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  authStateChange(event) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user:', user)
        document.getElementById('logout').classList.remove('hide')
      } else {
        console.log('not logged in')
        document.getElementById('logout').classList.add('hide')
      }
    })
  }

  async handleLogin(event) {
    try {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
      console.log('logged in', user)
      this.props.history.push('/Profile')
    } catch (error) {
      var errorCode = error.code
      var errorMessage = error.message
      if (errorCode === 'auth/weak-password') {
        alert('The password is too weak.')
      } else {
        alert(errorMessage)
      }
      console.log(error)
    }
  }

  async handleLogout() {
    try {
      await firebase.auth().signOut()
      console.log('logged out')
    } catch (error) {
      console.log('could not log out')
      console.error(error)
    }
  }

  render() {
    return (
      <div className="column auth-form App">
        <input
          className="input"
          type="text"
          name="username"
          placeholder="username"
          onChange={this.handleChange}
        />
        <input
          className="input"
          type="text"
          name="email"
          placeholder="email"
          onChange={this.handleChange}
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="password"
          onChange={this.handleChange}
        />
        <div className="field is-grouped is-grouped-right">
          <p className="control">
            <button
              type="submit"
              id="login"
              onClick={this.handleLogin}
              className="button is-primary"
            >
              Login
            </button>
          </p>
          <p className="control">
            <button
              type="submit"
              id="logout"
              onClick={this.handleLogout}
              className="button is-primary"
            >
              Logout
            </button>
          </p>
        </div>
      </div>
    )
  }
}

export default Login
