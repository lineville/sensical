import React, {Component} from 'react'

import {DropTarget, DragDropContext, XYCoord} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Classroom from './Classroom'
import db from '../firestore'

const classroomTarget = {
  canDrop(props, monitor) {
    const isJustOverThisOne = monitor.isOver({shallow: true})
    if (isJustOverThisOne) {
      return true
    }
    return false
  },
  drop(props, monitor, component) {
    if (!component) {
      return
    }
    const item = monitor.getItem()
    const XY = monitor.getDifferenceFromInitialOffset()
    const left = Math.round(item.position.left + XY.x)
    const top = Math.round(item.position.top + XY.y)
    component.moveModule(item, left, top, item.codeEditorId)
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
      video: {top: 85, left: 0},
      messaging: {top: 85, left: 280},
      canvas: {top: 85, left: 560},
      notepad: {top: 200, left: 0},
      codeEditors: {}
    }
    this.moveModule = this.moveModule.bind(this)
  }

  componentDidMount() {
    const roomId = this.props.match.params.classroomId
    db.collection('rooms')
      .doc(roomId)
      .get()
      .then(room => {
        let codeEditors = {}
        room.data().codeEditorIds.forEach((id, idx) => {
          codeEditors[id] = {top: 300, left: 600 * idx}
        })
        this.setState({
          codeEditors
        })
      })
  }

  moveModule(mod, left, top, id) {
    if (mod.modName === 'codeEditors') {
      this.setState({
        codeEditors: {
          ...this.state.codeEditors,

          [id]: {
            top: top,
            left: left
          }
        }
      })
    } else {
      this.setState({
        [mod.modName]: {
          top: top,
          left: left
        }
      })
    }
  }

  render() {
    const {isOver, connectDropTarget, item} = this.props
    if (!Object.keys(this.state.codeEditors).length) {
      return <div />
    }
    return connectDropTarget(
      <div>
        <Classroom
          classroom={this.props.match.params.classroomId}
          positions={this.state}
        />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(
  DropTarget('MODULE', classroomTarget, collect)(ClassroomContext)
)
