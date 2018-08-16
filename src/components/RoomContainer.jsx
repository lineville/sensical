import React, {Component} from 'react'
import CreateRoom from './CreateRoom'
import RoomCard from './RoomCard'

import {withStyles} from '../../node_modules/@material-ui/core'

const styles = theme => ({
  cardRow: {
    display: 'flex',
    flexWrap: 'wrap'
  }
})

class RoomContainer extends Component {
  render() {
    const {classes, user} = this.props
    return (
      <div>
        <p>Available Rooms</p>
        <div className={classes.cardRow}>
          {this.props.rooms
            ? this.props.rooms.map(roomId => {
                return <RoomCard roomId={roomId} key={roomId} user={user} />
              })
            : 'no rooms'}
        </div>
        <CreateRoom />
      </div>
    )
  }
}

export default withStyles(styles)(RoomContainer)
