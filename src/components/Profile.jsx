import React, {Component} from 'react'
import Rooms from './Rooms'
import db from '../firestore'

export default class Profile extends Component {
  constructor() {
    super()
    this.state = {
      roomId: '',
      rooms: []
    }
    this.createRoom = this.createRoom.bind(this)
    this.joinRoom = this.joinRoom.bind(this)
  }

  async createRoom() {
    const whiteboards = await db.collection('whiteboards').add({
      strokes: []
    })
    const fireCodes = await db.collection('fireCodes').add({
      code1: '',
      code2: ''
    })
    const chats = await db.collection('chats').add({
      messages: []
    })
    const room = await db.collection('rooms').add({
      whiteboardId: whiteboards.id,
      fireCodes: fireCodes.id,
      chats: chats.id
    })
    this.setState({
      roomId: room.id
    })
    await db.collection('rooms').onSnapshot(rooms => {
      const newRoom = rooms.docChanges()[0]
      this.setState({
        rooms: [...this.state.rooms, newRoom]
      })
    })
    console.log(
      'boardId',
      whiteboards.id,
      'codeId',
      fireCodes.id,
      'chatsId',
      chats.id,
      'room',
      room.id
    )
  }

  joinRoom() {}

  changePassword() {}

  render() {
    return (
      <React.Fragment>
        <img
          src="https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/12234109/Dachshund-On-White-03.jpg"
          alt="user"
          align="left"
        />
        <h1>Available Rooms</h1>
        <Rooms rooms={this.state.rooms} />

        <button style={{float: 'left', bottom: 0}}>Change Password</button>
        <button className="float-right" onClick={this.createRoom}>
          Create Room
        </button>
        <button className="float-right">Join Room</button>
      </React.Fragment>
    )
  }
}
