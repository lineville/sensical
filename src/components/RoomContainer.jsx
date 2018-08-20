import React, {Component} from 'react'
import CreateRoom from './CreateRoom'
import RoomCard from './RoomCard'

import {withStyles} from '../../node_modules/@material-ui/core'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 64
  },
  cardsHeading: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  allCards: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
})

class RoomContainer extends Component {
  render() {
    const {classes, user} = this.props
    return (
      <div className={classes.root}>
        <div className={classes.cardsHeading}>
          <p>Available Rooms</p>
          <CreateRoom />
        </div>
        <div className={classes.allCards}>
          {this.props.rooms
            ? this.props.rooms.map(roomId => {
                return <RoomCard roomId={roomId} key={roomId} user={user} />
              })
            : 'no rooms'}
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(RoomContainer)
