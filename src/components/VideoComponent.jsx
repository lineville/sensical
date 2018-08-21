import React, {Component} from 'react'
import Video from 'twilio-video'
import axios from 'axios'
import {withStyles} from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  }
})

export class VideoComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      identity: null,
      roomName: this.props.roomId,
      roomNameErr: false, // Track error for room name TextField
      previewTracks: null,
      localMediaAvailable: false,
      hasJoinedRoom: false,
      activeRoom: '', // Track the current active room
      otherpersoninRoom: false
    }
    this.joinRoom = this.joinRoom.bind(this)
    this.roomJoined = this.roomJoined.bind(this)
    this.leaveRoom = this.leaveRoom.bind(this)
    this.detachTracks = this.detachTracks.bind(this)
    this.detachParticipantTracks = this.detachParticipantTracks.bind(this)
  }

  joinRoom() {
    if (!this.state.roomName.trim()) {
      this.setState({roomNameErr: true})
      return
    }
    console.log("Joining room '" + this.state.roomName + "'...")
    let connectOptions = {
      name: this.state.roomName
    }

    if (this.state.previewTracks) {
      connectOptions.tracks = this.state.previewTracks
    }

    // Join the Room with the token from the server and the
    // LocalParticipant's Tracks.
    // console.log(this.state.token)
    Video.connect(
      this.state.token,
      connectOptions
    ).then(this.roomJoined, error => {
      alert('Could not connect to Twilio: ' + error.message)
    })
  }

  attachTracks(tracks, container) {
    tracks.forEach(track => {
      console.log('TRACK: ', track)
      container.appendChild(track.attach())
    })
  }

  // Attaches a track to a specified DOM container
  attachParticipantTracks(participant, container) {
    var tracks = Array.from(participant.tracks.values())
    this.attachTracks(tracks, container)
  }

  detachTracks(tracks) {
    tracks.forEach(track => {
      track.detach().forEach(detachedElement => {
        detachedElement.remove()
      })
    })
  }

  detachParticipantTracks(participant) {
    console.log('DETACH PARTICIPANT TRACK RAN')
    var tracks = Array.from(participant.tracks.values())
    this.detachTracks(tracks)
  }

  roomJoined(room) {
    // Called when a participant joins a room
    console.log("Joined as '" + this.state.identity + "'")
    this.setState({
      activeRoom: room,
      localMediaAvailable: true,
      hasJoinedRoom: true
    })

    // Attach LocalParticipant's Tracks, if not already attached.
    var previewContainer = this.refs.localMedia
    if (!previewContainer.querySelector('video')) {
      this.attachParticipantTracks(room.localParticipant, previewContainer)
      previewContainer.children[1].setAttribute('width', '100%')
    }

    // Attach the Tracks of the Room's Participants.
    room.participants.forEach(participant => {
      console.log("Already in Room: '" + participant.identity + "'")
      var previewContainer = this.refs.remoteMedia
      this.attachParticipantTracks(participant, previewContainer)
      console.log('line106', previewContainer)
      // previewContainer.children.forEach(child =>
      //   child.setAttribute('with', '100%')
      // )
      // previewContainer.children[1].setAttribute('width', '100%')
    })

    // When a Participant joins the Room, log the event.
    room.on('participantConnected', participant => {
      console.log("Joining: '" + participant.identity + "'")
    })

    // When a Participant adds a Track, attach it to the DOM.
    //'trackAdded'
    room.on('trackSubscribed', (track, participant) => {
      console.log(participant.identity + ' added track: ' + track.kind)
      var previewContainer = this.refs.remoteMedia
      this.attachTracks([track], previewContainer)
      console.log('line 119', previewContainer)
      this.setState({otherpersoninRoom: true})
      if (previewContainer.children.length) {
        previewContainer.children[1].setAttribute('width', '100%')
      }
    })

    // When a Participant removes a Track, detach it from the DOM.
    //'trackRemoved'
    room.on('trackUnsubscribed', (track, participant) => {
      console.log(participant.identity + ' removed track: ' + track.kind)
      this.detachTracks([track])
      this.setState({otherpersoninRoom: false})
      var element = Document.getElementById('remote-media')
      element.remove()
    })

    // When a Participant leaves the Room, detach its Tracks.
    room.on('participantDisconnected', participant => {
      console.log("Participant '" + participant.identity + "' left the room")
      this.detachParticipantTracks(participant)
      var element = Document.getElementById('remote-media')
      element.remove()
    })

    // Once the LocalParticipant leaves the room, detach the Tracks
    // of all Participants, including that of the LocalParticipant.
    room.on('disconnected', () => {
      console.log('ROOM DISCONNECTED')
      if (this.state.previewTracks) {
        this.state.previewTracks.forEach(track => {
          track.stop()
        })
      }
      this.detachParticipantTracks(room.localParticipant)
      room.participants.forEach(this.detachParticipantTracks)
      this.setState({activeRoom: null})
      this.setState({hasJoinedRoom: false, localMediaAvailable: false})
    })
  }

  componentDidMount() {
    axios.get('/token').then(results => {
      const {identity, token} = results.data
      this.setState({identity, token})
    })
  }

  leaveRoom() {
    this.state.activeRoom.disconnect()
    this.setState({hasJoinedRoom: false, localMediaAvailable: false})
  }

  toggleVideo = () => {
    if (this.state.hasJoinedRoom) {
      this.leaveRoom()
    } else {
      this.joinRoom()
    }
  }

  render() {
    const {classes} = this.props
    // Only show video track after user has joined a room
    let showLocalTrack = this.state.localMediaAvailable ? (
      <div className="flex-item">
        <div ref="localMedia" width="100%" />
      </div>
    ) : (
      ''
    )
    return (
      <div className={classes.root}>
        <Switch
          checked={this.state.hasJoinedRoom}
          onChange={this.toggleVideo}
          value={'' + this.state.hasJoinedRoom}
          color="primary"
        />
        {showLocalTrack}
        <div
          className="flex-item"
          ref="remoteMedia"
          id="remote-media"
          width="100%"
        />
      </div>
    )
  }
}

export default withStyles(styles)(VideoComponent)
