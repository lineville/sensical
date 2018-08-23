import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'
import {
  Messaging,
  CodeEditorCard,
  Canvas,
  VideoCard,
  Notepad,
  RoomStatusBar
} from '../imports'

import {Notification} from '../imports'
import {Snackbar} from '@material-ui/core/'
import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import styles from '../styles/ClassroomStyle'

class Classroom extends Component {
  constructor() {
    super()
    this.state = {
      userIds: [],
      roomId: '',
      whiteboardId: '',
      chatsId: '',
      notepadId: '',
      chat: true,
      codeEditors: {},
      canvas: true,
      video: true,
      notepad: true,
      open: false,
      popUpMessageType: 'warning',
      popUpMessage: `You don't have access to this room`,
      allowedinRoom: false
    }
    this.handleDrop = this.handleDrop.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  async componentDidMount() {
    const classroom = await db
      .collection('rooms')
      .doc(this.props.classroom)
      .get()
    const codeEditors = {}
    classroom.data().codeEditorIds.forEach(id => {
      codeEditors[id] = true
    })
    this.setState({
      userIds: classroom.data().userIds,
      roomId: classroom.id,
      whiteboardId: classroom.data().whiteboardId,
      codeEditors,
      chatsId: classroom.data().chatsId,
      notepadId: classroom.data().notepadId
    })

    db.collection('rooms')
      .doc(this.props.classroom)
      .onSnapshot(snapshot => {
        let editors = {}
        snapshot.data().codeEditorIds.forEach(id => {
          editors[id] = true
        })
        this.setState({
          codeEditors: editors
        })
      })

    const userId = firebase.auth().currentUser.uid
    if (this.state.userIds.includes(userId)) {
      this.setState({allowedinRoom: true})
    } else {
      this.setState({open: true})
    }
  }

  handleDrop = (item, id) => {
    if (item === 'codeEditor') {
      this.setState({
        codeEditors: {...this.state.codeEditors, [id]: false}
      })
    } else {
      this.setState({[item]: false})
    }
  }

  addModule = (item, id) => {
    if (item === 'codeEditor') {
      this.setState({codeEditors: {...this.state.codeEditors, [id]: true}})
    } else {
      this.setState({[item]: true})
    }
  }

  shouldRender = () => {
    const hasCodeEditorIds = true
    Object.keys(this.state.codeEditors).forEach(editorId => {
      return this.state.codeEditors[editorId]
    })
    return (
      hasCodeEditorIds &&
      this.state.chatsId.length &&
      this.state.whiteboardId.length &&
      firebase.auth().currentUser
    )
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      open: false
    })
    this.props.history.push('/profile')
  }

  render() {
    const {classes, positions} = this.props
    if (this.state.allowedinRoom && this.shouldRender()) {
      return (
        <div className={classes.root}>
          <div className={classes.room}>
            <Grid container direction="row" align-items="flex-start">
              <Grid item>
                {this.state.video ? (
                  <VideoCard
                    roomId={this.state.roomId}
                    handleDrop={() => this.handleDrop('video')}
                    position={positions.video}
                  />
                ) : null}
              </Grid>
              {this.state.chat ? (
                <Grid item>
                  <Messaging
                    chatsId={this.state.chatsId}
                    roomId={this.state.roomId}
                    handleDrop={() => this.handleDrop('chat')}
                    position={positions.messaging}
                  />
                </Grid>
              ) : null}
              <Grid item>
                {this.state.canvas ? (
                  <Canvas
                    whiteboardId={this.state.whiteboardId}
                    roomId={this.state.roomId}
                    handleDrop={() => this.handleDrop('canvas')}
                    position={positions.canvas}
                  />
                ) : null}
              </Grid>
              <Grid item>
                {this.state.notepad ? (
                  <Notepad
                    notepadId={this.state.notepadId}
                    roomId={this.state.roomId}
                    handleDrop={() => this.handleDrop('notepad')}
                    position={positions.notepad}
                  />
                ) : null}
              </Grid>
              {Object.values(this.state.codeEditors).includes(true)
                ? Object.keys(this.state.codeEditors)
                    .filter(id => this.state.codeEditors[id])
                    .map(id => {
                      return (
                        <CodeEditorCard
                          key={id}
                          codeEditorId={id}
                          allEditorIds={Object.keys(this.state.codeEditors)}
                          roomId={this.state.roomId}
                          handleDrop={() => this.handleDrop('codeEditor', id)}
                          position={positions.codeEditors[id]}
                        />
                      )
                    })
                : null}
            </Grid>
            <RoomStatusBar
              classState={this.state}
              addModule={(mod, id) => this.addModule(mod, id)}
              handleDrop={this.handleDrop}
            />
          </div>
        </div>
      )
    }
    if (!this.state.allowedinRoom) {
      return (
        <React.Fragment>
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            open={this.state.open}
            autoHideDuration={10000}
            onClose={this.handleClose}
          >
            <Notification
              onClose={this.handleClose}
              variant={this.state.popUpMessageType}
              message={this.state.popUpMessage}
            />
          </Snackbar>
        </React.Fragment>
      )
    }
  }
}

export default withStyles(styles)(Classroom)
