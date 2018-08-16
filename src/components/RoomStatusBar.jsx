import React, {Component} from 'react'
import firebase from 'firebase'
import db from '../firestore'
import {render} from 'react-testing-library'
import RoomMembers from './RoomMembers'

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

class RoomStatusBar extends Component {
  constructor() {
    super()
    this.state = {
      currentRoom: '',
      roomMemberIds: []
    }
  }

  async componentDidMount() {
    if (this.props.roomId) {
      const room = await db
        .collection('rooms')
        .doc(this.props.roomId)
        .get()
      const subject = room.data().subject
      const members = room.data().userIds
      this.setState({
        currentRoom: subject,
        roomMemberIds: members
      })
    }
  }

  render() {
    const {classes} = this.props
    console.log('ROOM MEMBERS: ', this.state.roomMemberIds)
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              {this.state.currentRoom}
            </Typography>

            {this.state.roomMemberIds.map(memberId => {
              return <RoomMembers id={memberId} key={memberId} />
            })}
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
