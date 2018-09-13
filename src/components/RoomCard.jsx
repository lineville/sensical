import React, {Component} from 'react'
import db from '../firestore'
import firebase from 'firebase'
import {withRouter, Link} from 'react-router-dom'
import {withStyles} from '@material-ui/core/styles'
import {Notification} from '../imports'
import styles from '../styles/RoomCardStyles'
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Snackbar,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core/'
import {
  Delete as DeleteIcon,
  Done as DoneIcon,
  Cancel as CancelIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  School as SchoolIcon
} from '@material-ui/icons/'

export class RoomCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomId: props.roomId,
      room: {},
      inviteEmail: '',
      inviteFormOpen: false,
      editFormOpen: false,
      open: false,
      snackBarVariant: '',
      snackBarMessage: '',
      newSubject: '',
      newImageURL: ''
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

      const invitedUser = await db
        .collection('users')
        .doc(inviteeId)
        .get()

      let roomsArray = invitedUser.data().rooms
      let codeEditorsArray = invitedUser.data().codeEditorIds

      const room = await db
        .collection('rooms')
        .doc(roomId)
        .get()

      let userIds = room.data().userIds
      if (!roomsArray.includes(roomId)) {
        const newCodeEditor = await db.collection('codeEditors').add({
          code: '',
          userId: invitedUser.id,
          settings: {
            mode: 'javascript',
            theme: 'monokai',
            fontSize: 12,
            showGutter: true,
            showLineNumbers: true,
            tabSize: 2
          }
        })
        await db
          .collection('users')
          .doc(inviteeId)
          .update({
            rooms: roomsArray.concat(roomId),
            codeEditorIds: codeEditorsArray.concat(newCodeEditor.id)
          })
        await db
          .collection('rooms')
          .doc(roomId)
          .update({
            userIds: userIds.concat(inviteeId),
            codeEditorIds: room.data().codeEditorIds.concat(newCodeEditor.id)
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
      this.setState({
        snackBarVariant: 'error',
        snackBarMessage:
          'Looks like there was a problem with the email you selected.',
        open: true,
        inviteFormOpen: false
      })
    }
  }

  handleEdit = async () => {
    if (this.state.newSubject.length) {
      await db
        .collection('rooms')
        .doc(this.state.roomId)
        .update({
          subject: this.state.newSubject
        })
      await this.setState({
        snackBarMessage: 'Subject changed successfully!',
        room: {...this.state.room, subject: this.state.newSubject}
      })
    }
    if (this.state.newImageURL.length) {
      await db
        .collection('rooms')
        .doc(this.state.roomId)
        .update({
          imageURL: this.state.newImageURL
        })
      await this.setState({
        snackBarMessage: 'Classroom image changed successfully!',
        room: {...this.state.room, imageURL: this.state.newImageURL}
      })
    }

    await this.setState({
      open: true,
      snackBarVariant: 'success',
      editFormOpen: false
    })
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      open: false,
      inviteFormOpen: false,
      editFormOpen: false,
      snackBarMessage: ''
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
      const codeEditorId = user.codeEditorIds.filter(id =>
        this.state.room.codeEditorIds.includes(id)
      )[0]
      //removes code editor from room
      //removes userId from room
      await this.setState({
        snackBarMessage: 'You have successfully left this room!',
        snackBarVariant: 'success',
        open: true
      })
      await db
        .collection('rooms')
        .doc(this.state.roomId)
        .update({
          codeEditorIds: firebase.firestore.FieldValue.arrayRemove(
            codeEditorId
          ),
          userIds: firebase.firestore.FieldValue.arrayRemove(user.id)
        })
      await db
        .collection('users')
        .doc(user.id)
        .update({
          codeEditorId: '',
          rooms: firebase.firestore.FieldValue.arrayRemove(this.state.roomId)
        })
    } catch (error) {
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
          <Link to={`/classroom/${this.state.roomId}`}>
            <CardMedia
              className={classes.media}
              image={this.state.room.imageURL}
              title={this.state.room.subject}
            />
          </Link>
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              {this.state.room.subject}
              <Button
                variant="fab"
                mini
                color="secondary"
                className={classes.button}
                onClick={() => this.setState({editFormOpen: true})}
              >
                <EditIcon />
              </Button>
            </Typography>
            <Typography component="p">Practice your coding here.</Typography>
          </CardContent>
          <CardActions>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={this.joinRoom}
            >
              Join
              <SchoolIcon className={classes.rightIcon} />
            </Button>
            <Button
              variant="outlined"
              color="default"
              className={classes.button}
              onClick={() => this.setState({inviteFormOpen: true})}
            >
              Invite
              <PersonAddIcon className={classes.rightIcon} />
            </Button>

            <Button
              variant="outlined"
              color="default"
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
              onSubmit={this.onSubmit}
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
                <Button onClick={this.handleClose} color="error">
                  <CancelIcon />
                </Button>
                <Button onClick={this.onSubmit} color="primary">
                  <DoneIcon />
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={this.state.editFormOpen}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Edit Room</DialogTitle>

              <DialogContent>
                <TextField
                  autoFocus
                  margin="normal"
                  id="subject"
                  name="newSubject"
                  label="Subject"
                  placeholder={this.state.room.subject}
                  type="text"
                  className={classes.textField}
                  onChange={this.handleChange}
                />
                <TextField
                  autoFocus
                  margin="normal"
                  id="roomImage"
                  name="newImageURL"
                  label="image URL"
                  placeholder={this.state.room.imageURL}
                  type="text"
                  className={classes.textField}
                  onChange={this.handleChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="error">
                  <CancelIcon />
                </Button>
                <Button onClick={this.handleEdit} color="primary">
                  <DoneIcon />
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
