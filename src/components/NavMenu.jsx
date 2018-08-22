import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import firebase from 'firebase'
import {withAuth} from 'fireview'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from '@material-ui/core/'
import {AccountCircle} from '@material-ui/icons/'
import styles from '../styles/NavMenuStyles'

class NavMenu extends Component {
  constructor() {
    super()
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogout = async () => {
    try {
      await firebase.auth().signOut()
      this.props.history.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  loginPush = () => {
    this.props.history.push('/login')
  }

  signupPush = () => {
    this.props.history.push('/signup')
  }

  profilePush = () => {
    this.props.history.push('/profile')
  }

  homePush = () => {
    this.props.history.push('/')
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <AppBar>
          <Toolbar>
            <Button color="inherit" onClick={this.homePush}>
              <Typography
                variant="title"
                color="inherit"
                className={classes.lowercase}
              >
                fig
              </Typography>
            </Button>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            />
            {this.props._user ? (
              <div>
                <Button color="inherit" onClick={this.handleLogout}>
                  Logout
                </Button>
                <IconButton className={classes.menuButton} color="inherit">
                  <AccountCircle onClick={this.profilePush} />
                </IconButton>
              </div>
            ) : (
              <div>
                <Button color="inherit" onClick={this.loginPush}>
                  Login
                </Button>
                <Button color="inherit" onClick={this.signupPush}>
                  Signup
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

NavMenu.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(withRouter(withAuth(NavMenu)))
