import React, {Component} from 'react'
import Video from 'twilio-video'
import axios from 'axios'
import {DragSource} from 'react-dnd'
import VideoComponent from './VideoComponent'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
// import RaisedButton from 'material-ui/RaisedButton'
// import TextField from 'material-ui/TextField'

const messagingSource = {
  beginDrag(props) {
    return props
  },
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return
    }
    return props.handleDrop()
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

const styles = theme => ({
  card: {
    width: 275
  },
  container: {
    flexWrap: 'wrap',
    textAlign: 'center',
    position: 'relative',
    display: 'block',
    width: '100%'
  },
  margin: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
})

export class VideoCard extends Component {
  render() {
    const {classes, connectDragSource, isDragging, item} = this.props
    return connectDragSource(
      <div className="item">
        <Card
          className={classes.card}
          style={{
            opacity: isDragging ? 0.3 : 1,
            cursor: 'move',
            resize: 'both'
          }}
        >
          <CardContent>
            <Typography color="textSecondary">Video</Typography>
            <VideoComponent roomId={this.props.roomId} />
          </CardContent>
        </Card>
      </div>
    )
  }
}

VideoCard.propTypes = {
  classes: PropTypes.object.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

export default DragSource('MODULE', messagingSource, collect)(
  withStyles(styles)(VideoCard)
)
