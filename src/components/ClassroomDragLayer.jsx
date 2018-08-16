import React, {Component} from 'react'
import Classroom from './Classroom'
import PropTypes from 'prop-types'
// import BoxDragPreview from './BoxDragPreview'
import {DragLayer} from 'react-dnd'

const layerStyles = {
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
}

function getItemStyles(props) {
  const {currentOffset} = props
  if (!currentOffset) {
    return {
      transform: 'translate(0px, 0px)',
      WebkitTransform: 'translate(0px, 0px)'
    }
  }

  const {x, y} = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  // console.log(transform)
  return {
    transform: transform,
    WebkitTransform: transform
  }
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }
}

export class ClassroomDragLayer extends Component {
  render() {
    const {item, itemType, isDragging} = this.props
    return (
      <div style={layerStyles}>
        <div>
          {/* <div style={getItemStyles(this.props)}> */}
          <Classroom
            classroom={this.props.classroom}
            style={getItemStyles(this.props)}
          />
        </div>
      </div>
    )
  }
}

ClassroomDragLayer.propTypes = {
  item: PropTypes.object,
  itemType: PropTypes.string,
  currentOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }),
  isDragging: PropTypes.bool.isRequired
}

export default DragLayer(collect)(ClassroomDragLayer)
