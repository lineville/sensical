import React from 'react'

const Rooms = props => (
  <div>
    <ul>
      {props.rooms.map(room => (
        <a key={room.id} href={`/classRooms/:${room.id}`}>
          <li>{room.data()}</li>
        </a>
      ))}
    </ul>
  </div>
)

export default Rooms
