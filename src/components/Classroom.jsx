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

import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import styles from '../styles/ClassroomStyle'

class Classroom extends Component {
  constructor(props) {
    super(props)
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
      notepad: true
    }
    this.handleDrop = this.handleDrop.bind(this)
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
  }

  handleDrop = (item, id) => {
    if (item === 'codeEditor') {
      this.setState({
        codeEditors: {...this.state.codeEditors, [id]: false}
      })
    } else {
      this.setState({[item]: false})
    }
    console.log(this.state)
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
  render() {
    const {classes, positions} = this.props
    if (this.shouldRender()) {
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
    return <div />
  }
}

export default withStyles(styles)(Classroom)
