import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'

import {DragSource} from 'react-dnd'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {Card, CardContent, Button, Typography} from '@material-ui/core/'

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

  strokeToDb = curStroke => {
    db.collection('whiteboards')
      .doc(this.props.whiteboardId)
      .update({
        strokes: firebase.firestore.FieldValue.arrayUnion(...curStroke)
      })
      .then(() => {
        this.setState({curStroke: [],
        strokes: null})
      })
      .catch(error => {
        console.error('Error drawing new stroke to Firestore Database: ', error)
      })
      this.forceUpdate()
  }

  draw = (start, end, strokeColor = 'black', shouldBroadcast = true) => {
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
        ctx.fillStyle='white'
        ctx.fillRect(0, 0, 500, 500);
      })
      .catch(error => {
        console.error('Error drawing new stroke to Firestore Database: ', error)
      })
  }

  undoLastStroke = () => {
    console.log('UNDO LAST STROKE')
  }

  setup = () => {
    this.setupColorPicker()
    this.setupEventListeners()
  }

  setupColorPicker = () => {
    const picker = document.getElementById('picker')
    const selector = document.getElementById('selector')
    picker.addEventListener('click', ({target}) => {
      this.color = target.dataset.color
      if (!this.color) return
      const current = picker.querySelector('.selected')
      current && current.classList.remove('selected')
      target.classList.add('selected')
    })
    picker.firstChild.click()

    selector.addEventListener('change', ({target}) => {
      this.color = target.value
    })
  }

  resize = () => {
    // Unscale the canvas (if it was previously scaled)
    const ctx = this.whiteboardCanvas.getContext('2d')
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    // The device pixel ratio is the multiplier between CSS pixels
    // and device pixels
    var pixelRatio = window.devicePixelRatio || 1

    // Allocate backing store large enough to give us a 1:1 device pixel
    // to canvas pixel ratio.
    var w = this.whiteboardCanvas.clientWidth * pixelRatio,
      h = this.whiteboardCanvas.clientHeight * pixelRatio
    if (w !== this.whiteboardCanvas.width || h !== this.whiteboardCanvas.height) {
      // Resizing the whiteboardCanvas destroys the current content.
      // So, save it...
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

    // Scale the canvas' internal coordinate system by the device pixel
    // ratio to ensure that 1 canvas unit = 1 css pixel, even though our
    // backing store is larger.
    this.ctx.scale(pixelRatio, pixelRatio)

    this.ctx.lineWidth = 5
    this.ctx.lineJoin = 'round'
    this.ctx.lineCap = 'round'
  }

  setupEventListeners = () => {
    // Set the size of the canvas and attach a listener
    // to handle resizing.
    // this.resize()
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
          this.color,
          true
        )
    })
  }

  pos = e => {
    return [e.pageX - this.whiteboardCanvas.offsetLeft, e.pageY - this.whiteboardCanvas.offsetTop]
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
    return connectDragSource(
      <div>
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
              Canvas
            </Typography>

            <div id="whiteboard">
              <div id="whiteboard-canvas" />
              <canvas 
              ref={canvas => (this.whiteboardCanvas = canvas)}
              height={500}
              width={500}
              />
              <div id='picker' className='color-selector'>
                <div className='marker' data-color='#000000' style={{backgroundColor: '#000000'}} />
                <div className='marker' data-color='#ff1000' style={{backgroundColor: '#ff1000'}} />
                <div className='marker' data-color='#380566' style={{backgroundColor: '#380566'}} />
                <div className='marker' data-color='#1d00ff' style={{backgroundColor: '#1d00ff'}} />
                <div className='marker' data-color='#a31149' style={{backgroundColor: '#a31149'}} />
                <div className='marker' data-color='#30a300' style={{backgroundColor: '#30a300'}} />
                <div className='marker' data-color='#40d6c9' style={{backgroundColor: '#40d6c9'}} />
                <div className='marker' data-color='#fffc51' style={{backgroundColor: '#fffc51'}} />
                <div>
                    <input type="color" id="selector" name="color"
                          value="#e66465" />
                    <label>Selector</label> 
                </div>
                <Button onClick={this.clearCanvas} >
                  Clear
                </Button>
              </div>
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
