import React, {Component} from 'react'
import {DragSource} from 'react-dnd'
import Messaging from './Messaging'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const messagingSource = {
  beginDrag(props) {
    return {}
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const styles = theme => ({
  card: {
    minWidth: 275
  }
})

class ModuleCard extends Component {
  render() {
    const {classes, connectDragSource, isDragging} = this.props
    return connectDragSource(
      <div>
        <Card
          className={classes.card}
          style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move'
          }}
        >
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              Chat
            </Typography>
            <Messaging
              chatsId={this.props.chatsId}
              roomId={this.props.roomId}
            />
            <Button>Remove</Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}

ModuleCard.propTypes = {
  classes: PropTypes.object.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

export default DragSource('MODULE', messagingSource, collect)(
  withStyles(styles)(ModuleCard)
)
