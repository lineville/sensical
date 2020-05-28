import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import firebase from 'firebase'
import {withAuth} from 'fireview'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {
  AppBar,
  Toolbar,
  Tooltip,
  Typography,
  Button,
  IconButton,
} from '@material-ui/core/'
import {Home, Brightness4, Brightness7} from '@material-ui/icons/'
import GitHubIcon from '@material-ui/icons/GitHub'
import styles from '../styles/NavMenuStyles'

class NavMenu extends Component {
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
    const {classes, toggleDarkMode, isDarkMode} = this.props
    return (
      <div className={classes.root}>
        <AppBar className={classes.height}>
          <Toolbar>
            <Button color="inherit" onClick={this.homePush}>
              <Typography
                variant="button"
                color="inherit"
                className={classes.logo}
              >
                sensical
              </Typography>
            </Button>
            <Button
              color="inherit"
              href="https://github.com/lineville/sensical"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography
                variant="button"
                color="inherit"
                className={classes.logo}
              >
                <GitHubIcon />
              </Typography>
            </Button>
            <Typography color="inherit" className={classes.flex} />
            {this.props._user ? (
              <div>
                <Button color="inherit" onClick={this.handleLogout}>
                  Logout
                </Button>
                <IconButton
                  className={classes.menuButton}
                  color="inherit"
                  onClick={this.profilePush}
                >
                  <Home />
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
            <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

NavMenu.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(withRouter(withAuth(NavMenu)))
