import React, {Component} from 'react'
import db from '../firestore'
import RoomMembers from './RoomMembers'
import HideBin from './HideBin'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'

const styles = theme => ({
  root: {
    flexGrow: 1,
    position: 'sticky',
    bottom: 0,
    width: '100%',
    zIndex: 100
  },
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  },
  text: {
    fontSize: 14,
    fontWeight: 200,
    flexGrow: 1,
    display: 'flex'
  }
})

class RoomStatusBar extends Component {
  constructor() {
    super()
    this.state = {
      currentRoom: '',
      roomMemberIds: [],
      drawerOpen: false
    }
  }

  async componentDidMount() {
    if (this.props.roomId) {
      await db
        .collection('rooms')
        .doc(this.props.roomId)
        .onSnapshot(snapshot => {
          const subject = snapshot.data().subject
          const members = snapshot.data().userIds

          this.setState({
            currentRoom: subject,
            roomMemberIds: members
          })
        })
    }
  }

  toggleDrawer = open => () => {
    this.setState({
      drawerOpen: open
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
            <IconButton
              className={classes.menuButton}
              color="secondary"
              variant="fab"
              aria-label="Add"
            >
              <AddIcon onClick={this.toggleDrawer(true)} />
            </IconButton>
            <Drawer
              open={this.state.drawerOpen}
              onClose={this.toggleDrawer(false)}
            >
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
              className={classes.text}
            >
              Room Name:
              {this.state.currentRoom}
            </Typography>
            <Typography
              variant="title"
              color="inherit"
              className={classes.text}
            >
              Room Members:
              {this.state.roomMemberIds.map(memberId => {
                return <RoomMembers id={memberId} key={memberId} />
              })}
            </Typography>
            <HideBin />
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

RoomStatusBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(RoomStatusBar)
