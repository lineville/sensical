import React, {Component} from 'react'
import {DropTarget} from 'react-dnd'

import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    backgroundColor: 'none'
  }
})

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    item: monitor.getItem()
  }
}

class HideBin extends Component {
  render() {
<<<<<<< HEAD
    const {classes, connectDropTarget, isOver, item} = this.props
    const backgroundColor = isOver ? '#0115213b' : '#ffffff00'
=======
    const {classes, connectDropTarget, isOver} = this.props
    const backgroundColor = isOver ? '#0115213b' : '#F1EDEB3b'
>>>>>>> 8ea12bfcf4a919a46ba7636fda77f731ef358e5c

    return connectDropTarget(
      <div className="target" style={{background: backgroundColor}}>
        <Button color="inherit" className={classes.button}>
          <DeleteIcon />
          Hide
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(DropTarget('MODULE', {}, collect)(HideBin))
