import React, {Component} from 'react'
import db from '../firestore'
import RoomMembers from './RoomMembers'
import HideBin from './HideBin'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import DoneIcon from '@material-ui/icons/Done'
import CancelIcon from '@material-ui/icons/Cancel'
import ListItemText from '@material-ui/core/ListItemText'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Notification from './Notification'

const styles = theme => ({
  root: {
    flexGrow: 1,
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 100
  },
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  },
  text: {
    fontSize: 14,
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
})

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
      inviteEmail: ''
    }
  }

  async componentDidMount() {
    if (this.props.classState.roomId) {
      await db
        .collection('rooms')
        .doc(this.props.classState.roomId)
        .onSnapshot(snapshot => {
          const subject = snapshot.data().subject
          const members = snapshot.data().userIds

          this.setState({
            currentRoom: subject,
            roomMemberIds: members
          })
        })
    }
  }

  toggleDrawer = open => () => {
    this.setState({
      drawerOpen: open
    })
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

  onSubmit = async () => {
    const roomId = this.props.classState.roomId

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
        const newCodeEditorId = await db.collection('codeEditors').add({
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

  render() {
    const {classes} = this.props
    const sideList = (
      <div className={classes.fullList}>
        <List>
          {!this.props.classState.canvas ? (
            <ListItem button>
              <ListItemText
                primary="Canvas"
                onClick={() => this.props.addModule('canvas')}
              />
            </ListItem>
          ) : null}
          {!this.props.classState.codeEditors ? (
            <ListItem button>
              <ListItemText
                primary="Code Editor"
                onClick={() => this.props.addModule('codeEditors')}
              />
            </ListItem>
          ) : null}
          {!this.props.classState.video ? (
            <ListItem button>
              <ListItemText
                primary="Video"
                onClick={() => this.props.addModule('video')}
              />
            </ListItem>
          ) : null}
          {!this.props.classState.notepad ? (
            <ListItem button>
              <ListItemText
                primary="Notepad"
                onClick={() => this.props.addModule('notepad')}
              />
            </ListItem>
          ) : null}
          {!this.props.classState.chat ? (
            <ListItem button>
              <ListItemText
                primary="Chat"
                onClick={() => this.props.addModule('chat')}
              />
            </ListItem>
          ) : null}
          {this.props.classState.canvas &&
          this.props.classState.codeEditors &&
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
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              variant="fab"
              aria-label="Add"
            >
              <AddIcon onClick={this.toggleDrawer(true)} />
            </IconButton>
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
              {this.state.roomMemberIds.map(memberId => {
                return <RoomMembers id={memberId} key={memberId} />
              })}
              <Button
                color="inherit"
                className={classes.button}
                onClick={() => this.setState({inviteFormOpen: true})}
              >
                Invite
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
                  <Button onClick={this.handleClose} color="secondary">
                    <CancelIcon />
                  </Button>
                  <Button onClick={this.onSubmit} color="primary">
                    <DoneIcon />
                  </Button>
                </DialogActions>
              </Dialog>
            </Typography>
            <HideBin />
          </Toolbar>
        </AppBar>
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
      </div>
    )
  }
}

RoomStatusBar.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(RoomStatusBar)
