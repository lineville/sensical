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
    const classroom = await db
      .collection('rooms')
      .doc(this.props.match.params.classroomId)
      .get()
    this.setState({
      roomId: classroom.id,
      whiteboardId: classroom.data().whiteboardId,
      fireCodesId: classroom.data().fireCodesId,
      chatsId: classroom.data().chatsId
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
          <Canvas
            whiteboardId={this.state.whiteboardId}
            roomId={this.state.roomId}
          />
        </div>
      )
    }
    return <div />
  }
}

export default withRouter(Classroom)
