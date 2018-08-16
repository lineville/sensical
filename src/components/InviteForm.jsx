import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import purple from '@material-ui/core/colors/purple'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Snackbar from '@material-ui/core/Snackbar'
import Notification from './Notification'
import db from '../firestore'

const styles = theme => ({
  container: {
    flexWrap: 'wrap',
    textAlign: 'center',
    position: 'relative',
    display: 'block',
    width: '100%'
  },
  margin: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  cssLabel: {
    '&$cssFocused': {
      color: purple[500]
    }
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: purple[500]
    }
  },
  bootstrapRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3
    }
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  }
})

class InviteForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      open: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return
    }
    this.setState({open: false})
  }

  async onSubmit() {
    const roomId = this.props.roomId

    const invitee = await db
      .collection(`users`)
      .where('email', '==', `${this.state.email}`)
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

    this.setState({email: '', open: true})
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.container}>
        <FormControl className={classes.margin}>
          <TextField
            id="email-input"
            name="email"
            label="Email"
            value={this.state.email}
            className={classes.textField}
            type="email"
            margin="normal"
            onChange={this.handleChange}
          />
        </FormControl>
        <div>
          <Button className={classes.margin} onClick={this.onSubmit}>
            Invite
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
              variant="success"
              message="Invite Sent!"
            />
          </Snackbar>
        </div>
      </div>
    )
  }
}

InviteForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(InviteForm)
