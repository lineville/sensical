import React, {Component} from 'react'
import ClassroomDragLayer from './ClassroomDragLayer'

import HTML5Backend from 'react-dnd-html5-backend'
import {DragDropContext} from 'react-dnd'

class ClassroomContext extends Component {
  render() {
    return (
      <div>
        <ClassroomDragLayer classroom={this.props.match.params.classroomId} />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(ClassroomContext)
