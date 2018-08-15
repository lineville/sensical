import React, {Component} from 'react'
import Classroom from './Classroom'

import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'

class ClassroomContext extends Component {
  render() {
    return (
      <div>
        <Classroom classroom={this.props.match.params.classroomId} />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(ClassroomContext)
