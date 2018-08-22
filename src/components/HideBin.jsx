import React, {Component} from 'react'
import {DropTarget} from 'react-dnd'
import {withStyles} from '@material-ui/core/styles'
import {Button} from '@material-ui/core/'
import {Delete as DeleteIcon} from '@material-ui/icons/'
import styles from '../styles/HideBinStyles'

const hideBinTarget = {
  canDrop(props, monitor) {
    const isJustOverThisOne = monitor.isOver({shallow: true})
    if (isJustOverThisOne) {
      return props
    }
  },
  hover(props, monitor) {
    const canDrop = monitor.canDrop()
  },
  drop(props, monitor) {
    if (monitor.canDrop()) {
      const mod = monitor.getItem()
      mod.handleDrop()
    }
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    item: monitor.getItem()
  }
}

class HideBin extends Component {
  render() {
    const {classes, connectDropTarget, isOver} = this.props
    const backgroundColor = isOver ? '#0115213b' : '#ffffff00'

    return connectDropTarget(
      <div className="target" style={{background: backgroundColor}}>
        <Button
          color="inherit"
          className={classes.button}
          variant="outlined"
          mini
        >
          <DeleteIcon />
          Hide
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(
  DropTarget('MODULE', hideBinTarget, collect)(HideBin)
)
