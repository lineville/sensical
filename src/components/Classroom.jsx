import React, {Component} from 'react'
import CodeEditor from './CodeEditor'
import Canvas from './whiteboard/Canvas'
import Messaging from './Messaging'
import {withRouter} from 'react-router-dom'
import db from '../firestore'

class Classroom extends Component {
  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    console.log(this.props.match.params.classRoomId)
    // const classRoomId = db
    //   .collection('rooms')
    //   .doc(this.match.params.classRoomId)
  }

  render() {
    return (
      <div className="columns">
        <Messaging />
        <CodeEditor />
        <Canvas />
      </div>
    )
  }
}

export default withRouter(Classroom)
