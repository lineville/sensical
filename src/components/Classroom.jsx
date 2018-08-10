import React, {Component} from 'react'
import CodeEditor from './CodeEditor'
import Canvas from './whiteboard/Canvas'
import Messaging from './Messaging'

export default class Classroom extends Component {
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
