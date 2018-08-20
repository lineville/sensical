import React, {Component} from 'react'

import {DropTarget, DragDropContext, XYCoord} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Classroom from './Classroom'

const classroomTarget = {
  drop(props, monitor, component) {
    if (!component) {
      console.log('!com')
      return
    }
    const item = monitor.getItem()
    const XY = monitor.getDifferenceFromInitialOffset()
    const left = Math.round(item.position.left + XY.x)
    const top = Math.round(item.position.top + XY.y)
    console.log('log', item, XY, left, top)
    component.moveModule(item, left, top)
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    item: monitor.getItem()
  }
}

class ClassroomContext extends Component {
  constructor() {
    super()
    this.state = {
      modulePositions: {
        video: {top: 20, left: 0},
        messaging: {top: 180, left: 20},
        canvas: {top: 20, left: 80},
        notepad: {top: 180, left: 20},
        codeEditor: {top: 20, left: 80}
      }
    }
    this.moveModule = this.moveModule.bind(this)
  }

  moveModule(mod, left, top) {
    this.setState({
      modulePositions: {
        [mod]: {
          left: left,
          top: top
        }
      }
    })
    console.log(this.state)
  }

  render() {
    const {isOver, connectDropTarget, item} = this.props

    return connectDropTarget(
      <div>
        <Classroom
          classroom={this.props.match.params.classroomId}
          positions={this.state.modulePositions}
        />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(
  DropTarget('MODULE', classroomTarget, collect)(ClassroomContext)
)
