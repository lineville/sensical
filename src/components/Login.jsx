import React, {Component} from 'react'
import firebase from 'firebase'
import GoogleButton from 'react-google-button'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {FormControl, Button, TextField, Snackbar} from '@material-ui/core'
import {Notification} from '../imports'
import MaterialUIForm from 'material-ui-form'
import styles from '../styles/LoginStyles'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      snackBarOpen: false,
      snackBarVariant: '',
      snackBarMessage: ''
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleLogin = async () => {
    try {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      await firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)

      this.props.history.push('/profile')
    } catch (error) {
      let errorCode = error.code
      if (errorCode === 'auth/weak-password') {
        this.setState({
          snackBarOpen: true,
          snackBarVariant: 'error',
          snackBarMessage:
            'Sorry that password is weak, try something a bit stronger.'
        })
      }
      this.setState({
        snackBarOpen: true,
        snackBarVariant: 'error',
        snackBarMessage: `Sorry about that. It seems there was an error while logging in...Error: ${
          error.message
        }`
      })
    }
  }

  googleSignup = () => {
    let provider = new firebase.auth.GoogleAuthProvider()

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(() => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // let token = result.credential.accessToken
        // // The signed-in user info.
        // let user = result.user

        this.props.history.push('/profile')
      })
      .catch(error => {
        // Handle Errors here.
        // let errorCode = error.code
        // let errorMessage = error.message
        // // The email of the user's account used.
        // let email = error.email
        // // The firebase.auth.AuthCredential type that was used.
        // let credential = error.credential
        this.setState({
          snackBarOpen: true,
          snackBarVariant: 'error',
          snackBarMessage:
            'Sorry we received the following error attempting to log in through google:\n' +
            error.message
        })
        console.log(error.message)
        // ...
      })
  }

  handleLogout = async () => {
    try {
      await firebase.auth().signOut()
      this.props.history.push('/')
    } catch (error) {
      this.setState({
        snackBarOpen: true,
        snackBarVariant: 'error',
        snackBarMessage: 'Sorry there was an error while logging out.'
      })
      console.error(error)
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      snackBarOpen: false
    })
  }

  render() {
    const {classes} = this.props
    return (
      <MaterialUIForm onSubmit={this.handleLogin} className={classes.container}>
        <FormControl className={classes.margin}>
          <TextField
            id="email-input"
            name="email"
            label="Email"
            className={classes.textField}
            type="email"
            margin="normal"
            onChange={this.handleChange}
          />
        </FormControl>
        <FormControl className={classes.margin}>
          <TextField
            id="password-input"
            label="Password"
            name="password"
            className={classes.textField}
            onChange={this.handleChange}
            type="password"
            autoComplete="current-password"
            margin="normal"
          />
        </FormControl>
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          onClick={this.handleLogin}
        >
          Login
        </Button>
        <p>or</p>
        <GoogleButton onClick={this.googleSignup} />

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={4000}
          onClose={this.handleClose}
        >
          <Notification
            onClose={this.handleClose}
            variant={this.state.snackBarVariant}
            message={this.state.snackBarMessage}
          />
        </Snackbar>
      </MaterialUIForm>
    )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Login)
