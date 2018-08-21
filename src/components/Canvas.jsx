import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'
import {HuePicker} from 'react-color'

import {DragSource} from 'react-dnd'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {Card, CardContent, Button, Typography} from '@material-ui/core/'

const canvasSource = {
  canDrag(props) {
    return props
  },
  beginDrag(props) {
    return {...props, modName: 'canvas'}
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
    minWidth: 275,
    position: 'absolute'
  },
  button: {
    margin: theme.spacing.unit
  }
})

class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      curStroke: [],
      strokes: null,
      displayColorPicker: false,
      color: 'black',
      lineWidth: 5,
      overCanvas: false
    }
  }

  currentMousePosition = {
    x: 0,
    y: 0
  }

  lastMousePosition = {
    x: 0,
    y: 0
  }

  strokeToDb = curStroke => {
    if (curStroke.length) {
      db.collection('whiteboards')
        .doc(this.props.whiteboardId)
        .update({
          strokes: firebase.firestore.FieldValue.arrayUnion(...curStroke)
        })
        .then(() => {
          this.setState({
            curStroke: [],
            strokes: null
          })
        })
        .catch(error => {
          console.error(
            'Error drawing new stroke to Firestore Database: ',
            error
          )
        })
    }
  }

  draw = (start, end, strokeColor = 'black') => {
    const ctx = this.whiteboardCanvas.getContext('2d')
    this.state.curStroke.push({start, end, strokeColor})
    ctx.beginPath()
    ctx.strokeStyle = strokeColor
    ctx.moveTo(...start)
    ctx.lineTo(...end)
    ctx.closePath()
    ctx.stroke()
  }

  clearCanvas = () => {
    db.collection('whiteboards')
      .doc(this.props.whiteboardId)
      .update({
        strokes: []
      })
      .then(() => {
        this.setState({
          curStroke: [],
          strokes: null
        })
        const ctx = this.whiteboardCanvas.getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, 500, 500)
      })
      .catch(error => {
        console.error('Error drawing new stroke to Firestore Database: ', error)
      })
  }

  setup = () => {
    this.setupEventListeners()
  }

  resize = () => {
    const ctx = this.whiteboardCanvas.getContext('2d')
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    var pixelRatio = window.devicePixelRatio || 1

    var w = this.whiteboardCanvas.clientWidth * pixelRatio,
      h = this.whiteboardCanvas.clientHeight * pixelRatio
    if (
      w !== this.whiteboardCanvas.width ||
      h !== this.whiteboardCanvas.height
    ) {
      var imgData = this.ctx.getImageData(
        0,
        0,
        this.whiteboardCanvas.width,
        this.whiteboardCanvas.height
      )

      this.whiteboardCanvas.width = w
      this.whiteboardCanvas.height = h

      // ...then restore it.
      this.ctx.putImageData(imgData, 0, 0)
    }

    this.ctx.scale(pixelRatio, pixelRatio)

    this.ctx.lineWidth = 5
    this.ctx.lineJoin = 'round'
    this.ctx.lineCap = 'round'
  }

  setupEventListeners = () => {
    const eventArea = document.getElementById('whiteboard')
    eventArea.addEventListener('resize', this.resize)

    eventArea.addEventListener('mousedown', e => {
      this.currentMousePosition = this.pos(e)
    })

    eventArea.addEventListener('mouseup', e => {
      if (e.target === this.whiteboardCanvas) {
        this.strokeToDb(this.state.curStroke)
      }
    })

    eventArea.addEventListener('mousemove', e => {
      if (!e.buttons) return
      this.lastMousePosition = this.currentMousePosition
      this.currentMousePosition = this.pos(e)
      this.lastMousePosition &&
        this.currentMousePosition &&
        this.draw(
          this.lastMousePosition,
          this.currentMousePosition,
          this.state.color,
          true
        )
    })
  }

  pos = e => {
    return [
      e.pageX - this.props.position.left - this.whiteboardCanvas.offsetLeft,
      e.pageY - this.props.position.top - this.whiteboardCanvas.offsetTop
    ]
  }

  async componentDidMount() {
    await db
      .collection('whiteboards')
      .doc(this.props.whiteboardId)
      .onSnapshot(snapshot => {
        const dbStrokes = snapshot.data().strokes
        this.setState({strokes: dbStrokes})
      })
    this.setup()
  }

  render() {
    if (this.state.strokes) {
      this.state.strokes.forEach(stroke => {
        this.draw(stroke.start, stroke.end, stroke.strokeColor)
      })
    }
    const {classes, connectDragSource, isDragging} = this.props

    const canvas = (
      <div>
        <Card
          className={classes.card}
          style={{
            opacity: isDragging ? 0.3 : 1,
            cursor: this.state.overCanvas ? 'default' : 'move',
            resize: 'both',
            top: this.props.position.top,
            left: this.props.position.left
          }}
        >
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              Canvas
            </Typography>

            <div id="whiteboard">
              <canvas
                onMouseEnter={() => this.setState({overCanvas: true})}
                onMouseLeave={() => this.setState({overCanvas: false})}
                ref={canvas => (this.whiteboardCanvas = canvas)}
                height={500}
                width={500}
              />
              <HuePicker
                onChangeComplete={color => {
                  this.setState({color: color.hex})
                }}
                color={this.state.color}
              />
              <Button onClick={this.clearCanvas}>Clear</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
    if (this.state.overCanvas) {
      return canvas
    }
    return connectDragSource(canvas)
  }
}

Canvas.propTypes = {
  classes: PropTypes.object.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}

export default DragSource('MODULE', canvasSource, collect)(
  withStyles(styles)(Canvas)
)
