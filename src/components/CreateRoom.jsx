import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'

import {
  withStyles,
  Snackbar,
  TextField
} from '../../node_modules/@material-ui/core'
import Notification from './Notification'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit
  }
})

export class CreateRoom extends Component {
  constructor() {
    super()
    this.state = {
      subject: '',
      snackBarOpen: false,
      snackBarVariant: '',
      snackBarMessage: ''
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({snackBarOpen: false})
  }

  createRoom = async () => {
    try {
      const currentUser = await firebase.auth().currentUser
      const codeEditor = await db.collection('codeEditors').add({
        code: '',
        userId: currentUser.uid
      })
      const whiteboards = await db.collection('whiteboards').add({strokes: []})
      const chats = await db.collection('chats').add({})
      const notepad = await db.collection('notepads').add({})
      const room = await db.collection('rooms').add({
        whiteboardId: whiteboards.id,
        codeEditorIds: [codeEditor.id],
        notepadId: notepad.id,
        chatsId: chats.id,
        subject: this.state.subject,
        userIds: [currentUser.uid]
      })

      let user = await db
        .collection('users')
        .doc(currentUser.uid)
        .get()
      let roomsArray = user.data().rooms
      if (!roomsArray.includes(room.id)) {
        await db
          .collection('users')
          .doc(currentUser.uid)
          .update({
            rooms: roomsArray.concat(room.id),
            codeEditorId: codeEditor.id
          })
      }
      this.setState({
        subject: '',
        snackBarOpen: true,
        snackBarVariant: 'success',
        snackBarMessage: 'New Classroom successfully created.'
      })
    } catch (error) {
      console.log(error)
      this.setState({
        subject: '',
        snackBarOpen: true,
        snackBarVariant: 'error',
        snackBarMessage:
          'Hmmm, we could not create a new classroom. Sorry about that.'
      })
    }
  }

  render() {
    const {classes} = this.props
    return (
      <div>
        <FormControl className={classes.margin}>
          <TextField
            id="subject"
            name="subject"
            label="Subject"
            className={classes.textField}
            type="subject"
            margin="normal"
            value={this.state.subject}
            onChange={this.handleChange}
          />
        </FormControl>
        <Button onClick={this.createRoom} size="small" color="default">
          Create Room
        </Button>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={this.state.snackBarOpen}
          autoHideDuration={2000}
          onClose={this.handleClose}
        >
          <Notification
            onClose={this.handleClose}
            variant={this.state.snackBarVariant}
            message={this.state.snackBarMessage}
          />
        </Snackbar>
      </div>
    )
  }
}

export default withStyles(styles)(CreateRoom)
