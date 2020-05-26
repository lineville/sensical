import React, {Component} from 'react'
import db from '../firestore'
import Notification from './Notification'
import RoomMembers from './RoomMembers'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import styles from '../styles/RoomStatusBarStyles'
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Button,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core/'
import {
  PersonAdd as PersonAddIcon,
  Done as DoneIcon,
  Cancel as CancelIcon,
  AddCircleOutline as AddIcon,
} from '@material-ui/icons/'

class RoomStatusBar extends Component {
  constructor() {
    super()
    this.state = {
      currentRoom: '',
      roomMemberIds: [],
      drawerOpen: false,
      inviteFormOpen: false,
      open: false,
      snackBarVariant: '',
      snackBarMessage: '',
      inviteEmail: '',
    }
  }

  async componentDidMount() {
    if (this.props.classState.roomId) {
      await db
        .collection('rooms')
        .doc(this.props.classState.roomId)
        .onSnapshot((snapshot) => {
          const subject = snapshot.data().subject
          const members = snapshot.data().userIds
          this.setState({
            currentRoom: subject,
            roomMemberIds: members,
          })
        })
    }
  }

  toggleDrawer = (open) => () => {
    this.setState({
      drawerOpen: open,
    })
  }
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    this.setState({
      open: false,
      inviteFormOpen: false,
    })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  onSubmit = async () => {
    const roomId = this.props.classState.roomId

    try {
      const invitee = await db
        .collection(`users`)
        .where('email', '==', `${this.state.inviteEmail}`)
        .get()

      const inviteeId = invitee.docs[0].id

      const invitedUser = await db.collection('users').doc(inviteeId).get()

      let roomsArray = invitedUser.data().rooms

      const room = await db.collection('rooms').doc(roomId).get()

      let userIds = room.data().userIds
      if (!roomsArray.includes(roomId)) {
        const newCodeEditorId = await db.collection('codeEditors').add({
          code: '',
          userId: invitedUser.id,
          settings: {
            mode: 'javascript',
            theme: 'monokai',
            fontSize: 12,
            showGutter: true,
            showLineNumbers: true,
            tabSize: 2,
          },
        })
        await db
          .collection('users')
          .doc(inviteeId)
          .update({
            rooms: roomsArray.concat(roomId),
            codeEditorId: newCodeEditorId.id,
          })
        await db
          .collection('rooms')
          .doc(roomId)
          .update({
            userIds: userIds.concat(inviteeId),
            codeEditorIds: room.data().codeEditorIds.concat(newCodeEditorId.id),
          })
      }
      this.setState({
        inviteEmail: '',
        snackBarVariant: 'success',
        snackBarMessage: 'Invite successfully sent!',
        open: true,
        inviteFormOpen: false,
      })
    } catch (error) {
      console.log('THERE WAS AN ERROR: ', error)
      this.setState({
        snackBarVariant: 'error',
        snackBarMessage:
          'Looks like there was a problem with the email you selected.',
        open: true,
        inviteFormOpen: false,
      })
    }
  }

  render() {
    const {classes} = this.props
    const sideList = (
      <div className={classes.fullList}>
        <List>
          {!this.props.classState.canvas ? (
            <ListItem button onClick={() => this.props.addModule('canvas')}>
              <ListItemText primary="Canvas" />
            </ListItem>
          ) : null}
          {Object.values(this.props.classState.codeEditors).includes(false)
            ? Object.keys(this.props.classState.codeEditors)
                .filter((id) => !this.props.classState.codeEditors[id])
                .map((id) => {
                  return (
                    <ListItem key={id} button>
                      <ListItemText
                        primary="Code Editor"
                        onClick={() => this.props.addModule('codeEditor', id)}
                      />
                    </ListItem>
                  )
                })
            : null}
          {!this.props.classState.video ? (
            <ListItem button onClick={() => this.props.addModule('video')}>
              <ListItemText primary="Video" />
            </ListItem>
          ) : null}
          {!this.props.classState.notepad ? (
            <ListItem button onClick={() => this.props.addModule('notepad')}>
              <ListItemText primary="Notepad" />
            </ListItem>
          ) : null}
          {!this.props.classState.chat ? (
            <ListItem button onClick={() => this.props.addModule('chat')}>
              <ListItemText primary="Chat" />
            </ListItem>
          ) : null}
          {this.props.classState.canvas &&
          !Object.values(this.props.classState.codeEditors).includes(false) &&
          this.props.classState.video &&
          this.props.classState.notepad &&
          this.props.classState.chat ? (
            <ListItem>
              <ListItemText primary="No Extra Modules To Add" />
            </ListItem>
          ) : null}
        </List>
      </div>
    )
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={classes.content}>
            {/* <Button
              variant="fab"
              color="default"
              onClick={this.toggleDrawer(true)}
              aria-label="Add"
              className={classes.button}
            > */}
            <AddIcon onClick={this.toggleDrawer(true)} />
            {/* </Button> */}
            <Drawer
              open={this.state.drawerOpen}
              onClose={this.toggleDrawer(false)}
            >
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer(false)}
                onKeyDown={this.toggleDrawer(false)}
              >
                {sideList}
              </div>
            </Drawer>
            <Typography
              variant="title"
              color="inherit"
              className={classes.text}
            >
              Room Name: &nbsp;
              {this.state.currentRoom}
            </Typography>
            <Typography
              variant="title"
              color="inherit"
              className={classes.text}
            >
              Room Members:
              {this.state.roomMemberIds.map((memberId) => {
                return <RoomMembers id={memberId} key={memberId} />
              })}
              <Button
                color="inherit"
                className={classes.button}
                onClick={() => this.setState({inviteFormOpen: true})}
              >
                <PersonAddIcon className={classes.rightIcon} />
              </Button>
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
                  <Button onClick={this.handleClose} color="error">
                    <CancelIcon />
                  </Button>
                  <Button onClick={this.onSubmit} color="primary">
                    <DoneIcon />
                  </Button>
                </DialogActions>
              </Dialog>
            </Typography>
          </Toolbar>
        </AppBar>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
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
      </div>
    )
  }
}

RoomStatusBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(RoomStatusBar)
