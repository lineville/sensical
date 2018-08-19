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
    if (this.props.classState.roomId) {
      await db
        .collection('rooms')
        .doc(this.props.classState.roomId)
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
          {!this.props.classState.canvas ? (
            <ListItem button>
              <ListItemText
                primary="Canvas"
                onClick={() => this.props.addModule('canvas')}
              />
            </ListItem>
          ) : null}
          {!this.props.classState.codeEditors ? (
            <ListItem button>
              <ListItemText
                primary="Code Editor"
                onClick={() => this.props.addModule('codeEditors')}
              />
            </ListItem>
          ) : null}
          {!this.props.classState.video ? (
            <ListItem button>
              <ListItemText
                primary="Video"
                onClick={() => this.props.addModule('video')}
              />
            </ListItem>
          ) : null}
          {!this.props.classState.notepad ? (
            <ListItem button>
              <ListItemText
                primary="Notepad"
                onClick={() => this.props.addModule('notepad')}
              />
            </ListItem>
          ) : null}
          {!this.props.classState.chat ? (
            <ListItem button>
              <ListItemText
                primary="Chat"
                onClick={() => this.props.addModule('chat')}
              />
            </ListItem>
          ) : null}
          {this.props.classState.canvas &&
          this.props.classState.codeEditors &&
          this.props.classState.video &&
          this.props.classState.notepad &&
          this.props.classState.chat ? (
            <ListItem>
              <ListItemText primary="No Extra Modules To Add" />
            </ListItem>
          ) : null}
        </List>
      </div>
    )
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
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
              Room Name: &nbsp;
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
