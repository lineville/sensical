import React, {Component} from 'react'
import Messaging from './Messaging'
import CodeEditorCard from './CodeEditorCard'
import Canvas from './Canvas'
import db from '../firestore'
import firebase from 'firebase'

import {withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import InviteForm from './InviteForm'
import RoomStatusBar from './RoomStatusBar'
import HideBin from './HideBin'

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
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    marginBottom: 16,
    fontSize: 14
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
      chat: true,
      codeEditors: true,
      canvas: true
    }
    this.handleDrop = this.handleDrop.bind(this)
  }

  async componentDidMount() {
    const classroom = await db
      .collection('rooms')
      .doc(this.props.classroom)
      .get()
    this.setState({
      roomId: classroom.id,
      whiteboardId: classroom.data().whiteboardId,
      codeEditorIds: [
        ...this.state.codeEditorIds,
        ...classroom.data().codeEditorIds
      ],
      chatsId: classroom.data().chatsId,
      userIds: classroom.data().userIds
    })
  }

  handleDrop(item) {
    this.setState({[item]: false})
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
        <div className={classes.root}>
          <RoomStatusBar
            roomId={this.state.roomId}
            userIds={this.state.userIds}
          />
          <HideBin />
          <Grid container direction="row" align-items="flex-start">
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
              {this.state.codeEditors ? (
                <CodeEditorCard
                  codeEditors={this.state.codeEditorIds}
                  roomId={this.state.roomId}
                  handleDrop={() => this.handleDrop('codeEditors')}
                />
              ) : null}
            </Grid>
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
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary">
                    Invite a Friend!
                  </Typography>
                  <InviteForm roomId={this.state.roomId} />
                </CardContent>
                <Button>Remove</Button>
              </Card>
            </Grid>
          </Grid>
        </div>
      )
    }
    return <div />
  }
}

export default withStyles(styles)(Classroom)
