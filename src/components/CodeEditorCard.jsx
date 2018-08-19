import React, {Component} from 'react'
import CodeEditor from './CodeEditor'
import 'brace/mode/javascript'
import 'brace/theme/monokai'
import PropTypes from 'prop-types'
import {DragSource} from 'react-dnd'

import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const codeEditorSource = {
  beginDrag(props) {
    return props
  },
  endDrag(props, monitor) {
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
    minWidth: 275
  },
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
})

class CodeEditorCard extends Component {
  render() {
    const {classes, connectDragSource, isDragging} = this.props
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
            <Typography className={classes.title} color="textSecondary">
              Code Editor
            </Typography>
            <div>
              {this.props.codeEditors.map(id => (
                <CodeEditor
                  codeEditorId={id}
                  key={id}
                  roomId={this.props.roomId}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

CodeEditorCard.propTypes = {
  classes: PropTypes.object.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

export default DragSource('MODULE', codeEditorSource, collect)(
  withStyles(styles)(CodeEditorCard)
)
