import React, {Component} from 'react'
import CreateRoom from './CreateRoom'
import RoomCard from './RoomCard'
import {withStyles} from '@material-ui/core'
import styles from '../styles/RoomContainerStyles'

class RoomContainer extends Component {
  render() {
    const {classes, user} = this.props
    return (
      <div className={classes.root}>
        <div className={classes.cardsHeading}>
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
