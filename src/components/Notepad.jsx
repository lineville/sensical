import React, {Component} from 'react'
import db from '../firestore'
import {DragSource} from 'react-dnd'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const notepadSource = {
  beginDrag(props) {
    return {...props, modName: 'notepad'}
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

const styles = () => ({
  card: {
    minWidth: 275,
    position: 'absolute'
  },
  textArea: {
    width: '100%',
    maxHeight: '500px',
    height: '-webkit-fill-available',
    border: '1px dotted'
  }
})

export class Notepad extends Component {
  constructor() {
    super()
    this.state = {
      text: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }

  async componentDidMount() {
    await db
      .collection('notepads')
      .doc(this.props.notepadId)
      .onSnapshot(text => {
        this.setState({text: text.data().text})
      })
  }

  handleChange(event) {
    this.setState(
      {
        text: event.target.value
      },
      async () => {
        await db
          .collection('notepads')
          .doc(this.props.notepadId)
          .set({text: this.state.text})
          .catch(error => {
            console.error('Error writing document', error)
          })
      }
    )
  }

  render() {
    const {classes, connectDragSource, isDragging} = this.props
    return connectDragSource(
      <div className="item">
        <Card
          className={classes.card}
          style={{
            opacity: isDragging ? 0.3 : 1,
            cursor: 'move',
            resize: 'both',
            top: this.props.position.top,
            left: this.props.position.left,
            width: '545px',
            height: '200px'
          }}
        >
          <CardContent>
            <Typography color="textSecondary">Notepad</Typography>
            <div id="notepad">
              <textarea
                type="text"
                name="text"
                className={classes.textArea}
                value={this.state.text}
                onChange={this.handleChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

Notepad.propTypes = {
  classes: PropTypes.object.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

export default DragSource('MODULE', notepadSource, collect)(
  withStyles(styles)(Notepad)
)
