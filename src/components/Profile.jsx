import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'
import classNames from 'classnames'
import {withStyles} from '@material-ui/core'
import {Notification, RoomContainer} from '../imports'
import styles from '../styles/ProfileStyles'
import {
  Avatar,
  Button,
  Snackbar,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core/'
import {
  Edit as EditIcon,
  Done as DoneIcon,
  Cancel as CancelIcon
} from '@material-ui/icons/'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      open: false,
      popUpMessageType: '',
      popUpMessage: '',
      editFormOpen: false,
      passwordFormOpen: false,
      newEmail: '',
      newUserName: '',
      newImageURL: '',
      newBackgroundURL: ''
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
      editFormOpen: false,
      passwordFormOpen: false
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  changeEmail = () => {
    const user = firebase.auth().currentUser
    if (this.state.newEmail.length) {
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
        .then(() => {
          this.setState({
            newEmail: ''
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
  }

  updateProfile = async () => {
    await this.changeUsername()
    await this.changeEmail()
    await this.changeImage()
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

  changeUsername = () => {
    if (this.state.newUserName.length) {
      db.collection('users')
        .doc(this.state.user.id)
        .update({username: this.state.newUserName})
        .then(() => {
          this.setState({
            editFormOpen: false,
            popUpMessageType: 'success',
            popUpMessage: 'Username successfully changed',
            open: true,
            newUserName: ''
          })
        })
    }
  }

  changeImage = () => {
    if (this.state.newImageURL) {
      db.collection('users')
        .doc(this.state.user.id)
        .update({profilePicURL: this.state.newImageURL})
        .then(() => {
          this.setState({
            editFormOpen: false,
            popUpMessageType: 'success',
            popUpMessage: 'Profile image successfully changed',
            open: true,
            newImageURL: ''
          })
        })
    }
  }

  changeBackgroundImage = () => {
    if (this.state.newBackgroundURL) {
      db.collection('users')
        .doc(this.state.user.id)
        .update({backgroundImageURL: this.state.newBackgroundURL})
        .then(() => {
          this.setState({
            editFormOpen: false,
            popUpMessageType: 'success',
            popUpMessage: 'Background image successfully changed',
            open: true,
            newImageURL: ''
          })
        })
    }
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
            ...style,
            backgroundImage:
              this.state.user.backgroundImageURL ||
              'linear-gradient( 109.6deg,  rgba(70,249,253,1) 21.3%, rgba(247,10,255,1) 77.3% )'
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
              variant="fab"
              mini
              color="primary"
              className={classes.button}
              onClick={() => this.setState({editFormOpen: true})}
            >
              <EditIcon />
            </Button>
            <p>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={this.changePassword}
              >
                Password Reset
              </Button>
            </p>
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
              open={this.state.editFormOpen}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="normal"
                  id="name"
                  name="newEmail"
                  label="Email Address"
                  placeholder={this.state.user.email}
                  value={this.state.newEmail}
                  type="email"
                  fullWidth
                  onChange={this.handleChange}
                />
                <TextField
                  autoFocus
                  margin="normal"
                  id="name"
                  name="newUserName"
                  label="Username"
                  placeholder={this.state.user.username}
                  value={this.state.newUserName}
                  type="email"
                  fullWidth
                  onChange={this.handleChange}
                />
                <TextField
                  autoFocus
                  margin="normal"
                  id="name"
                  name="newImageURL"
                  label="image URL"
                  placeholder={this.state.user.profilePicURL}
                  value={this.state.newImageURL}
                  type="email"
                  fullWidth
                  onChange={this.handleChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="secondary">
                  <CancelIcon />
                </Button>
                <Button onClick={this.updateProfile} color="primary">
                  <DoneIcon />
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
