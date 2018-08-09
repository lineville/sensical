import firebase from 'firebase'
import React, {Component} from 'react'
import '../App.css'
import db from '../firestore'

class Auth extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
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

  async handleSignup(event) {
    try {
      const user = await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
      console.log('signed up', user)
      db.collection('fireUsers').add(user)
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

  async handleLogin(event) {
    try {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
      console.log('logged in', user)
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
      <div className="auth-form App">
        <input
          type="username"
          name="username"
          placeholder="username"
          onChange={this.handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="email"
          onChange={this.handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={this.handleChange}
        />
        <button type="submit" id="signup" onClick={this.handleSignup}>
          Signup
        </button>
        <button type="submit" id="login" onClick={this.handleLogin}>
          Login
        </button>
        <button
          type="submit"
          id="logout"
          className=""
          onClick={this.handleLogout}
        >
          Logout
        </button>
      </div>
    )
  }
}

export default Auth
