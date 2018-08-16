import React, {Component} from 'react'
import db from '../firestore'
import Message from './Message'
import firebase from 'firebase'

import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
})

export class Messaging extends Component {
  constructor() {
    super()
    this.state = {
      messages: [],
      newMessage: '',
      user: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    await db
      .collection('chats')
      .doc(this.props.chatsId)
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot(querySnapshot => {
        let messages = []
        querySnapshot.forEach(doc => {
          messages.push({id: doc.id, ...doc.data()})
        })
        this.setState({messages: messages})
      })
    const authUser = await firebase.auth().currentUser
    const user = await db
      .collection('users')
      .doc(authUser.uid)
      .get()
    this.setState({user: user.data().username})
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    await db
      .collection('chats')
      .doc(this.props.chatsId)
      .collection('messages')
      .add({
        user: this.state.user,
        text: this.state.newMessage,
        timestamp: new Date().toUTCString()
      })
    this.setState({
      newMessage: ''
    })
  }

  render() {
    const {classes} = this.props
    return (
      <div id="messages" className="column modal-card is=flex">
        <p className="modal-card-title">Class Chat</p>
        <div className="modal-card-body">
          {this.state.messages.map(message => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        <form onSubmit={this.handleSubmit} className="columns modal-card-foot">
          <input
            className="input"
            type="text"
            name="newMessage"
            value={this.state.newMessage}
            onChange={this.handleChange}
          />

          <Button
            type="submit"
            size="small"
            variant="outlined"
            color="primary"
            className={classes.button}
          >
            Send
          </Button>
        </form>
      </div>
    )
  }
}

Messaging.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Messaging)
