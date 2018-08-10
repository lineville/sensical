import React, {Component} from 'react'
import firebase from 'firebase'
import db from '../../firestore'
import {EventEmitter} from 'events'

class Canvas extends Component {
  constructor() {
    super()

    this.state = {
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
  colors = ['black', 'purple', 'red', 'green', 'orange', 'yellow', 'brown']

  drawToDb = (start, end, strokeColor) => {
    db.collection('whiteboards')
      .doc('8yPyB0WTtw5EvqjbrUcB')
      .collection('strokes')
      .add({
        start,
        end,
        strokeColor
      })
      .catch(error => {
        console.error('Error drawing new stroke to Firestore Database: ', error)
      })
  }

  draw = (start, end, strokeColor = 'black', shouldBroadcast = true) => {
    this.drawToDb(start, end, strokeColor, shouldBroadcast)
    console.log(
      'DRAW CALLED',
      'start: ',
      start,
      'end: ',
      end,
      'strokeColor: ',
      strokeColor
    )
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

  componentDidMount() {
    let strokesArray = []
    db.collection('whiteboards')
      .doc('8yPyB0WTtw5EvqjbrUcB')
      .collection('strokes')
      // .limit(10)
      .onSnapshot(strokes => {
        strokes.forEach(stroke => {
          strokesArray.push(stroke.data())
        })
        this.setState({strokes: strokesArray})
      })

    document.addEventListener('DOMContentLoaded', this.setup)
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
        <h1>WHITE BOARD</h1>
        <div id="whiteboard-canvas">
          <h1>Canvas</h1>
        </div>
      </div>
    )
  }
}
export default Canvas
