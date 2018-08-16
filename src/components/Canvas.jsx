import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'

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

  setup = () => {
    let classroom = document.getElementById('whiteboard-canvas')
    classroom.appendChild(this.canvas)

    this.setupColorPicker()
    this.setupCanvas()
  }

  setupColorPicker = () => {
    const picker = document.createElement('div')
    picker.classList.add('color-selector')
    this.colors
      .map(color => {
        const marker = document.createElement('div')
        marker.classList.add('marker')
        marker.dataset.color = color
        marker.style.backgroundColor = color
        return marker
      })
      .forEach(color => picker.appendChild(color))

    picker.addEventListener('click', ({target}) => {
      this.color = target.dataset.color
      if (!this.color) return
      const current = picker.querySelector('.selected')
      current && current.classList.remove('selected')
      target.classList.add('selected')
    })

    let classroom = document.getElementById('whiteboard-canvas')
    classroom.appendChild(picker)

    // Select the first color
    picker.firstChild.click()
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
    window.addEventListener('resize', this.resize)

    window.addEventListener('mousedown', e => {
      this.currentMousePosition = this.pos(e)
    })

    window.addEventListener('mouseup', e => {
      if (e.target === this.canvas) {
        this.strokeToDb(this.state.curStroke)
      }
    })

    window.addEventListener('mousemove', e => {
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
    return (
      <div id="whiteboard">
        <div id="whiteboard-canvas" />
      </div>
    )
  }
}

export default Canvas
