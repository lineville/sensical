import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import firebase from 'firebase'
import {withAuth} from 'fireview'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import AccountCircle from '@material-ui/icons/AccountCircle'

const styles = theme => ({
  root: {
    position: 'absolute'
  },
  flex: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: 0,
    marginRight: 0
  },
  icon: {
    margin: theme.spacing.unit * 2
  },
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  },
  lowercase: {
    textTransform: 'lowercase'
  }
})

class NavMenu extends Component {
  constructor() {
    super()
    this.loginPush = this.loginPush.bind(this)
    this.signupPush = this.signupPush.bind(this)
    this.profilePush = this.profilePush.bind(this)
    this.homePush = this.homePush.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  async handleLogout() {
    try {
      await firebase.auth().signOut()
      this.props.history.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  loginPush() {
    this.props.history.push('/login')
  }

  signupPush() {
    this.props.history.push('/signup')
  }

  profilePush() {
    this.props.history.push('/profile')
  }

  homePush() {
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
            {/* <img src="fig.svg" alt="fig" /> */}
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
