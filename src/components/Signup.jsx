import firebase from 'firebase'
import React, {Component} from 'react'
import db from '../firestore'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import purple from '@material-ui/core/colors/purple'
import Button from '@material-ui/core/Button'
var provider = new firebase.auth.GoogleAuthProvider()

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
  },
  cssLabel: {
    '&$cssFocused': {
      color: purple[500]
    }
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: purple[500]
    }
  },
  bootstrapRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3
    }
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  }
})

class Signup extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  async handleSignup() {
    try {
      const user = await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() =>
          firebase
            .auth()
            .createUserWithEmailAndPassword(
              this.state.email,
              this.state.password
            )
        )
      await db
        .collection('users')
        .doc(user.user.uid)
        .set({
          email: this.state.email,
          username: this.state.username,
          rooms: [],
          codeEditorIds: [],
          profilePicURL:
            'https://upload.wikimedia.org/wikipedia/commons/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg'
        })
      //user authenticated id stored at user.uid
      this.props.history.push('/profile')
    } catch (error) {
      let errorCode = error.code
      if (errorCode === 'auth/weak-password') {
        alert('The password is too weak.')
      }
      console.error(error)
    }
  }

  async handleLogout() {
    try {
      await firebase.auth().signOut()
    } catch (error) {
      console.error(error)
    }
  }

  googleSignup = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken
        // The signed-in user info.
        var user = result.user
        db.collection('users')
          .doc(user.uid)
          .set({
            email: user.email,
            username: user.displayName,
            rooms: [],
            codeEditorIds: [],
            profilePicURL:
              user.photoURL ||
              'https://upload.wikimedia.org/wikipedia/commons/9/93/Default_profile_picture_%28male%29_on_Facebook.jpg'
          })
          .then(() => {
            this.props.history.push('/profile')
          })
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

  render() {
    const {classes} = this.props
    return (
      <div className={classes.container}>
        <FormControl className={classes.margin}>
          <TextField
            id="username-input"
            name="username"
            label="Username"
            className={classes.textField}
            type="username"
            margin="normal"
            onChange={this.handleChange}
          />
        </FormControl>
        <FormControl>
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
          type="submit"
          color="primary"
          onClick={this.handleSignup}
        >
          Signup
        </Button>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          onClick={this.googleSignup}
        >
          Signup with Google
        </Button>
      </div>
    )
  }
}
Signup.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Signup)
