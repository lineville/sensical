import React, {Component} from 'react'
import {DropTarget} from 'react-dnd'

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    item: monitor.getItem()
  }
}

class HideBin extends Component {
  render() {
    const {connectDropTarget, isOver, item} = this.props
    const backgroundColor = isOver ? '#0115213b' : '#FFFFFF'

    return connectDropTarget(
      <div
        className="target"
        style={{background: backgroundColor, padding: '40px'}}
      >
        Hide
      </div>
    )
  }
}

export default DropTarget('MODULE', {}, collect)(HideBin)
