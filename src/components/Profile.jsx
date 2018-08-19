import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'

import classNames from 'classnames'
import Avatar from '@material-ui/core/Avatar'
import {withStyles} from '../../node_modules/@material-ui/core'
import Button from '@material-ui/core/Button'
import parallaxStyle from '../styles/parallaxStyle'
import RoomContainer from './RoomContainer'
import Snackbar from '@material-ui/core/Snackbar'
import Notification from './Notification'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

const styles = theme => ({
  row: {
    display: 'flex'
  },
  avatar: {
    margin: 50
  },
  bigAvatar: {
    width: 260,
    height: 260
  },
  card: {
    maxWidth: 345
  },
  margin: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  ...parallaxStyle
})

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      open: false,
      popUpMessageType: '',
      popUpMessage: '',
      emailFormOpen: false,
      passwordFormOpen: false,
      userNameFormOpen: false,
      newEmail: '',
      newPassword: '',
      newUserName: ''
    }
  }

  async componentDidMount() {
    const authorizedUser = await firebase.auth().currentUser
    await db
      .collection('users')
      .doc(authorizedUser.uid)
      .onSnapshot(doc => {
        this.setState({user: {...doc.data(), id: authorizedUser.uid}})
      })
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      open: false,
      emailFormOpen: false,
      passwordFormOpen: false,
      userNameFormOpen: false
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  changeEmail = async () => {
    const user = await firebase.auth().currentUser
    user
      .updateEmail(this.state.newEmail)
      .then(() => {
        this.setState({
          popUpMessage: 'Email successfully updated',
          popUpMessageType: 'success',
          open: true
        })
      })
      .then(() => {
        db.collection('users')
          .doc(user.uid)
          .update({
            email: user.email
          })
      })
      .catch(error => {
        this.setState({
          popUpMessage: error.message,
          popUpMessageType: 'warning',
          open: true
        })
        console.log(error, this.state)
      })
  }

  changePassword = async () => {
    var auth = firebase.auth()
    var emailAddress = await auth.currentUser.email
    auth
      .sendPasswordResetEmail(emailAddress)
      .then(() => {
        this.setState({
          popUpMessage: 'Check your email for password reset!',
          popUpMessageType: 'success',
          open: true
        })
      })
      .catch(function(error) {
        console.log(error)
        this.setState({
          popUpMessage:
            'Sorry about that, it seems there was an error trying to change your password.',
          popUpMessageType: 'error',
          open: true
        })
      })
  }

  changeUsername = async () => {
    const authorizedUser = await firebase.auth().currentUser
    await db
      .collection('users')
      .doc(authorizedUser.uid)
      .update({username: this.state.newUserName})
      .then(() => {
        this.setState({
          userNameFormOpen: false,
          popUpMessageType: 'success',
          popUpMessage: 'Username successfully changed',
          open: true
        })
      })
  }

  render() {
    const {classes, filter, className, style, small} = this.props
    const parallaxClasses = classNames({
      [classes.parallax]: true,
      [classes.filter]: filter,
      [classes.small]: small,
      [className]: className !== undefined
    })
    return (
      <React.Fragment>
        <div
          className={parallaxClasses}
          style={{
            ...style
            // backgroundImage: 'url(' + image + ')'
          }}
        >
          <Avatar
            alt="default prof pic"
            src={this.state.user.profilePicURL}
            className={classNames(classes.avatar, classes.bigAvatar)}
          />
          <div>
            <p>Welcome {this.state.user.username}!</p>
            <p>Email: {this.state.user.email}</p>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => this.setState({emailFormOpen: true})}
            >
              Change Email
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={this.changePassword}
            >
              Change Password
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => this.setState({userNameFormOpen: true})}
            >
              Change Username
            </Button>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              open={this.state.open}
              autoHideDuration={4000}
              onClose={this.handleClose}
            >
              <Notification
                onClose={this.handleClose}
                variant={this.state.popUpMessageType}
                message={this.state.popUpMessage}
              />
            </Snackbar>

            <Dialog
              open={this.state.emailFormOpen}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Change Email</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  name="newEmail"
                  label="Email Address"
                  type="email"
                  fullWidth
                  onChange={this.handleChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="secondary">
                  Cancel
                </Button>
                <Button onClick={this.changeEmail} color="primary">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={this.state.userNameFormOpen}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Change Username</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  name="newUserName"
                  label="Username"
                  type="email"
                  fullWidth
                  onChange={this.handleChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="secondary">
                  Cancel
                </Button>
                <Button onClick={this.changeUsername} color="primary">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
        <RoomContainer rooms={this.state.user.rooms} user={this.state.user} />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Profile)
