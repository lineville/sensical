import React, {Component} from 'react'
import CodeEditor from './CodeEditor'
import Canvas from './whiteboard/Canvas';

export default class ClassRoom extends Component {
  render() {
    return (
      <div id="classroom">
        <CodeEditor />
        <Canvas />
      </div>
    )
  }
}
