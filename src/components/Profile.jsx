import React, {Component} from 'react'
import Rooms from './Rooms'
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
      user: {}
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
    if (roomsArray.indexOf(room.id) === -1) {
      await db
        .collection('users')
        .doc(currentUser.uid)
        .update({
          rooms: roomsArray.concat(room.id)
        })

      // props.history.push(`/classroom/${id}`)
    }

    this.setState({
      subject: ''
    })
  }

  async componentDidMount() {
    const authorizedUser = await firebase.auth().currentUser
    const user = await db
      .collection('users')
      .doc(authorizedUser.uid)
      .get()

    let roomsArray = user.data().rooms
    this.setState({
      rooms: roomsArray
    })

    await db
      .collection('users')
      .doc(authorizedUser.uid)
      .onSnapshot(user => {
        this.setState({
          rooms: user.data().rooms
        })
      })

    this.setState({
      user: user.data()
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
          <h1>Welcome {this.state.user.username}!</h1>
          <h2>Email: {this.state.user.email}</h2>
          <Button size="small" color="primary">
            Change Password
          </Button>
        </div>
        <h1>Available Rooms</h1>
        <div className={classes.cardRow}>
          {this.state.rooms.map(room => {
            console.log('ROOM: ', room)
            return (
              <Rooms
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
