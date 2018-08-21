import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'
import Messaging from './Messaging'
import CodeEditorCard from './CodeEditorCard'
import Canvas from './Canvas'
import VideoCard from './VideoCard'
import Notepad from './Notepad'

import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import RoomStatusBar from './RoomStatusBar'
import {id} from 'brace/worker/xml'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: '264px'
  },
  room: {
    flexGrow: 1,
    height: '100vh'
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  card: {
    minWidth: 275
  },
  pos: {
    marginBottom: 12
  }
})

class Classroom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userIds: [],
      roomId: '',
      whiteboardId: '',
      codeEditorIds: [],
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
    this.setState({
      userIds: classroom.data().userIds,
      roomId: classroom.id,
      whiteboardId: classroom.data().whiteboardId,
      codeEditorIds: [
        ...this.state.codeEditorIds,
        ...classroom.data().codeEditorIds
      ],
      chatsId: classroom.data().chatsId,
      notepadId: classroom.data().notepadId
    })

    db.collection('rooms')
      .doc(this.props.classroom)
      .onSnapshot(snapshot => {
        this.setState({
          codeEditorIds: snapshot.data().codeEditorIds
        })
      })
  }

  handleDrop(item) {
    if (item === 'codeEditor') {
      this.setState({codeEditors: {...this.state.codeEditors, item: false}})
    } else {
      this.setState({[item]: false})
    }
  }

  addModule(item) {
    if (item === 'codeEditor') {
      this.setState({codeEditors: {...this.state.codeEditors, item: true}})
    } else {
      this.setState({[item]: true})
    }
  }

  shouldRender = () => {
    const hasCodeEditorIds = true
    this.state.codeEditorIds.forEach(editorId => {
      if (!editorId.length) return false
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
              {this.state.codeEditorIds
                ? this.state.codeEditorIds.map(id => {
                    return (
                      <CodeEditorCard
                        key={id}
                        codeEditorId={id}
                        allEditorIds={this.state.codeEditorIds}
                        roomId={this.state.roomId}
                        handleDrop={() => this.handleDrop('codeEditor')}
                        position={positions.codeEditors[id]}
                      />
                    )
                  })
                : null}
            </Grid>
            <RoomStatusBar
              classState={this.state}
              addModule={mod => this.addModule(mod)}
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
