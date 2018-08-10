import React, {Component} from 'react'
import Rooms from './Rooms'

export default class Profile extends Component {
  constructor() {
    super()
    this.createRoom = this.createRoom.bind(this)
    this.joinRoom = this.joinRoom.bind(this)
  }

  createRoom() {}

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
        <Rooms />

        <button style={{float: 'left', bottom: 0}}>Change Password</button>
        <button className="float-right">Create Room</button>
        <button className="float-right">Join Room</button>
      </React.Fragment>
    )
  }
}
