import React, {Component} from 'react'
import RoomCard from './RoomCard'
import db from '../firestore'
import firebase from 'firebase'

import classNames from 'classnames'
import Avatar from '@material-ui/core/Avatar'
import {withStyles, TextField} from '../../node_modules/@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import parallaxStyle from '../styles/parallaxStyle'

const styles = theme => ({
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
  margin: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  ...parallaxStyle
})

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rooms: [],
      subject: '',
      user: {},
      roomIds: []
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
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
      chatsId: chats.id,
      subject: this.state.subject
    })

    const currentUser = await firebase.auth().currentUser
    let user = await db
      .collection('users')
      .doc(currentUser.uid)
      .get()
    let roomsArray = user.data().rooms
    if (!roomsArray.includes(room.id)) {
      await db
        .collection('users')
        .doc(currentUser.uid)
        .update({
          rooms: roomsArray.concat(room.id)
        })
    }

    this.setState({
      subject: ''
    })
  }

  async componentDidMount() {
    //fetch the current user
    const authorizedUser = await firebase.auth().currentUser
    const user = await db
      .collection('users')
      .doc(authorizedUser.uid)
      .get()

    //set the roomIds and user data on state

    db.collection('users')
      .doc(authorizedUser.uid)
      .onSnapshot(async userData => {
        //get all of the room objects from the roomIds

        let roomsArray = []
        await userData.data().rooms.forEach(async roomId => {
          let data = await db
            .collection('rooms')
            .doc(roomId)
            .get()
          roomsArray.push({
            id: roomId,
            ...data.data()
          })
        })
        //resolve all of the promises and set to state
        // const rooms = await Promise.all(roomsArray)
        await this.setState({roomIds: userData.data().rooms, rooms: roomsArray})
        console.log(this.state)
        let roomIdsArray = user.data().rooms
        this.setState({
          roomIds: roomIdsArray,
          user: user.data()
        })
      })
    //listen for changes on the user and update the rooms on state
    // db.collection('users')
    //   .doc(authorizedUser.uid)
    //   .onSnapshot(userData => {
    //     this.setState({roomIds: userData.data().rooms})
    //     console.log(this.state.rooms)
    //   })
  }

  render() {
    const {classes, filter, className, style, small} = this.props
    const parallaxClasses = classNames({
      [classes.parallax]: true,
      [classes.filter]: filter,
      [classes.small]: small,
      [className]: className !== undefined
    })
    console.log(this.state.rooms)
    return (
      <React.Fragment>
        <div
          className={parallaxClasses}
          style={{
            ...style
            // backgroundImage: 'url(' + image + ')'
          }}
        >
          <Avatar
            alt="Pinto Bean"
            src="http://blogs.staffs.ac.uk/student-blogs/files/2016/08/iStock_28423686_MEDIUM.jpg"
            className={classNames(classes.avatar, classes.bigAvatar)}
          />
          <h1>Welcome {this.state.user.username}!</h1>
          <h2>Email: {this.state.user.email}</h2>
          <Button size="small" color="primary">
            Change Password
          </Button>
        </div>
        <h1>Available Rooms</h1>
        <div className={classes.cardRow}>
          {this.state.rooms.map(room => {
            return (
              <RoomCard
                key={room.id}
                id={room.id}
                subject={room.subject}
                joinRoom={this.joinRoom}
                history={this.props.history}
              />
            )
          })}
        </div>
        <FormControl className={classes.margin}>
          <TextField
            id="subject"
            name="subject"
            placeholder="Subject"
            label="Subject"
            className={classes.textField}
            type="subject"
            margin="normal"
            onChange={this.handleChange}
          />
        </FormControl>
        <Button onClick={this.createRoom} size="small" color="default">
          Create Room
        </Button>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Profile)
