import React, {Component} from 'react'
import db from '../firestore'
import Button from '@material-ui/core/Button'

class Rooms extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rooms: []
    }
    this.joinRoom = this.joinRoom.bind(this)
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

  joinRoom(id) {
    this.props.history.push(`/classroom/${id}`)
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.rooms.map(room => {
            return (
              <React.Fragment key={this.state.rooms.indexOf(room)}>
                <li>{room.id}</li>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    {
                      this.joinRoom(room.id)
                    }
                  }}
                >
                  Join Room
                </Button>
              </React.Fragment>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default Rooms
