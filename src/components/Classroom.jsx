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
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import InviteForm from './InviteForm'
import RoomStatusBar from './RoomStatusBar'

const styles = theme => ({
  root: {
    flexGrow: 1
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
      codeEditors: true,
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
  }

  handleDrop(item) {
    this.setState({[item]: false})
  }

  addModule(item) {
    this.setState({[item]: true})
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
    const {classes} = this.props
    if (this.shouldRender()) {
      return (
        <div>
          <div className={classes.root}>
            <Grid container direction="row" align-items="flex-start">
              <Grid item>
                {this.state.video ? (
                  <VideoCard
                    roomId={this.state.roomId}
                    handleDrop={() => this.handleDrop('video')}
                  />
                ) : null}
              </Grid>
              {this.state.chat ? (
                <Grid item>
                  <Messaging
                    chatsId={this.state.chatsId}
                    roomId={this.state.roomId}
                    handleDrop={() => this.handleDrop('chat')}
                  />
                </Grid>
              ) : null}
              <Grid item>
                {this.state.canvas ? (
                  <Canvas
                    whiteboardId={this.state.whiteboardId}
                    roomId={this.state.roomId}
                    handleDrop={() => this.handleDrop('canvas')}
                  />
                ) : null}
              </Grid>
              <Grid item>
                {this.state.notepad ? (
                  <Notepad
                    notepadId={this.state.notepadId}
                    roomId={this.state.roomId}
                    handleDrop={() => this.handleDrop('notepad')}
                  />
                ) : null}
              </Grid>
              <Grid item>
                {this.state.codeEditors ? (
                  <CodeEditorCard
                    codeEditors={this.state.codeEditorIds}
                    roomId={this.state.roomId}
                    handleDrop={() => this.handleDrop('codeEditors')}
                  />
                ) : null}
              </Grid>
            </Grid>
          </div>
          <RoomStatusBar
            classState={this.state}
            addModule={module => this.addModule(module)}
          />
        </div>
      )
    }
    return <div />
  }
}

export default withStyles(styles)(Classroom)
