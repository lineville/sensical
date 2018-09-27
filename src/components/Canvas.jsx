import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'
import {HuePicker} from 'react-color'
import {DragSource} from 'react-dnd'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {
  Card,
  CardContent,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  DialogContentText
} from '@material-ui/core/'
import {RemoveCircleOutline as DeleteIcon} from '@material-ui/icons/'
import styles from '../styles/CanvasStyle'

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

class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      curStroke: [],
      strokes: null,
      displayColorPicker: false,
      color: 'black',
      strokeWidth: 1,
      overCanvas: false,
      displaySettings: false
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

  draw = (start, end, strokeColor = 'black', strokeWidth = 1) => {
    const ctx = this.whiteboardCanvas.getContext('2d')
    if (!end.length) {
      end = start
    }
    this.state.curStroke.push({start, end, strokeColor, strokeWidth})
    ctx.lineWidth = strokeWidth
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

    let pixelRatio = window.devicePixelRatio || 1

    let w = this.whiteboardCanvas.clientWidth * pixelRatio,
      h = this.whiteboardCanvas.clientHeight * pixelRatio
    if (
      w !== this.whiteboardCanvas.width ||
      h !== this.whiteboardCanvas.height
    ) {
      let imgData = this.ctx.getImageData(
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
          this.state.strokeWidth
        )
    })
  }

  pos = e => {
    return [
      e.pageX - this.props.position.left - this.whiteboardCanvas.offsetLeft,
      e.pageY - this.props.position.top - this.whiteboardCanvas.offsetTop
    ]
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      displaySettings: false
    })
  }

  async componentDidMount() {
    await db
      .collection('whiteboards')
      .doc(this.props.whiteboardId)
      .onSnapshot(snapshot => {
        const dbStrokes = snapshot.data().strokes
        this.setState({
          strokes: dbStrokes,
          curStroke: []
        })
      })
    this.setup()
  }

  render() {
    if (this.state.strokes) {
      if (this.state.strokes.length) {
        this.state.strokes.forEach(stroke => {
          this.draw(
            stroke.start,
            stroke.end,
            stroke.strokeColor,
            stroke.strokeWidth
          )
        })
      } else if (!this.state.strokes.length) {
        const ctx = this.whiteboardCanvas.getContext('2d')
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, 500, 500)
      }
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
            left: this.props.position.left,
            zIndex: this.props.position.zIndex
          }}
        >
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              Canvas
              <DeleteIcon onClick={() => this.props.handleDrop('canvas')} />
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
              <Button
                onClick={() => {
                  this.setState({color: 'black'})
                }}
              >
                BLACK
              </Button>
              <Button
                onClick={() => {
                  this.setState({
                    color: 'white'
                  })
                }}
              >
                ERASER
              </Button>
              <Button
                onClick={() => {
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
                    })
                    .catch(error => {
                      console.error(
                        'Error drawing new stroke to Firestore Database: ',
                        error
                      )
                    })
                  const ctx = this.whiteboardCanvas.getContext('2d')
                  ctx.fillStyle = this.state.color
                  ctx.fillRect(0, 0, 500, 500)
                }}
              >
                FILL
              </Button>
              <Button onClick={this.clearCanvas}>Clear</Button>
              <Button
                onClick={() => {
                  this.setState({displaySettings: true})
                }}
              >
                SETTINGS
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog
          open={this.state.displaySettings}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Canvas Settings</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Stroke Width: ${this.state.strokeWidth}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.setState({
                  strokeWidth: this.state.strokeWidth + 1
                })
              }}
              color="secondary"
            >
              Stroke Width +
            </Button>
            <Button
              onClick={() => {
                this.setState({
                  strokeWidth: this.state.strokeWidth - 1
                })
              }}
              color="secondary"
            >
              Stroke Width -
            </Button>
            <Button
              onClick={() => {
                this.setState({
                  strokeWidth: 1
                })
              }}
              color="secondary"
            >
              Default
            </Button>
          </DialogActions>
        </Dialog>
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
