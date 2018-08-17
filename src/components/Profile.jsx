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
      open: false
    }
    this.changeUsername = this.changePassword.bind(this)
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
      open: false
    })
  }

  changeUsername = async () => {}

  changeEmail = async () => {}

  async changePassword() {
    var auth = firebase.auth()
    var emailAddress = await auth.currentUser.email
    auth
      .sendPasswordResetEmail(emailAddress)
      .then(
        function() {
          console.log('sent email')
          this.setState({open: true})
        }.bind(this)
      )
      .catch(function(error) {
        console.log(error)
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
            alt="Pinto Bean"
            src="http://blogs.staffs.ac.uk/student-blogs/files/2016/08/iStock_28423686_MEDIUM.jpg"
            className={classNames(classes.avatar, classes.bigAvatar)}
          />
          <div>
            <p>Welcome {this.state.user.username}!</p>
            <p>Email: {this.state.user.email}</p>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={this.changeUsername}
            >
              Change UserName
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={this.changeEmail}
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
                variant="success"
                message="Check your email for password reset!"
              />
            </Snackbar>
          </div>
        </div>
        <RoomContainer rooms={this.state.user.rooms} user={this.state.user} />
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Profile)
