import firebase from 'firebase'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {FormControl, Button, TextField, Snackbar} from '@material-ui/core'
import Notification from './Notification'
import MaterialUIForm from 'material-ui-form'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '10%'
  },
  margin: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
})

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

  handleLogin = async ev => {
    // preventDefault(ev)
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
    var provider = new firebase.auth.GoogleAuthProvider()

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken
        // The signed-in user info.
        var user = result.user

        this.props.history.push('/profile')
      })
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential
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
      // <div className={classes.container}>
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
          variant="contained"
          color="primary"
          type="submit"
          onClick={this.handleLogin}
        >
          Login
        </Button>
        <Button id="google" onClick={this.googleSignup}>
          <img src="/btn_google_signin_light_pressed_web.png" id="google" />
        </Button>

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
      // </div>
    )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Login)
