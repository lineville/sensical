import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'

import {DragSource} from 'react-dnd'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const canvasSource = {
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
    minWidth: 275
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
      strokes: null
    }
  }

  canvas = document.createElement('canvas')
  ctx = this.canvas.getContext('2d')

  picker = document.createElement('div')

  color = 'black'
  //// Position tracking
  currentMousePosition = {
    x: 0,
    y: 0
  }

  lastMousePosition = {
    x: 0,
    y: 0
  }

  // Color picker settings
  colors = [
    '#000000',
    '#ff1000',
    '#380566',
    '#1d00ff',
    '#a31149',
    '#30a300',
    '#40d6c9',
    '#fffc51'
  ]

  strokeToDb = curStroke => {
    db.collection('whiteboards')
      .doc(this.props.whiteboardId)
      .update({
        strokes: firebase.firestore.FieldValue.arrayUnion(...curStroke)
      })
      .then(() => {
        this.setState({curStroke: []})
      })
      .catch(error => {
        console.error('Error drawing new stroke to Firestore Database: ', error)
      })
  }

  draw = (start, end, strokeColor = 'black', shouldBroadcast = true) => {
    this.state.curStroke.push({start, end, strokeColor})
    this.ctx.beginPath()
    this.ctx.strokeStyle = strokeColor
    this.ctx.moveTo(...start)
    this.ctx.lineTo(...end)
    this.ctx.closePath()
    this.ctx.stroke()
  }

  clearCanvas = () => {
    db.collection('whiteboards')
      .doc(this.props.whiteboardId)
      .update({
        strokes: []
      })
      .then(() => {
        this.clearCanvasDOM()
        this.setState({
          curStroke: [],
          strokes: null
        })
        this.setupColorPicker()
      })
      .catch(error => {
        console.error('Error drawing new stroke to Firestore Database: ', error)
      })
  }

  undoLastStroke = () => {
    console.log('UNDO LAST STROKE')
  }

  clearCanvasDOM = () => {
    const classroom = document.getElementById('whiteboard-canvas')
    classroom.removeChild(this.canvas)

    while (this.picker.firstChild) {
      this.picker.removeChild(this.picker.firstChild)
    }
    classroom.removeChild(this.picker)

    const newCanvas = document.createElement('canvas')
    classroom.appendChild(newCanvas)
  }

  setup = () => {
    const classroom = document.getElementById('whiteboard-canvas')
    classroom.appendChild(this.canvas)

    this.setupColorPicker()
    this.setupCanvas()
  }

  setupColorPicker = () => {
    this.picker.classList.add('color-selector')
    this.colors
      .map(color => {
        const marker = document.createElement('div')
        marker.classList.add('marker')
        marker.dataset.color = color
        marker.style.backgroundColor = color
        return marker
      })
      .forEach(color => this.picker.appendChild(color))

    this.picker.addEventListener('click', ({target}) => {
      this.color = target.dataset.color
      if (!this.color) return
      const current = this.picker.querySelector('.selected')
      current && current.classList.remove('selected')
      target.classList.add('selected')
    })

    let classroom = document.getElementById('whiteboard-canvas')
    classroom.appendChild(this.picker)

    // Select the first color
    this.picker.firstChild.click()
  }

  resize = () => {
    // Unscale the canvas (if it was previously scaled)
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)

    // The device pixel ratio is the multiplier between CSS pixels
    // and device pixels
    var pixelRatio = window.devicePixelRatio || 1

    // Allocate backing store large enough to give us a 1:1 device pixel
    // to canvas pixel ratio.
    var w = this.canvas.clientWidth * pixelRatio,
      h = this.canvas.clientHeight * pixelRatio
    if (w !== this.canvas.width || h !== this.canvas.height) {
      // Resizing the canvas destroys the current content.
      // So, save it...
      var imgData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      )

      this.canvas.width = w
      this.canvas.height = h

      // ...then restore it.
      this.ctx.putImageData(imgData, 0, 0)
    }

    // Scale the canvas' internal coordinate system by the device pixel
    // ratio to ensure that 1 canvas unit = 1 css pixel, even though our
    // backing store is larger.
    this.ctx.scale(pixelRatio, pixelRatio)

    this.ctx.lineWidth = 5
    this.ctx.lineJoin = 'round'
    this.ctx.lineCap = 'round'
  }

  setupCanvas = () => {
    // Set the size of the canvas and attach a listener
    // to handle resizing.
    this.resize()
    const classroom = document.getElementById('whiteboard-canvas')
    classroom.addEventListener('resize', this.resize)

    classroom.addEventListener('mousedown', e => {
      this.currentMousePosition = this.pos(e)
    })

    classroom.addEventListener('mouseup', e => {
      if (e.target === this.canvas) {
        this.strokeToDb(this.state.curStroke)
      }
    })

    classroom.addEventListener('mousemove', e => {
      if (!e.buttons) return
      this.lastMousePosition = this.currentMousePosition
      this.currentMousePosition = this.pos(e)
      this.lastMousePosition &&
        this.currentMousePosition &&
        this.draw(
          this.lastMousePosition,
          this.currentMousePosition,
          this.color,
          true
        )
    })
  }

  pos = e => {
    return [e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop]
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
        this.ctx.beginPath()
        this.ctx.strokeStyle = stroke.strokeColor
        this.ctx.moveTo(...stroke.start)
        this.ctx.lineTo(...stroke.end)
        this.ctx.closePath()
        this.ctx.stroke()
      })
    }
    const {classes, connectDragSource, isDragging, item} = this.props
    return connectDragSource(
      <div>
        <Card
          className={classes.card}
          style={{
            opacity: isDragging ? 0.3 : 1,
            cursor: 'move'
          }}
        >
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              Canvas
            </Typography>

            <div id="whiteboard">
              <div id="whiteboard-canvas" />
              <Button onClick={this.clearCanvas}>Clear</Button>
              {/* <Button onClick={this.undoLastStroke}>Undo</Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
