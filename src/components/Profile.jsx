import React, {Component} from 'react'
import Rooms from './Rooms'
import db from '../firestore'
// import firebase from 'firebase'

import classNames from 'classnames'
import Avatar from '@material-ui/core/Avatar'
import {withStyles} from '../../node_modules/@material-ui/core'
import Button from '@material-ui/core/Button'
// import CardMedia from '@material-ui/core/CardMedia'
// import Card from '@material-ui/core/Card'
import parallaxStyle from '../styles/parallaxStyle'

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center'
  },
  avatar: {
    margin: 50
  },
  bigAvatar: {
    width: 260,
    height: 260
  },
  cardRow: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  card: {
    maxWidth: 345
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  ...parallaxStyle
}

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomId: '',
      rooms: []
    }
  }

  createRoom = async () => {
    const whiteboards = await db.collection('whiteboards').add({})
    const fireCodes = await db.collection('fireCodes').add({
      code1: '',
      code2: ''
    })
    const chats = await db.collection('chats').add({})
    const room = await db.collection('rooms').add({
      whiteboardId: whiteboards.id,
      fireCodesId: fireCodes.id,
      chatsId: chats.id
    })
    this.setState({
      roomId: room.id
    })
  }

  async componentDidMount() {
    await db.collection('rooms').onSnapshot(rooms => {
      let allRooms = []
      rooms.docs.forEach(room => {
        const data = room.data()
        data.id = room.id
        allRooms.push(data)
      })
      this.setState({
        rooms: allRooms
      })
    })
  }

  render() {
    const {classes, filter, className, style, small} = this.props
    const image =
      'https://png.pngtree.com/element_origin_min_pic/17/01/07/217500f76b8ca08917fab435cb299f8c.jpg'
    const parallaxClasses = classNames({
      [classes.parallax]: true,
      [classes.filter]: filter,
      [classes.small]: small,
      [className]: className !== undefined
    })
    return (
      <React.Fragment>
        <div
          className={parallaxClasses}
          style={{
            ...style,
            backgroundImage: 'url(' + image + ')'
          }}
        >
          <Avatar
            alt="Pinto Bean"
            src="https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/12234109/Dachshund-On-White-03.jpg"
            className={classNames(classes.avatar, classes.bigAvatar)}
          />
          <h1>Email address:</h1>
          <h2>hardcoded@email.com</h2>
          <Button size="small" color="primary">
            Change Password
          </Button>
        </div>
        <h1>Available Rooms</h1>
        <Button onClick={this.createRoom} size="small" color="default">
          Create Room
        </Button>
        <div className={classes.cardRow}>
          {this.state.rooms.map(room => {
            return (
              <Rooms
                key={room.id}
                id={room.id}
                joinRoom={this.joinRoom}
                history={this.props.history}
              />
            )
          })}
          {/* <Rooms history={this.props.history} /> */}
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Profile)
