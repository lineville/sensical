import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'
import {withRouter} from 'react-router-dom'

import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import ShareIcon from '@material-ui/icons/Share'
import Snackbar from '@material-ui/core/Snackbar'
import Notification from './Notification'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

const styles = theme => ({
  card: {
    maxWidth: 300
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  }
})

export class RoomCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomId: props.roomId,
      room: {},
      inviteEmail: '',
      inviteFormOpen: false,
      open: false,
      snackBarVariant: '',
      snackBarMessage: ''
    }
  }

  componentDidMount() {
    db.collection('rooms')
      .doc(this.state.roomId)
      .get()
      .then(room => this.setState({room: room.data()}))
  }

  joinRoom = () => {
    this.props.history.push(`/classroom/${this.state.roomId}`)
  }

  onSubmit = async () => {
    const roomId = this.state.roomId

    try {
      const invitee = await db
        .collection(`users`)
        .where('email', '==', `${this.state.inviteEmail}`)
        .get()

      const inviteeId = invitee.docs[0].id

      console.log('invitee:', invitee)
      const invitedUser = await db
        .collection('users')
        .doc(inviteeId)
        .get()

      let roomsArray = invitedUser.data().rooms

      const room = await db
        .collection('rooms')
        .doc(roomId)
        .get()

      let userIds = room.data().userIds
      // add another condition
      if (!roomsArray.includes(roomId)) {
        const newCodeEditorId = await db
          .collection('codeEditors')
          .add({code: '', userId: invitedUser.id})
        await db
          .collection('users')
          .doc(inviteeId)
          .update({
            rooms: roomsArray.concat(roomId),
            codeEditorId: newCodeEditorId.id
          })
        await db
          .collection('rooms')
          .doc(roomId)
          .update({
            userIds: userIds.concat(inviteeId),
            codeEditorIds: room.data().codeEditorIds.concat(newCodeEditorId.id)
          })
      }

      this.setState({
        inviteEmail: '',
        snackBarVariant: 'success',
        snackBarMessage: 'Invite successfully sent!',
        open: true,
        inviteFormOpen: false
      })
    } catch (error) {
      console.log('THERE WAS AN ERROR: ', error)
      this.setState({
        snackBarVariant: 'error',
        snackBarMessage:
          'Looks like there was a problem with the email you selected.',
        open: true,
        inviteFormOpen: false
      })
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      open: false,
      inviteFormOpen: false
    })
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  leaveRoom = async () => {
    try {
      const {user} = this.props
      const codeEditorId = user.codeEditorId
      //removes code editor from room
      //removes userId from room
      await db
        .collection('rooms')
        .doc(this.state.roomId)
        .update({
          codeEditorIds: firebase.firestore.FieldValue.arrayRemove(
            codeEditorId
          ),
          userIds: firebase.firestore.FieldValue.arrayRemove(user.id)
        })
      //removes codeEditor from user
      //remove roomId from user
      await db
        .collection('users')
        .doc(user.id)
        .update({
          codeEditorId: '',
          rooms: firebase.firestore.FieldValue.arrayRemove(this.state.roomId)
        })
    } catch (error) {
      console.log('THERE WAS AN ERROR: ', error)
      this.setState({
        snackBarVariant: 'error',
        snackBarMessage:
          'Looks like there was an error while leaving the room.',
        open: true
      })
    }
  }

  render() {
    const {classes} = this.props
    return (
      <React.Fragment>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image="http://cdn.shopify.com/s/files/1/1091/8014/products/whiteyboard_chalkboard_grande.jpeg?v=1528698765"
            title={this.state.room.subject}
          />
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              {this.state.room.subject}
            </Typography>
            <Typography component="p">Practice your coding here.</Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.joinRoom}
            >
              Join
            </Button>
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              onClick={() => this.setState({inviteFormOpen: true})}
            >
              Invite
              <ShareIcon className={classes.rightIcon} />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={this.leaveRoom}
            >
              Leave
              <DeleteIcon className={classes.rightIcon} />
            </Button>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              open={this.state.open}
              autoHideDuration={6000}
              onClose={this.handleClose}
            >
              <Notification
                onClose={this.handleClose}
                variant={this.state.snackBarVariant}
                message={this.state.snackBarMessage}
              />
            </Snackbar>

            <Dialog
              open={this.state.inviteFormOpen}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Invite To Room</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="normal"
                  id="name"
                  name="inviteEmail"
                  label="Email"
                  type="email"
                  className={classes.textField}
                  onChange={this.handleChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="secondary">
                  Cancel
                </Button>
                <Button onClick={this.onSubmit} color="primary">
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </CardActions>
        </Card>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(withRouter(RoomCard))
