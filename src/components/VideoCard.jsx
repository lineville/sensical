import React, {Component} from 'react'
import {DragSource} from 'react-dnd'
import VideoComponent from './VideoComponent'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const messagingSource = {
  beginDrag(props) {
    return {...props, modName: 'video'}
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
    width: 275,
    position: 'absolute'
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
    const {classes, connectDragSource, isDragging} = this.props
    return connectDragSource(
      <div className="item">
        <Card
          className={classes.card}
          id="video"
          style={{
            opacity: isDragging ? 0.3 : 1,
            cursor: 'move',
            resize: 'both',
            top: this.props.position.top,
            left: this.props.position.left,
            width: 545,
            height: 200
          }}
        >
          <CardContent className={classes.cardContent}>
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
