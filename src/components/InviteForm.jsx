import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import purple from '@material-ui/core/colors/purple'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
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
      email: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
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

    console.log('inviteeId:', inviteeId)

    let roomsArray = invitedUser.data().rooms
    if (!roomsArray.includes(roomId)) {
      await db
        .collection('users')
        .doc(inviteeId)
        .update({
          rooms: roomsArray.concat(roomId)
        })
    }

    this.setState({email: ''})
    alert(`${invitee.data().username} has been invited`)
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
        <Button variant="contained" color="primary" onClick={this.onSubmit}>
          Invite
        </Button>
      </div>
    )
  }
}

InviteForm.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(InviteForm)
