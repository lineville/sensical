import React, {Component} from 'react'
import {DragSource} from 'react-dnd'
import {VideoComponent} from '../imports'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {Card, CardContent, Typography} from '@material-ui/core/'
import {RemoveCircleOutline as DeleteIcon} from '@material-ui/icons/'
import styles from '../styles/VideoCardStyles'

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
            height: 200,
            zIndex: this.props.position.zIndex
          }}
        >
          <CardContent className={classes.cardContent}>
            <Typography color="textSecondary" className={classes.title}>
              Video
              <DeleteIcon onClick={() => this.props.handleDrop('videoCard')} />
            </Typography>
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
