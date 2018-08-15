import React, {Component} from 'react'
import firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyDW_69O9I0nxLViciU5UX0JkefHQxChDC8',
  authDomain: 'figvideo-8a619.firebaseapp.com',
  databaseURL: 'https://figvideo-8a619.firebaseio.com',
  projectId: 'figvideo-8a619',
  storageBucket: 'figvideo-8a619.appspot.com',
  messagingSenderId: '654093138545'
}

try {
  firebase.initializeApp({
    databaseURL: 'https://figvideo-8a619.firebaseio.com'
  })
} catch (err) {
  // we skip the "already exists" message which is
  // not an actual error when we're hot-reloading
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
}

var database = firebase.database().ref()
var yourVideo = document.getElementById('yourVideo')
var friendsVideo = document.getElementById('friendsVideo')
var yourId = Math.floor(Math.random() * 1000000000)
//Create an account on Viagenie (http://numb.viagenie.ca/), and replace {'urls': 'turn:numb.viagenie.ca','credential': 'websitebeaver','username': 'websitebeaver@email.com'} with the information from your account
var servers = {
  iceServers: [
    {urls: 'stun:stun.services.mozilla.com'},
    {urls: 'stun:stun.l.google.com:19302'},
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'lovecheese',
      username: 'pintobeanz95@gmail.com'
    }
  ]
}
var pc = new RTCPeerConnection(servers)
pc.onicecandidate = event =>
  event.candidate
    ? sendMessage(yourId, JSON.stringify({ice: event.candidate}))
    : console.log('Sent All Ice')
pc.onaddstream = event => (friendsVideo.srcObject = event.stream)

function sendMessage(senderId, data) {
  var msg = database.push({sender: senderId, message: data})
  msg.remove()
}

function readMessage(data) {
  var msg = JSON.parse(data.val().message)
  var sender = data.val().sender
  if (sender != yourId) {
    if (msg.ice != undefined) pc.addIceCandidate(new RTCIceCandidate(msg.ice))
    else if (msg.sdp.type == 'offer')
      pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
        .then(() => pc.createAnswer())
        .then(answer => pc.setLocalDescription(answer))
        .then(() =>
          sendMessage(yourId, JSON.stringify({sdp: pc.localDescription}))
        )
    else if (msg.sdp.type == 'answer')
      pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
  }
}

database.on('child_added', readMessage)

function showMyFace() {
  navigator.mediaDevices
    .getUserMedia({audio: true, video: true})
    .then(stream => (yourVideo.srcObject = stream))
    .then(stream => pc.addStream(stream))
}

const showFriendsFace = () => {
  pc.createOffer()
    .then(offer => pc.setLocalDescription(offer))
    .then(() => sendMessage(yourId, JSON.stringify({sdp: pc.localDescription})))
}

export default class VideoChat extends Component {
  constructor() {
    super()
    this.startVideo = this.startVideo.bind(this)
    this.stopVideo = this.stopVideo.bind(this)
  }

  startVideo() {
    return showMyFace()
  }

  stopVideo() {
    yourVideo.srcObject.getTracks().forEach(track => {
      track.stop()
    })
  }

  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.startVideo()
          }}
        >
          Play Video
        </button>
        <button
          onClick={() => {
            this.stopVideo()
          }}
        >
          End Video
        </button>
        <button
          onClick={() => {
            showFriendsFace()
          }}
        >
          call
        </button>
      </div>
    )
  }
}
