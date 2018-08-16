import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import firebase from 'firebase'
import {withAuth} from 'fireview'
import db from '../firestore'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const styles = theme => ({
  root: {
    flexGrow: 1
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
  }
})

class NavMenu extends Component {
  constructor() {
    super()
    this.state = {
      open: false
    }
    this.loginPush = this.loginPush.bind(this)
    this.signupPush = this.signupPush.bind(this)
    this.profilePush = this.profilePush.bind(this)
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

  toggleDrawer = open => () => {
    this.setState({
      open
    })
  }

  render() {
    const {classes} = this.props
    const sideList = (
      <div className={classes.fullList}>
        <List>
          <ListItem button>
            <ListItemText primary="WhiteBoard" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Code Editor" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Video" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Notes" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Chat" />
          </ListItem>
        </List>
      </div>
    )

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit">
              <MenuIcon onClick={this.toggleDrawer(true)} />
            </IconButton>
            <Drawer open={this.state.open} onClose={this.toggleDrawer(false)}>
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer(false)}
                onKeyDown={this.toggleDrawer(false)}
              >
                {sideList}
              </div>
            </Drawer>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              fig
            </Typography>
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
