import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'

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
import Divider from '@material-ui/core/Divider'
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
    console.log(this.props)
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
            <ListItemText primary="Inbox" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Drafts" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button>
            <ListItemText primary="Inbox" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Drafts" />
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
            {/* <img src="fig.svg" alt="fig" /> */}
            <Button color="inherit" onClick={this.loginPush}>
              Login
            </Button>
            <Button color="inherit" onClick={this.signupPush}>
              Signup
            </Button>
            <IconButton className={classes.menuButton} color="inherit">
              <AccountCircle onClick={this.profilePush} />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

NavMenu.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(withRouter(NavMenu))
