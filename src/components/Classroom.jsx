import React, {Component} from 'react'
import Messaging from './Messaging'
import CodeEditor from './CodeEditor'
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
      </div>
    )
  }
}

export default withRouter(Classroom)
