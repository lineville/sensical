import React, {Component} from 'react'
import CodeEditor from './CodeEditor'
import Canvas from './Canvas'
import Messaging from './Messaging'
import {withRouter} from 'react-router-dom'
import db from '../firestore'

class Classroom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomId: '',
      whiteboardId: '',
      fireCodesId: '',
      chatsId: ''
    }
  }

  async componentDidMount() {
    const classRoom = await db
      .collection('rooms')
      .doc(this.props.match.params.classRoomId)
      .get()
    this.setState({
      roomId: classRoom.id,
      whiteboardId: classRoom.data().whiteboardId,
      fireCodesId: classRoom.data().fireCodesId,
      chatsId: classRoom.data().chatsId
    })
  }

  render() {
    if (
      this.state.fireCodesId.length &&
      this.state.chatsId.length &&
      this.state.whiteboardId.length
    ) {
      return (
        <div className="columns">
          <Messaging chatsId={this.state.chatsId} roomId={this.state.roomId} />
          <CodeEditor
            fireCodesId={this.state.fireCodesId}
            roomId={this.state.roomId}
          />
          {/* <Canvas
            whiteboardId={this.state.whiteboardId}
            roomId={this.state.roomId}
          /> */}
        </div>
      )
    }
    return <div />
  }
}

export default withRouter(Classroom)
