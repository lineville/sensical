import React, {Component} from 'react'
import Messaging from './Messaging'
import CodeEditor from './CodeEditor'

class Classroom extends Component {
  constructor(props) {
    super(props)
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

export default Classroom
