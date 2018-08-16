import React, {Component} from 'react'
import db from '../firestore'
import RoomMembers from './RoomMembers'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

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

  render() {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Room Name:
            </Typography>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              {this.state.currentRoom}
            </Typography>
            <Typography
              variant="title"
              color="inherit"
              className={classes.flex}
            >
              Room Members:
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
