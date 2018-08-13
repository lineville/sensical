import React, {Component} from 'react'
import db from '../firestore'
import {Link} from 'react-router-dom'

class Rooms extends Component {
  constructor() {
    super()
    this.state = {
      rooms: []
    }
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
    return (
      <div>
        <ul>
          {this.state.rooms.map(room => {
            return (
              <Link
                key={this.state.rooms.indexOf(room)}
                to={`/classroom/${room.id}`}
              >
                <li>{room.id}</li>
              </Link>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default Rooms
