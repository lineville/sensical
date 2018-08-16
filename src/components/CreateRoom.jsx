import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'

import {withStyles, TextField} from '../../node_modules/@material-ui/core'
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
      subject: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  createRoom = async () => {
    const whiteboards = await db.collection('whiteboards').add({})
    const fireCodes = await db.collection('fireCodes').add({
      code1: '',
      code2: ''
    })
    const chats = await db.collection('chats').add({})
    const room = await db.collection('rooms').add({
      whiteboardId: whiteboards.id,
      fireCodesId: fireCodes.id,
      chatsId: chats.id,
      subject: this.state.subject
    })

    const currentUser = await firebase.auth().currentUser
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
          rooms: roomsArray.concat(room.id)
        })
    }
    this.setState({
      subject: ''
    })
  }

  render() {
    const {classes} = this.props
    return (
      <div>
        <FormControl className={classes.margin}>
          <TextField
            id="subject"
            name="subject"
            placeholder="Subject"
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
      </div>
    )
  }
}

export default withStyles(styles)(CreateRoom)
