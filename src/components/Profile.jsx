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
import DialogContentText from '@material-ui/core/DialogContentText'
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
      passwordFormOpen: true,
      newEmail: '',
      newPassword: ''
    }
    this.changeEmail = this.changeEmail.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.handleClose = this.handleClose.bind(this)
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

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      open: false,
      emailFormOpen: false,
      passwordFormOpen: false
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  async changeEmail() {
    const user = await firebase.auth().currentUser
    user
      .updateEmail(this.state.newEmail)
      .then(() => {
        this.setState({
          popUpMessage: 'Email successfully updated',
          popUpMessageType: 'success'
        })
      })
      .then(() => {
        this.setState({open: true})
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

  async changePassword() {
    var auth = firebase.auth()
    var emailAddress = await auth.currentUser.email
    auth
      .sendPasswordResetEmail(emailAddress)
      .then(() => {
        this.setState({
          popUpMessage: 'Check your email for password reset!',
          popUpMessageType: 'success'
        })
      })
      .then(() => {
        this.setState({open: true})
      })
      .catch(function(error) {
        console.log(error)
      })
  }

  async changeUsername() {
    const authorizedUser = await firebase.auth().currentUser
    const user = await db
      .collection('users')
      .doc(authorizedUser.uid)
      .update({username: newUserName})
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
              onClick={this.changeUsername}
            >
              Change Username
            </Button>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              open={this.state.open}
              autoHideDuration={6000}
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
          </div>
        </div>
        <RoomContainer rooms={this.state.user.rooms} user={this.state.user} />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Profile)
